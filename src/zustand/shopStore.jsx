import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {$API} from "../utils/http.jsx";

const initialState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
}

export const shopStore = create(devtools((set, get) => ({
    ...initialState,
    getShop: async () => {
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

const HomeBannerState = {
    loading: false,
    success: false,
    error: false,
    data_banner: [],

}
export const homeBannerStore = create((set, get) => ({
    ...HomeBannerState,
    getBanner: async () => {
        set({...HomeBannerState, loading: true});
        try {
            const res = await $API.get('/banners')

            set({...HomeBannerState, loading: false, success: true, data_banner: res.data.photos});
        } catch (err) {
            console.log(err)
            set({...HomeBannerState, error: true});
        }
    }
}))


const HomeCategoryState = {
    loading: false,
    success: false,
    error: false,
    data_category: [],

}
export const homeCategoryStore = create((set, get) => ({
    ...HomeCategoryState,
    getCategory: async () => {
        set({...HomeCategoryState, loading: true});
        try {
            const res = await $API.get('/shop-category')
            set({...HomeCategoryState, loading: false, success: true, data_category: res.data});
        } catch (err) {
            console.log(err)
            set({...HomeCategoryState, error: true});
        }
    }
}))

