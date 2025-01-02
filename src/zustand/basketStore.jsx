import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {$API} from "../utils/http.jsx";
import React from "react";

let timeRef;



const SingleBasketState = {
    loading: false,
    success: false,
    error: false,
    single_basket_data: null,
    single_basket_products: null,
    baskets_from_user: null,
    total_sum: 0,
};

export const useBasketStore = create(devtools((set, get) => ({
    ...SingleBasketState,
    createSingleCart: async (shop_id, product_id, count, user_id) => {
        const tempCartId = Date.now(); // Vaqtinchalik ID
        console.log(product_id , shop_id, count, user_id);
        // Mahalliy state-ga vaqtinchalik yangi cart qo'shish
        set((state) => {
            const newCart = {
                product_id: Number(product_id),
                shop_id: Number(shop_id),
                count: Number(count),
                user_id: Number(user_id),
            };

            return {
                single_basket_data: {
                    ...state.single_basket_data,
                    carts: [...(state.single_basket_data?.carts || []), newCart],
                },
            };
        });

        try {
            // Serverga so'rov yuborish
            const res = await $API.post(
                "/carts",
                {
                    product_id: Number(product_id),
                    shop_id: Number(shop_id),
                    count: Number(count),
                },
                {
                    params: { client_id: Number(user_id) },
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                }
            );

            console.log("create cart", res.data);

            get().getSingleBasket(user_id,shop_id)
        } catch (err) {
            // Xatolikni ko'rsatish
            set({
                error: true,
                errorData: err.response?.data,
                loading: false,
            });
            console.error("Cart Creation Error:", err);
        }
    },

    getSingleBasket: async (user_id, shop_id) => {
        try {
            set({loading: true, success: false, error: false});
            const res = await $API.get("/carts/from-user-shop", {
                params: {user_id: Number(user_id), shop_id: Number(shop_id)}
            });
            set({single_basket_data: res.data, success: true, loading: false});
            console.log(res)
            return res.data;
        } catch (err) {
            console.error(err);
            set({error: true, loading: false});
            throw err;
        }
    },

    getTotalSum: async (user_id, shop_id) => {
        try {
            const res = await $API.get("/carts/sum", {
                params: {user_id: Number(user_id), shop_id: Number(shop_id)}
            });
            set({total_sum: res.data});
            console.log(res)
            return res.data;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    getProductsForCart: async (shop_id) => {
        try {
            const res = await $API.get("/shop-products/from-shop", {
                params: {shop_id: Number(shop_id)}
            });
            set({single_basket_products: res.data});
            return res.data;

        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    updateProductQuantity: async (user_id, shop_id, cart_id, count) => {
        try {
            const res = await $API.patch("/carts", null, {
                params: {cart_id, user_id: Number(user_id), count: parseInt(count)}
            });
            console.log("UPDATE",res)
            // await get().getTotalSum(user_id, shop_id)
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    deleteCartProduct: async (product_id, user_id, cart_id) => {
        set((state) => {
            const updatedCarts = state.single_basket_data?.carts.filter(cart => cart.id !== cart_id);

            return {
                single_basket_data: {
                    ...state.single_basket_data,
                    carts: updatedCarts
                }
            };
        });
        try {
            const res = await $API.delete("/carts/delete-product", {
                params: {product_id: Number(product_id), user_id: Number(user_id)}
            });
            console.log(res)
        } catch (err) {
            console.error("Cart Deletion Error:", err);
            throw err;
        }
    },

    getBasketsFromUser: async (user_id) => {
        try {
            const res = await $API.get("/carts/from-user", {
                params: {user_id: Number(user_id)}
            });
            set({baskets_from_user: res.data});
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

     debounceUpdate : (user_id , shop_id , cart_id , count) => {
        if (timeRef) {
            clearTimeout(timeRef);
        }
        if (cart_id){
            timeRef = setTimeout(() => {
                get().updateProductQuantity(user_id , shop_id , cart_id , count);
                get().getTotalSum(user_id, shop_id)
            }, 1000);
        }

    },



    addToCart: async (user_id, shop_id, product_id, count, args) => {
        let updateTimer;
        const existingProduct = get().single_basket_data?.carts?.find(
            item => item.product_id === parseInt(product_id)
        );

        if (args === "add" && existingProduct && count > 0) {
            set((state) => {
                const updatedCart = {
                    ...existingProduct,
                    count: parseInt(count)
                };
                console.log(updatedCart)
                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: state.single_basket_data.carts.map(cart =>
                            cart.product_id === parseInt(product_id) ? updatedCart : cart
                        )
                    }
                };
            });
          get().debounceUpdate(user_id, shop_id , existingProduct.id , count)
        }
        if (args === "add" && !existingProduct ){
            try {
                await get().createSingleCart(shop_id, product_id , count , user_id)
            }catch (e){
                console.log(e)
            }


        }

    },
    decrementCart: async (user_id, shop_id, product_id, cart, count) => {
        if ( count > 0) {
            set((state) => {
                const updatedCart = {
                    ...cart,
                    count: parseInt(count)
                };
                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: state.single_basket_data.carts.map(cart =>
                            cart.product_id === parseInt(product_id) ? updatedCart : cart
                        )
                    }
                };
            });
            get().debounceUpdate(user_id, shop_id , cart.id , count)
        } else if(count === 0) {
           await set((state) => {
                const filteredCarts = state.single_basket_data.carts.filter(
                    cart => cart.product_id !== parseInt(product_id)
                );
                return {
                    single_basket_data: {
                        ...state.single_basket_data,
                        carts: filteredCarts
                    }
                };
            });

            try {
                const res = await $API.delete("/carts/delete-product", {
                    params: {product_id: Number(product_id), user_id: Number(user_id)}
                });
                console.log("Product deleted:", res);
            } catch (err) {
                console.error("Error deleting product:", err);
                throw err;
            }
        }
    },

})));

