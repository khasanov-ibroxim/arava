import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {$API} from "../utils/http.jsx";

const initialState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    shop_photo: [],
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
    },
})))


const shopSingleState = {
    loading: false,
    success: false,
    error: false,
    data_shop: null,
    shop_photo: [],
    errorData: null,
}

export const shopSingleStore = create(devtools((set, get) => ({
    ...shopSingleState,
    getSingleShop: async (shop_id) => {
        set({...shopSingleState, loading: true});
        try {
            const res = await $API.get('/shop/detail', {
                params: {
                    shop_id: shop_id,
                }
            })
            set({...shopSingleState, loading: false, success: true, data_shop: res.data});
            console.log(res)
        } catch (err) {
            console.error("Error in data fetch:", err);
            set({...shopSingleState, error: true, errorData: err.message});
        }
    },
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

const ShopBannerState = {
    loading: false,
    success: false,
    error: false,
    data_banner: [],

}
export const shopBannerStore = create((set, get) => ({
    ...ShopBannerState,
    getBanner: async (shop_id) => {
        set({...ShopBannerState, loading: true});
        try {
            const res = await $API.get('/shop/photos', {
                params: {
                    shop_id: parseInt(shop_id),
                }
            })
            set({...ShopBannerState, loading: false, success: true, data_banner: res.data});
        } catch (err) {
            console.log(err)
            set({...ShopBannerState, error: true});
        }
    }
}))


const ShopCategoryState = {
    loading: false,
    success: false,
    error: false,
    data_category: [],

}
export const shopCategoryStore = create((set, get) => ({
    ...ShopCategoryState,
    getCategory: async (shop_id) => {
        set({...ShopCategoryState, loading: true});
        try {
            const res = await $API.get('/category/from-shop', {
                params: {
                    shop_id: parseInt(shop_id),
                }
            })
            console.log(res)
            set({...ShopCategoryState, loading: false, success: true, data_category: res.data});
        } catch (err) {
            console.log(err)
            set({...ShopCategoryState, error: true});
        }
    }
}))


const ProductByShopState = {
    loading: false,
    success: false,
    error: false,
    data_product: [],

}
export const productByShopStore = create((set, get) => ({
    ...ProductByShopState,
    getProductByShop: async (shop_id) => {
        set({...ProductByShopState, loading: true});
        try {
            const res = await $API.get('/products/from-shop', {
                params: {
                    shop_id: parseInt(shop_id),
                }
            })
            console.log(res)
            set({...ProductByShopState, loading: false, success: true, data_product: res.data});
        } catch (err) {
            console.log(err)
            set({...ProductByShopState, error: true});
        }
    }
}))
