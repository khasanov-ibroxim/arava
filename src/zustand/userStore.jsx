import {create} from "zustand";
import {$API} from "../utils/http.jsx";
import {devtools} from "zustand/middleware";
import axios from "axios";

const hashParts = window.location.hash.split("/");
const userId = parseInt(hashParts[1], 10); // Specify radix

const initialState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
};

export const userStore = create(devtools((set) => ({
    ...initialState,
    getUser: async () => {
        set({...initialState, loading: true});
        try {
            const res = await $API.get('/users/profile', {
                params: {
                    user_id: userId,
                },
            });
            set({...initialState, loading: false, success: true, data: res.data});
        } catch (err) {
            console.error("Error in data fetch:", err);
            set({...initialState, error: true, errorData: err.message});
        }
    },
})));

const userAddress = {
    loading: false,
    success: false,
    error: false,
    address: "",
    errorData: null,
}

export const userLocationStore = create(devtools((set, get) => ({
    ...initialState,
    ...userAddress,
    getLocation: async () => {
        const userData = userStore.getState().data; // userStore’dan ma'lumotni oling
        if (userData?.lat && userData?.long) {
            try {
                const response = await axios.get(
                    `https://nominatim.openstreetmap.org/reverse`,
                    {
                        params: {
                            lat: userData.lat,
                            lon: userData.long,
                            format: "json",
                        },
                    }
                );
                const location = response.data.address;
                const formattedAddress = `${location.city || ""} - ${
                    location.residential || location.neighbourhood || location.road
                } - ${location.house_number || location.neighbourhood || location.road}`;
                set({ ...userAddress, success: true, address: formattedAddress });
            } catch (error) {
                console.error("Geokodlashda xatolik:", error);
                set({ ...userAddress, error: true, errorData: "Manzilni aniqlab bo'lmadi." });
            }
        } else {
            set({ ...userAddress, error: true, errorData: "Latitude yoki Longitude yo'q." });
        }
    },
})));
