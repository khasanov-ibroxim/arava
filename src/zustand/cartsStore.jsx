import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {$API} from "../utils/http.jsx";

const SingleCartState = {
    loading: false,
    success: false,
    error: false,
    single_cart_data: null, // Savat ma'lumotlarini saqlash
    errorData: null,        // Xatolik ma'lumotlarini saqlash
};

export const SingleCartStore = create(devtools((set, get) => ({
    ...SingleCartState,
    // Yangi savat yaratish funksiyasi
    createSingleCart: async (shop_id, product_id, count, user_id) => {
        set({loading: true, success: false, error: false});
        try {
            const res = await $API.post(
                "/carts",
                {product_id: parseInt(product_id), shop_id: parseInt(shop_id), count: parseInt(count)},
                {
                    params: {client_id: parseInt(user_id)},
                    headers: {"Content-Type": "application/x-www-form-urlencoded"}
                },
            );
            set({single_cart_data: res.data, success: true, loading: false});
            console.log("Cart Created:", res.data);
        } catch (err) {
            set({error: true, errorData: err.response?.data, loading: false});
            console.error("Cart Creation Error:", err);
        }
    },
    // Ma'lum foydalanuvchi va do'kon uchun savat ma'lumotlarini olish funksiyasi
    getSingleCartState: async (shop_id, user_id) => {
        set({loading: true, success: false, error: false});
        try {
            const res = await $API.get(`/carts/from-user-shop`, {
                params: {user_id: user_id, shop_id: shop_id},
            });
            set({single_cart_data: res.data, success: true, loading: false});
            console.log("Fetched Cart Data:", res.data);
        } catch (err) {
            set({error: true, errorData: err.response?.data, loading: false});
            console.error("Fetch Cart Error:", err);
        }
    },
    resetCartState: () => set(SingleCartState), // Davlatni reset qilish funksiyasi
})));
