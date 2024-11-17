import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SELLER_LAYOUT, USER_LAYOUT } from "./utils/const.jsx";
import UserLayout from "./pages/userLayout/userLayout.jsx";
import SellerLayout from "./pages/sellerLayout/sellerLayout.jsx";
import UserHome from "./pages/userPages/home/userHome.jsx";
import SellerHome from "./pages/sellerPages/home/sellerHome.jsx";

const AppContent = () => {
    const role = "user";
    return (
        <Routes>
            <Route path="/:user_id/:language" element={role === "user" ? <UserHome/> : <SellerHome/>} />
            {role === "user" && (
                <Route path={USER_LAYOUT + "*"} element={<UserLayout />} />
            )}
            {role === "seller" && (
                <Route path={SELLER_LAYOUT + "*"} element={<SellerLayout />} />
            )}
            <Route path="*" element={<div>asdsadas</div>} />
        </Routes>
    );
};

const App = () => {
    return (
        <BrowserRouter>
            <AppContent />
        </BrowserRouter>
    );
};

export default App;
