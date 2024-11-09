import React from 'react';
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { SELLER_LAYOUT, USER_LAYOUT } from "./utils/const.jsx";
import UserLayout from "./pages/userLayout/userLayout.jsx";
import SellerLayout from "./pages/sellerLayout/sellerLayout.jsx";

const AppContent = () => {
    const role = "user";
    return (
        <Routes>
            {role === "user" && (
                <Route path={USER_LAYOUT + "*"} element={<UserLayout />} />
            )}
            {role === "seller" && (
                <Route path={SELLER_LAYOUT + "*"} element={<SellerLayout />} />
            )}
            <Route path="*" element={<div>404 - Page Not Found</div>} />
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
