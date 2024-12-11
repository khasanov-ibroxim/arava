import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useBasketStore} from "../../../../zustand/basketStore.jsx";
import {SHOP_PAGE, USER_HOME} from "../../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import "./singleBasket.css"
const SingleBasket = () => {
    const { shop_id, user_id, language } = useParams();
    const {
        getSingleBasket,
        single_basket_data,
        loading,
        error,
        getTotalSum,
        total_sum,
        getProductsForCart,
        single_basket_products,
        updateProductQuantity,
    } = useBasketStore();

    const [isUpdating, setIsUpdating] = useState(false); // New state to track updates

    useEffect(() => {
        if (shop_id) {
            Promise.all([
                getSingleBasket(user_id, shop_id),
                getProductsForCart(shop_id),
                getTotalSum(user_id, shop_id)
            ]);
        }
    }, [shop_id, user_id]);

    const numberFormatter = useCallback((number) => {
        if (number == null) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, []);

    const [quantity, setQuantity] = useState({});

    const updateQuantity = useCallback(
        async (productId, count) => {
            if (isUpdating) return;  // Prevent updating if already updating

            setIsUpdating(true);  // Set loading state for updating
            setQuantity((prevQuantity) => ({
                ...prevQuantity,
                [productId]: count,
            }));

            try {
                await updateProductQuantity(user_id, shop_id, productId, count);
            } catch (err) {
                console.error(err);
            } finally {
                setIsUpdating(false);  // Reset loading state after update
            }
        },
        [updateProductQuantity, user_id, shop_id, isUpdating]  // Include isUpdating to avoid multiple updates
    );

    const matchedProducts = useMemo(() => {
        if (!single_basket_data?.carts || !single_basket_products) return [];

        return single_basket_products.flatMap((productGroup) =>
            productGroup.products.map(product => {
                const cartItem = single_basket_data.carts.find(cart => cart.product_id === product.id);
                if (cartItem) {
                    return {
                        ...product,
                        count: quantity[product.id] || cartItem.count
                    };
                }
                return null;
            }).filter(Boolean)
        );
    }, [single_basket_data, single_basket_products, quantity]);

    if (loading && !isUpdating) return <div>Yuklanmoqda...</div>; // Only show loading when not updating quantity
    if (error) return <div>Xatolik yuz berdi</div>;

    return (
        <div>
            <div className="shop_page_header container">
                <Link
                    className="user_map_top_back"
                    to={SHOP_PAGE.replace(":user_id", user_id).replace(":language", language).replace(":shop_id" , shop_id)}
                >
                    <ChevronLeftIcon />
                </Link>
                <p>{numberFormatter(total_sum)} so'm</p>
                <h1 className="shop_name">
                    {single_basket_data?.shops?.[0]?.name || 'Do\'kon'}
                </h1>
            </div>
            <div className="basket_page container">
                {matchedProducts.length > 0 ? (
                    matchedProducts.map(product => (
                        <div key={product.id} className="basket_product_item">
                            <div className="basket_product_item_photo">
                                {product.photo && (
                                    <img src={"https://placehold.co/600x400"} alt="" />
                                )}
                            </div>
                            <div className="basket_product_item_text">
                                <h3>{product.name} Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab aspernatur atque eveniet impedit natus possimus repudiandae sunt, voluptatem voluptatibus voluptatum?</h3>
                                <p>{numberFormatter(product.one_price*product.count)} so'm</p>
                            </div>
                            <div className="basket_product_item_update">
                                <div className="basket_product_item_update_box">
                                    <button onClick={() => updateQuantity(product.id, product.count + 1)}>+</button>
                                    <p>{product.count}</p>
                                    <button onClick={() => updateQuantity(product.id, product.count - 1)}>-</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Mahsulotlar topilmadi</p>
                )}
            </div>
            <div className="single_basket_order_box">
                <div className="single_basket_order_btn">
                    Buyurtma qilish
                </div>
            </div>
        </div>
    );
};
export default SingleBasket;