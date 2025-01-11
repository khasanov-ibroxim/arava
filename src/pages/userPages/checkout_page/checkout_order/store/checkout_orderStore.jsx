import {create} from "zustand";
import {$API} from "../../../../../utils/http.jsx";


const CheckoutOrderState = {
    ordersByShop: null
}

export const CheckoutOrderStore = create((set, get) => ({
    ...CheckoutOrderState,
    getOrderByShopId: async (user_id, shop_id) => {
        try {
            const res = await $API.get("/order/from-user-shop", {
                params: {
                    shop_id: Number(shop_id),
                    user_id: Number(user_id),
                },
            });
            set({ ordersByShop: res.data.orders });
            console.log(res);
        } catch (e) {
            console.log(e);
        }
    },
}));
