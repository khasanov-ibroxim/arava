import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { $API } from "../utils/http.jsx";

const initialState = {
    loading: false,
    success: false,
    error: false,
    single_cart_data: null,
    errorData: null,
};

export const SingleCartStore = create(devtools((set, get) => ({
    ...initialState,

    createSingleCart: async (shop_id, product_id, count, user_id) => {
        set({ loading: true, success: false, error: false });
        console.log(count, user_id, product_id);
        try {
            const res = await $API.post(
                "/carts",
                {
                    product_id: Number(product_id),
                    shop_id: Number(shop_id),
                    count: Number(count)
                },
                {
                    params: { client_id: Number(user_id) },
                    headers: { "Content-Type": "application/x-www-form-urlencoded" }
                }
            );

            set(state => ({
                single_cart_data: {
                    ...state.single_cart_data,
                    carts: res.data.carts || []
                },
                success: true,
                loading: false
            }));
            console.log("create cart", res.data);
        } catch (err) {
            set({
                error: true,
                errorData: err.response?.data,
                loading: false
            });
            console.error("Cart Creation Error:", err);
        }
    },

    getSingleCartState: async (shop_id, user_id) => {
        if (!shop_id || !user_id) return;

        set({ loading: true, success: false, error: false });
        try {
            const res = await $API.get("/carts/from-user-shop", {
                params: {
                    user_id: String(user_id),
                    shop_id: String(shop_id)
                }
            });

            set({
                single_cart_data: res.data,
                success: true,
                loading: false
            });
            console.log("get cart", res.data);
        } catch (err) {
            set({
                error: true,
                errorData: err.response?.data,
                loading: false
            });
            console.error("Fetch Cart Error:", err);
        }
    },

    updateSingleCart: async (count, user_id, product_id) => {
        set({ loading: true, success: false, error: false });
        console.log(count, user_id, product_id);
        try {
            const res = await $API.patch("/carts", null, {
                params: {
                    user_id: Number(user_id),
                    count: Number(count),
                    product_id: Number(product_id)
                }
            });

            set(state => ({
                single_cart_data: {
                    ...state.single_cart_data,
                    carts: res.data.carts || []
                },
                success: true,
                loading: false
            }));
            console.log("upadte cart", res.data);
        } catch (err) {
            set({
                error: true,
                errorData: err.response?.data,
                loading: false
            });
            console.error("Update Cart Error:", err);
        }
    },

    resetCartState: () => set(initialState),
})));