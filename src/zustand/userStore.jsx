import {create} from "zustand";
import {devtools} from "zustand/middleware";
import axios from "axios";
import {message} from "antd";
import {$API} from "../utils/http.jsx";

const createInitialState = {
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
};

const extractUserIdFromHash = () => {
    try {
        const hashParts = window.location.hash.split("/");
        const userId = parseInt(hashParts[1], 10);
        if (isNaN(userId)) {
            throw new Error("Invalid user ID");
        }
        return userId;
    } catch (error) {
        console.error("Error extracting user ID:", error);
        return null; // or handle as needed
    }
};

const retryRequest = async (fn, retries = 3, delay = 2000) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (err) {
            if (i < retries - 1) {
                console.warn(`Retrying request... Attempt ${i + 2}`);
                await new Promise((res) => setTimeout(res, delay));
            } else {
                throw err;
            }
        }
    }
};

export const userStore = create(devtools((set) => ({
    ...createInitialState,
    userId: extractUserIdFromHash(),


    getUser: async () => {
        const userId = userStore.getState().userId;
        try {
            const res = await retryRequest(() =>
                $API.get('/users/profile', {params: {user_id: userId}})
            );
            set({
                ...createInitialState,
                loading: false,
                success: true,
                data: res.data
            });
        } catch (err) {
            console.error("Error fetching user:", err);
            set({
                ...createInitialState,
                error: true,
                errorData: err.response?.data?.message || err.message
            });
            if (err.response) {
                alert(`Server Error: ${err.response.data.message || err.response.status}`);
            } else if (err.request) {
                alert("No response from server. Please check your network connection.");
            } else {
                alert(`Request Error: ${err.message}`);
            }
        }
    },

    updateUser: async (user) => {
        const userId = userStore.getState().userId;
        if (!userId) {
            message.error("Invalid User ID");
            return null;
        }

        try {
            const res = await $API.patch('/users/profile', user, {
                params: {user_id: userId},
                headers: {"Content-Type": "application/x-www-form-urlencoded"}
            });
            message.success("Profile updated successfully");
            return res.data;
        } catch (err) {
            console.error("Error updating user:", err);
            message.error("Failed to update profile");
            return null;
        }
    }
})));

export const userLocationStore = create(devtools((set) => ({
    ...createInitialState,
    address: "",

    getLocation: async () => {
        const userData = userStore.getState().data;

        if (!userData?.lat || !userData?.long) {
            set({
                ...createInitialState,
                error: true,
                errorData: "Location coordinates not available"
            });
            message.error("Location coordinates not found");
            return;
        }

        set({...createInitialState, loading: true});
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

            set({
                ...createInitialState,
                success: true,
                address: formattedAddress
            });

            return formattedAddress;
        } catch (error) {
            console.error("Location retrieval error:", error);
            set({
                ...createInitialState,
                error: true,
                errorData: "Failed to retrieve location"
            });
            message.error("Could not determine location");
        }
    }
})));