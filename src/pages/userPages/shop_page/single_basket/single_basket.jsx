import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { Link, useParams } from "react-router-dom";
import { useBasketStore } from "../../../../zustand/basketStore.jsx";
import { SHOP_PAGE } from "../../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import SwipeToDelete from 'react-swipe-to-delete-ios';
import {Delete} from "@mui/icons-material";
import "./singleBasket.css";

const SingleBasket = ({user}) => {
    const { shop_id, user_id, language } = useParams();
    const updateTimeoutRef = useRef(null);

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
        deleteCartProduct
    } = useBasketStore();

    const [isUpdating, setIsUpdating] = useState(false);
    const [localQuantities, setLocalQuantities] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState({});

    useEffect(() => {
        if (shop_id) {
            Promise.all([
                getSingleBasket(user_id, shop_id),
                getProductsForCart(shop_id),
                getTotalSum(user_id, shop_id)
            ]);
        }
    }, [shop_id, user_id]);

    // Initialize local quantities from basket data
    useEffect(() => {
        if (single_basket_data?.carts) {
            const quantities = {};
            single_basket_data.carts.forEach(cart => {
                quantities[cart.product_id] = cart.count;
            });
            setLocalQuantities(quantities);
        }
    }, [single_basket_data]);

    const numberFormatter = useCallback((number) => {
        if (number == null) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, []);

    const onToggleStart = useCallback((productId, newCount) => {
        setLocalQuantities(prev => ({
            ...prev,
            [productId]: newCount
        }));

        setPendingUpdates(prev => ({
            ...prev,
            [productId]: newCount
        }));
    }, []);

    const onToggleEnd = useCallback(() => {
        if (isUpdating) return;
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(async () => {
            setIsUpdating(true);
            const updates = Object.entries(pendingUpdates);

            for (const [productId, newCount] of updates) {
                const existingProduct = single_basket_data?.carts?.find(
                    item => item.product_id === parseInt(productId)
                );

                try {
                    if (newCount === 0 && existingProduct) {
                        await deleteCartProduct(productId, user_id, existingProduct.id);
                    } else if (existingProduct && newCount > 0) {
                        await updateProductQuantity(user_id, shop_id, existingProduct.id, newCount);
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                    setLocalQuantities(prev => ({
                        ...prev,
                        [productId]: existingProduct?.count || 0
                    }));
                }
            }

            setPendingUpdates({});

            await Promise.all([
                getSingleBasket(user_id, shop_id),
                getTotalSum(user_id, shop_id)
            ]);

            setIsUpdating(false);
        }, 500);
    }, [
        pendingUpdates,
        single_basket_data,
        shop_id,
        user_id,
        deleteCartProduct,
        updateProductQuantity,
        getSingleBasket,
        getTotalSum,
        isUpdating
    ]);

    const handleQuantityUpdate = useCallback((productId, countChange) => {
        const newCount = countChange;
        if (newCount >= 0) {
            onToggleStart(productId, newCount);
            onToggleEnd();
        }
    }, [onToggleStart, onToggleEnd]);

    const handleDelete = async (productId) => {
        const existingProduct = single_basket_data?.carts?.find(
            (item) => item.product_id === productId
        );

        if (existingProduct) {
            try {
                handleQuantityUpdate(productId, 0);
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    const matchedProducts = useMemo(() => {
        if (!single_basket_data?.carts || !single_basket_products) return [];

        return single_basket_products.flatMap((productGroup) =>
            productGroup.products.map(product => {
                const cartItem = single_basket_data.carts.find(cart => cart.product_id === product.id);
                if (cartItem) {
                    return {
                        ...product,
                        count: localQuantities[product.id] || cartItem.count
                    };
                }
                return null;
            }).filter(Boolean)
        );
    }, [single_basket_data, single_basket_products, localQuantities]);

    if (loading && !isUpdating) return <div>Yuklanmoqda...</div>;
    if (error) return <div>Xatolik yuz berdi</div>;

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
            <div className="basket_page container">
                {matchedProducts.length > 0 ? (
                    matchedProducts.map(product => (
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
                                        <img src={"https://backend1.mussi.uz/"+product.photo} alt="" />
                                    )}
                                </div>
                                <div className="basket_product_item_text">
                                    <h3>{product.name}</h3>
                                    <p>{numberFormatter(product.one_price * product.count)} so'm</p>
                                </div>
                                <div className="basket_product_item_update">
                                    <div className="basket_product_item_update_box">
                                        <button onClick={() => handleQuantityUpdate(product.id, product.count + 1)}>+</button>
                                        <p>{product.count}</p>
                                        <button onClick={() => handleQuantityUpdate(product.id, product.count - 1)}>-</button>
                                    </div>
                                </div>
                            </div>
                        </SwipeToDelete>
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