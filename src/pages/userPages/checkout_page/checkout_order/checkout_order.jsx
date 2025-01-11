import React, { useEffect } from 'react';
import { CheckoutOrderStore } from "./store/checkout_orderStore.jsx";
import { useParams } from "react-router-dom";

const CheckoutOrder = () => {
    const { user_id, shop_id, language, order_id } = useParams();
    const { ordersByShop, getOrderByShopId } = CheckoutOrderStore();

    useEffect(() => {
        getOrderByShopId(user_id, shop_id);
    }, [user_id, shop_id, getOrderByShopId]);

    // ordersByShop ichidan order_id ga mos keladigan orderni topish
    const selectedOrder = ordersByShop?.find((order) => order.order.id === Number(order_id));

    return (
        <div>
            <div>

            </div>

            <div>
                <h2>Selected Order</h2>
                {selectedOrder ? (
                    <div>
                        <p><strong>Order ID:</strong> {selectedOrder.id}</p>
                        <p><strong>Order Name:</strong> {selectedOrder.name}</p>
                        <p><strong>Order Details:</strong> {selectedOrder.details}</p>
                    </div>
                ) : (
                    <p>No order found with the given ID.</p>
                )}
            </div>
        </div>
    );
};

export default CheckoutOrder;
