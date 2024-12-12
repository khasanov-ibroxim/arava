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
    createSingleCart: async (shop_id, product_id, count, user_id) => {
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

            // Update local state with new cart
            set((state) => {
                const newCart = {
                    id: res.data.id,
                    product_id: Number(product_id),
                    shop_id: Number(shop_id),
                    count: Number(count)
                };
                const updatedCarts = state.single_basket_data?.carts ? [...state.single_basket_data.carts, newCart] : [newCart];

                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: updatedCarts
                    }
                };
            });

            await get().getSingleBasket(user_id, shop_id);
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
    getSingleBasket: async (user_id, shop_id) => {
        try {
            set({ loading: true, success: false, error: false });
            const res = await $API.get("/carts/from-user-shop", {
                params: { user_id: Number(user_id), shop_id: Number(shop_id) }
            });
            set({ single_basket_data: res.data, success: true, loading: false });
            console.log(res)
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

    updateProductQuantity: async (user_id, shop_id, cart_id, count) => {
        try {
            // Update the local state before sending the request to the server
            set((state) => {
                const updatedCarts = state.single_basket_data?.carts.map(cart => {
                    if (cart.id === cart_id) {
                        return { ...cart, count: parseInt(count) };
                    }
                    return cart;
                });

                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: updatedCarts
                    }
                };
            });

            const res = await $API.patch("/carts", null, {
                params: { cart_id, user_id: Number(user_id), count: parseInt(count) }
            });
            console.log(res);
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    deleteCartProduct: async (product_id, user_id, cart_id) => {
        try {
            const res = await $API.delete("/carts/delete-product", {
                params: { product_id: Number(product_id), user_id: Number(user_id) }
            });

            // Update the local state by removing the deleted cart
            set((state) => {
                const updatedCarts = state.single_basket_data?.carts.filter(cart => cart.id !== cart_id);

                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: updatedCarts
                    }
                };
            });

            console.log("Cart deleted", res.data);
        } catch (err) {
            console.error("Cart Deletion Error:", err);
            throw err;
        }
    }

})));
