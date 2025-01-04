import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { useBasketStore } from "../../../../zustand/basketStore.jsx";
import {SHOP_PAGE, USER_SINGLE_CHECKOUT} from "../../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import {Delete} from "@mui/icons-material";
import "./singleBasket.css";
import {userStore} from "../../../../zustand/userStore.jsx";

const SingleBasket = ({user}) => {
    const { shop_id, user_id, language } = useParams();
    const {data} = userStore()
    const {
        getSingleBasket,
        single_basket_data,

        getTotalSum,
        total_sum,
        getProductsForCart,
        single_basket_products,

        deleteCartProduct,

        addToCart,
        decrementCart
    } = useBasketStore();

    useEffect(() => {
        if (shop_id) {
            Promise.all([
                getSingleBasket(user_id, shop_id),
                getProductsForCart(shop_id),

            ]);
        }
    }, [shop_id, user_id]);

    const numberFormatter = useCallback((number) => {
        if (number == null) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, []);


    const handleDelete = async (productId) => {
        const existingProduct = single_basket_data?.carts?.find(
            (item) => item.product_id === productId
        );

        if (existingProduct) {
            try {
                deleteCartProduct(productId ,user_id , existingProduct.id);
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };



    const matchedProducts = useMemo(() => {
        if (!single_basket_data?.carts || !single_basket_products) return [];

        return single_basket_products.flatMap((productGroup) =>
            productGroup.products.map(productItem => {
                const cartItem = single_basket_data.carts.find(cart => cart.product_id === productItem.product.id);
                if (cartItem) {
                    return {
                        ...productItem.product,
                        count: cartItem.count,
                        photo:productItem.photo
                    };
                }
                return null;
            }).filter(Boolean)
        );
    }, [single_basket_data, single_basket_products]);

    console.log(matchedProducts)
    return (
        <div>
            <div className="shop_page_header container">
                <Link
                    className="user_map_top_back"
                    to={SHOP_PAGE.replace(":user_id", user_id).replace(":language", language).replace(":shop_id", shop_id)}
                >
                    <ChevronLeftIcon />
                </Link>
                <p>{numberFormatter(total_sum)} so'm</p>
                <h1 className="shop_name">
                {single_basket_data?.shops?.[0]?.name || 'Do\'kon'}
                </h1>
            </div>
            <div className="carts-section">
                <div className="basket_page container">
                    {matchedProducts.length > 0 ? (
                        matchedProducts.map(product => {
                            const existingProduct = single_basket_data?.carts?.find(
                                item => item.product_id === parseInt(product.id)
                            );
                            return (

                                <SwipeToDelete
                                    key={product.id}
                                    onDelete={() => handleDelete(product.id)}
                                    deleteColor="red"
                                    deleteComponent={<Delete/>}
                                    height={80}
                                >
                                    <div className="basket_product_item">
                                        <div className="basket_product_item_photo">
                                            {product.photo && (
                                                <img src={"https://backend1.mussi.uz/" + product.photo} alt=""/>
                                            )}
                                        </div>
                                        <div className="basket_product_item_text">
                                            <h3>{product.name}</h3>
                                            <p>
                                                {data.type === "one" && <>{numberFormatter(product.one_price * product.count)} so'm</>}
                                                {data.type === "optom" && <>{numberFormatter(product.optom_price * product.count)} so'm</>}
                                                {data.type === "restorator" && <>{numberFormatter(product.restorator_price * product.count)} so'm</>}
                                            </p>
                                        </div>
                                        <div className="basket_product_item_update">
                                            <div className="basket_product_item_update_box">
                                                <button onClick={() => {
                                                    addToCart(user_id, shop_id, product.id, existingProduct ? existingProduct.count + 1 : 1, "add")

                                                }
                                                }>+
                                                </button>
                                                <p>{product.count}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        if (existingProduct.count > 0)
                                                            decrementCart(user_id, shop_id, product.id, existingProduct, existingProduct.count - 1);
                                                    }}
                                                >-
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </SwipeToDelete>

                            )
                        })

                    ) : (
                        <p>Mahsulotlar topilmadi</p>
                    )}
                </div>
            </div>

            <div className="single_basket_order_box">
                <Link className="single_basket_order_btn"
                      to={USER_SINGLE_CHECKOUT.replace(":user_id", user_id).replace(":language", language).replace(":shop_id", shop_id)}>
                    Buyurtma qilish
                </Link>
            </div>
        </div>
    );
};

export default SingleBasket;