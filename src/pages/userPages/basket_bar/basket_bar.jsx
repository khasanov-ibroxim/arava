import React, {useCallback, useEffect, useMemo, useState} from 'react';
import "./basket.css";
import {Swiper, SwiperSlide} from "swiper/react";
import {useBasketStore} from "../../../zustand/basketStore.jsx";
import {Link, useParams} from "react-router-dom";
import No_data from "../../../component/no_data/no_data.jsx";
import {Delete} from "@mui/icons-material";
import SwipeToDelete from "react-swipe-to-delete-ios";
import {userStore} from "../../../zustand/userStore.jsx";
import Loading from "../../../component/loading/loading.jsx";
import {USER_SINGLE_CHECKOUT} from "../../../utils/const.jsx";


const Basket_bar = () => {
    const {data} = userStore()
    const {
        basketAllShops,
        getAllShopsBasket,
        single_basket_data,
        single_basket_products,
        getSingleBasket,
        getProductsForCart,
        addToCart,
        decrementCart,
        deleteCartProduct
    } = useBasketStore();

    const {user_id, language} = useParams();
    const [shopsData, setShopsData] = useState([]);
    const [selectedShop, setSelectedShop] = useState(null); // Tanlangan shopni saqlash


    useEffect(() => {
        if (selectedShop) {
            getSingleBasket(user_id, selectedShop.shop.id);
            getProductsForCart(selectedShop.shop.id);
        }
    }, [selectedShop, user_id, getSingleBasket, getProductsForCart]);

    useEffect(() => {
        if (basketAllShops && basketAllShops.length > 0) {
            setShopsData(basketAllShops);
            setSelectedShop(basketAllShops[0]); // Dastlab birinchi shopni tanlash
        }
    }, [basketAllShops]);

    const handleShopSelect = (shop) => {
        setSelectedShop(shop);
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
                        photo: productItem.photo
                    };
                }
                return null;
            }).filter(Boolean)
        );
    }, [single_basket_data, single_basket_products]);

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
                await deleteCartProduct(productId, user_id, existingProduct.id);
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };
    useEffect(() => {

        getAllShopsBasket(user_id);
    }, [user_id]);

    return (
        <div className="basket_box">
            {shopsData.length > 0 ? (
                <>
                    <Swiper
                        className="btn-button shop_category"
                        grabCursor={true}
                        spaceBetween={5}
                        slidesPerView={2.5}
                        loop={false}
                        touchRatio={1}
                        resistanceRatio={0.5}
                        speed={600}
                        onSlideChange={(swiper) => handleShopSelect(shopsData[swiper.activeIndex])}
                    >
                        {shopsData.map((shop, index) => {
                            if (shop.carts.length > 0) {
                                return (<SwiperSlide key={index} onClick={() => handleShopSelect(shop)}
                                                     className={`shop-item ${selectedShop?.shop?.id === shop.shop.id ? 'activeCategory' : ''}`}>

                                    {shop.shop.name}

                                </SwiperSlide>)
                            }
                        })}
                    </Swiper>

                    <div className="carts-section">
                        <h4>{selectedShop?.shop?.name} do‘konidagi tovarlar</h4>
                        <div className="basket_page container">
                            {matchedProducts.length > 0 ? (
                                matchedProducts.map((product, index) => {
                                        const existingProduct = single_basket_data?.carts?.find(
                                            item => item.product_id === parseInt(product.id)
                                        );

                                        return (<>
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
                                                                <img src={"https://backend1.mussi.uz/" + product.photo}
                                                                     alt=""/>
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
                                                                    addToCart(user_id, product.shop_id, product.id, existingProduct ? existingProduct.count + 1 : 1, "add")

                                                                }
                                                                }>+
                                                                </button>
                                                                <p>{product.count}</p>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        if (existingProduct.count > 0)
                                                                            decrementCart(user_id, product.shop_id, product.id, existingProduct, existingProduct.count - 1);
                                                                    }}
                                                                >-
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </SwipeToDelete>

                                            </>
                                        )
                                    }
                                )
                            ) : (
                                ""
                            )}
                        </div>
                    </div>
                </>
            ) : (
                <No_data no_data_title={"Buyurtmalar"} no_data_msg={"Hozirda mavjud buyurtmalar yo'q"}/>
            )}

            <div className="single_basket_order_box">
                <Link className="single_basket_order_btn"
                      to={USER_SINGLE_CHECKOUT.replace(":user_id", user_id).replace(":language", language).replace(":shop_id", selectedShop?.shop?.id)}>
                    Buyurtma qilish
                </Link>
            </div>
        </div>
    );
};

export default Basket_bar;
