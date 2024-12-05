import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {$API} from "../utils/http.jsx";

const initialState ={
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
}

export const shopStore = create(devtools((set, get) => ({
    ...initialState,
    getShop: async ()=>{
        set({...initialState, loading: true});
        try {
            const res = await $API.get('/shop')
            set({...initialState, loading: false, success: true, data: res.data});
            console.log(res)
        } catch (err) {
            console.error("Error in data fetch:", err);
            set({...initialState, error: true, errorData: err.message});
        }
    }
})))