import {create} from "zustand";
import {$API} from "../utils/http.jsx";


const checkoutStates = {
    paymentMethod: []
}

export const checkoutStore = create((set, get) => ({
    ...checkoutStates,
    getPaymentMethod: async () => {
        try {
            const res = await $API.get("/payment")
            console.log(res)
            set({...checkoutStates, paymentMethod: res.data.payments});
        } catch (error) {
            console.log(error)
        }
    },

    createOrder: async (user_id , shop_id, payment_id , name , phone, address) => {
        try {
            const res = await $API.post("/order", null, {
                params: {
                    client_id: Number(user_id),
                    shop_id: Number(shop_id),
                    payment_id:Number(payment_id),
                    first_last_name:name,
                    phone:phone,
                    address:address
                }
            });
            console.log(res)
        } catch (e) {
            console.log(e)
        }
    },

}))