import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from "react-router-dom";
import { useSwipeable } from 'react-swipeable';
import { useBasketStore } from "../../../../zustand/basketStore.jsx";
import { SHOP_PAGE } from "../../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import DeleteIcon from "@mui/icons-material/Delete";
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
        deleteCartProduct
    } = useBasketStore();

    const [isUpdating, setIsUpdating] = useState(false);
    const [swipedItemId, setSwipedItemId] = useState(null);
    const [quantity, setQuantity] = useState({});

    const numberFormatter = useCallback((number) => {
        if (number == null) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, []);

    const updateQuantity = useCallback(
        async (productId, countChange) => {
            if (isUpdating) return;
            setIsUpdating(true);

            const existingProduct = single_basket_data?.carts?.find(
                (item) => item.product_id === productId
            );

            if (countChange === 0 && existingProduct) {
                try {
                    await deleteCartProduct(productId, user_id, existingProduct.id);
                } catch (err) {
                    console.error("Error deleting product:", err);
                }
            } else if (existingProduct) {
                try {
                    const newCount = countChange;
                    if (newCount <= 0) {
                        await deleteCartProduct(productId, user_id, existingProduct.id);
                    } else {
                        await updateProductQuantity(user_id, shop_id, existingProduct.id, newCount);
                        setQuantity((prevQuantity) => ({
                            ...prevQuantity,
                            [productId]: newCount,
                        }));
                    }
                } catch (err) {
                    console.error("Error updating quantity:", err);
                }
            }

            setIsUpdating(false);
        },
        [deleteCartProduct, updateProductQuantity, user_id, shop_id, single_basket_data, isUpdating]
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

    useEffect(() => {
        if (shop_id) {
            Promise.all([
                getSingleBasket(user_id, shop_id),
                getProductsForCart(shop_id),
                getTotalSum(user_id, shop_id)
            ]);
        }
    }, [shop_id, user_id, getSingleBasket, getProductsForCart, getTotalSum]);

    useEffect(() => {
        getTotalSum(user_id, shop_id);
    }, [isUpdating, getTotalSum, user_id, shop_id]);

    const handleSwipe = (productId) => {
        setSwipedItemId(productId === swipedItemId ? null : productId);
    };

    const handleDelete = async (productId) => {
        const existingProduct = single_basket_data?.carts?.find(
            (item) => item.product_id === productId
        );

        if (existingProduct) {
            try {
                await deleteCartProduct(productId, user_id, existingProduct.id);
                setSwipedItemId(null);
            } catch (err) {
                console.error("Error deleting product:", err);
            }
        }
    };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: (eventData) => handleSwipe(eventData.event.target.id),
        onSwipedRight: () => handleSwipe(null),
        trackMouse: true
    });

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
                        <div key={product.id} className="basket_product_item_wrapper">
                            <div
                                {...swipeHandlers}
                                id={product.id.toString()}
                                className={`basket_product_item ${swipedItemId === product.id ? 'swiped' : ''}`}
                            >
                                <div className="basket_product_item_photo">
                                    {product.photo && (
                                        <img src={"https://placehold.co/600x400"} alt={product.name} />
                                    )}
                                </div>
                                <div className="basket_product_item_text">
                                    <h3>{product.name}</h3>
                                    <p>{numberFormatter(product.one_price * product.count)} so'm</p>
                                </div>
                                <div className="basket_product_item_update">
                                    <div className="basket_product_item_update_box">
                                        <button onClick={() => updateQuantity(product.id, product.count + 1)}>+</button>
                                        <p>{product.count}</p>
                                        <button onClick={() => updateQuantity(product.id, product.count - 1)}>-</button>
                                    </div>
                                </div>
                            </div>
                            <button
                                className="delete_button"
                                onClick={() => handleDelete(product.id)}
                                aria-label={`Delete ${product.name} from basket`}
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Mahsulotlar topilmadi</p>
                )}
            </div>
            <div className="single_basket_order_box">
                <button className="single_basket_order_btn">
                    Buyurtma qilish
                </button>
            </div>
        </div>
    );
};

export default SingleBasket;

