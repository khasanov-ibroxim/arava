import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { $API } from "../utils/http.jsx";

// Generic error handler for stores
const createErrorHandler = (storeName) => (err) => {
    console.error(`Error in ${storeName}:`, err);
    return {
        error: true,
        errorData: err.response?.data?.message || err.message || "Unknown error"
    };
};

// Shared initial state template
const createInitialState = (dataKey = 'data') => ({
    loading: false,
    success: false,
    error: false,
    [dataKey]: [],
    errorData: null
});

// Shop Store
export const shopStore = create(devtools((set) => ({
    ...createInitialState('data'),
    getShop: async () => {
        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/shop');
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data: res.data || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('shopStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    },
})));

// Single Shop Store
export const shopSingleStore = create(devtools((set) => ({
    ...createInitialState('data_shop'),
    getSingleShop: async (shop_id) => {
        if (!shop_id) return;

        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/shop/detail', {
                params: { shop_id: Number(shop_id) }
            });
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_shop: res.data,
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('shopSingleStore');
            set(state => ({
                ...state,
                ...errorHandler(err),

                loading: false
            }));
        }
    },
})));

// Home Banner Store
export const homeBannerStore = create(devtools((set) => ({
    ...createInitialState('data_banner'),
    getBanner: async () => {
        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/banners');
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_banner: res.data?.photos || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('homeBannerStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    }
})));

// Home Category Store
export const homeCategoryStore = create(devtools((set) => ({
    ...createInitialState('data_category'),
    getCategory: async () => {
        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/shop-category');
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_category: res.data || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('homeCategoryStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    }
})));

// Shop Banner Store
export const shopBannerStore = create(devtools((set) => ({
    ...createInitialState('data_banner'),
    getBanner: async (shop_id) => {
        if (!shop_id) return;

        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/shop/photos', {
                params: { shop_id: Number(shop_id) }
            });
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_banner: res.data || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('shopBannerStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    }
})));

// Shop Category Store
export const shopCategoryStore = create(devtools((set) => ({
    ...createInitialState('data_category'),
    getCategory: async (shop_id) => {
        if (!shop_id) return;

        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/category/from-shop', {
                params: { shop_id: Number(shop_id) }
            });
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_category: res.data || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('shopCategoryStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    }
})));

// Product By Shop Store
export const productByShopStore = create(devtools((set) => ({
    ...createInitialState('data_product'),
    getProductByShop: async (shop_id) => {
        if (!shop_id) return;

        set(state => ({ ...state, loading: true, error: false }));
        try {
            const res = await $API.get('/products/from-shop', {
                params: { shop_id: Number(shop_id) }
            });
            set(state => ({
                ...state,
                loading: false,
                success: true,
                data_product: res.data || [],
                error: false
            }));
        } catch (err) {
            const errorHandler = createErrorHandler('productByShopStore');
            set(state => ({
                ...state,
                ...errorHandler(err),
                loading: false
            }));
        }
    }
})));