import { create } from "zustand";
import { devtools } from "zustand/middleware";
import axios from "axios";
import { message } from "antd";
import { $API } from "../utils/http.jsx";

const createInitialState = () => ({
    loading: false,
    success: false,
    error: false,
    data: null,
    errorData: null,
});

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

export const userStore = create(devtools((set) => ({
    ...createInitialState(),
    userId: extractUserIdFromHash(),

    getUser: async () => {
        const userId = userStore.getState().userId;
        if (!userId) {
            set({
                ...createInitialState(),
                error: true,
                errorData: "Invalid User ID"
            });
            return;
        }

        set({ ...createInitialState(), loading: true });
        try {
            const res = await $API.get('/users/profile', {
                params: { user_id: userId },
            });
            set({
                ...createInitialState(),
                loading: false,
                success: true,
                data: res.data
            });
        } catch (err) {
            console.error("Error fetching user:", err);
            set({
                ...createInitialState(),
                error: true,
                errorData: err.response?.data?.message || err.message
            });
            message.error("Failed to fetch user profile");
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
                params: { user_id: userId },
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
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
    ...createInitialState(),
    address: "",

    getLocation: async () => {
        const userData = userStore.getState().data;

        if (!userData?.lat || !userData?.long) {
            set({
                ...createInitialState(),
                error: true,
                errorData: "Location coordinates not available"
            });
            message.error("Location coordinates not found");
            return;
        }

        set({ ...createInitialState(), loading: true });
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
                ...createInitialState(),
                success: true,
                address: formattedAddress
            });

            return formattedAddress;
        } catch (error) {
            console.error("Location retrieval error:", error);
            set({
                ...createInitialState(),
                error: true,
                errorData: "Failed to retrieve location"
            });
            message.error("Could not determine location");
        }
    }
})));