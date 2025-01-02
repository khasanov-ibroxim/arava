import axios from "axios";

const baseURL = "https://backend1.mussi.uz/";

const $API = axios.create({
    baseURL: baseURL,
    headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    }
});

export {$API}