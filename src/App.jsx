import React, { useEffect } from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { UserRouters } from "./utils/const.jsx";
import UserHome from "./pages/userPages/home/userHome.jsx";
import SellerHome from "./pages/sellerPages/home/sellerHome.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Bottom from "./component/bottom/Bottom.jsx";
import { userStore } from "./zustand/userStore.jsx";

const AppContent = () => {
    const tg = window.Telegram.WebApp;
    const getUser = userStore((state) => state.getUser);
    const user = userStore((state) => state.data);
    const loading = userStore((state) => state.loading);
    const error = userStore((state) => state.error);

    useEffect(() => {
        tg.expand();
        tg.headerColor = "#3D43CF";
        tg.bottomBarColor = "#3D43CF";
        tg.isVerticalSwipesEnabled = false;
        tg.isHorizontalSwipesEnabled = false;

        getUser();
    }, [tg, getUser]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading user data</div>;

    return (
        <Routes>
            <Route
                path="/:user_id/:language"
                element={
                    user?.status === "user" ? (
                        <UserHome user={user} />
                    ) : user?.status === "seller" ? (
                        <SellerHome user={user} />
                    ) : (
                        <div>Not Found</div>
                    )
                }
            />
            {user?.status === "user" &&
                UserRouters.map(({ Path, Component }) => (
                    <Route
                        key={Path}
                        path={Path}
                        element={
                            <>
                                <Component user={user} />
                                <Bottom />
                            </>
                        }
                    />
                ))}
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
