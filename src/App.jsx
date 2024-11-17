import React, {useEffect} from 'react';
import {  Routes, Route, HashRouter } from "react-router-dom";
import { SELLER_LAYOUT, USER_LAYOUT } from "./utils/const.jsx";
import UserLayout from "./pages/userLayout/userLayout.jsx";
import SellerLayout from "./pages/sellerLayout/sellerLayout.jsx";
import UserHome from "./pages/userPages/home/userHome.jsx";
import SellerHome from "./pages/sellerPages/home/sellerHome.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

const AppContent = () => {
    const role = "user";

    const tg = window.Telegram.WebApp;

    const hashParts = window.location.hash.split("/");
    const userId = hashParts[1];

    useEffect(() => {
        tg.expand();
        tg.headerColor = "#3D43CF";
        tg.bottomBarColor = "#3D43CF";
        tg.isVerticalSwipesEnabled = false;
        tg.isHorizontalSwipesEnabled = false;
        tg.MainButton.setText("Yetkazib berish: Toshkent - Sergeli 7 - Mahala");
        tg.MainButton.show(); // Tugmani ko'rsatish
        tg.MainButton.onClick(() => {
            alert("MainButton bosildi");
        });
    }, [tg]);
    return (
        <Routes>
            <Route
                path="/:user_id/:language"
                element={role === "user" ? <UserHome /> : <SellerHome />}
            />
            {role === "user" && (
                <Route path={USER_LAYOUT + "*"} element={<UserLayout />} />
            )}
            {role === "seller" && (
                <Route path={SELLER_LAYOUT + "*"} element={<SellerLayout />} />
            )}
            <Route path="*" element={<div>Not Found</div>} />
        </Routes>
    );
};

const App = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;
