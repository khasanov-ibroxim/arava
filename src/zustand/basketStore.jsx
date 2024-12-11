import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { $API } from "../utils/http.jsx";

const SingleBasketState = {
    loading: false,
    success: false,
    error: false,
    single_basket_data: null,
    single_basket_products: null,
    total_sum: 0,
};

export const useBasketStore = create(devtools((set, get) => ({
    ...SingleBasketState,

    getSingleBasket: async (user_id, shop_id) => {
        try {
            set({ loading: true, success: false, error: false });
            const res = await $API.get("/carts/from-user-shop", {
                params: { user_id: Number(user_id), shop_id: Number(shop_id) }
            });
            set({ single_basket_data: res.data, success: true, loading: false });
            return res.data;
        } catch (err) {
            console.error(err);
            set({ error: true, loading: false });
            throw err;
        }
    },

    getTotalSum: async (user_id, shop_id) => {
        try {
            const res = await $API.get("/carts/sum", {
                params: { user_id: Number(user_id), shop_id: Number(shop_id) }
            });
            set({ total_sum: res.data });
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getProductsForCart: async (shop_id) => {
        try {
            const res = await $API.get("/products/from-shop", {
                params: { shop_id: Number(shop_id) }
            });
            set({ single_basket_products: res.data });
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateProductQuantity: async (user_id, shop_id, product_id, count) => {
        try {
            const res = await $API.patch("/carts", null, {
                params: { product_id, user_id: Number(user_id), count }
            });
            console.log(res);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    }

})));
