import {create} from "zustand";
import {$API} from "../utils/http.jsx";


const checkoutStates = {
    paymentMethod:[]
}

export const checkoutStore = create((set , get)=>({
    ...checkoutStates,
    getPaymentMethod:async ()=>{
        try {
            const res = await $API.get("/payment")
            console.log(res)
            set({...checkoutStates, paymentMethod:res.data.payments});
        }catch(error){
            console.log(error)}
    }
}))