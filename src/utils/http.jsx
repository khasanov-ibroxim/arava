import axios from "axios";

const baseURL = "https://backend1.mussi.uz/";

const $API = axios.create({
    baseURL: baseURL,
});

export {$API}