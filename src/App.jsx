import React, {useEffect} from "react";
import {Routes, Route, HashRouter} from "react-router-dom";
import {UserRouters} from "./utils/const.jsx";
import UserHome from "./pages/userPages/home/userHome.jsx";
import SellerHome from "./pages/sellerPages/home/sellerHome.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import Bottom from "./component/bottom/Bottom.jsx";
import {userStore} from "./zustand/userStore.jsx";
import Loading from "./component/loading/loading.jsx";
import Error_loading from "./component/loading/error_loading.jsx";

const AppContent = () => {
    const tg = window.Telegram.WebApp;
    const getUser = userStore((state) => state.getUser);
    const user = userStore((state) => state.data);
    const loading = userStore((state) => state.loading);
    const error = userStore((state) => state.error);

    useEffect(async () => {
        tg.expand();
        tg.headerColor = "#3D43CF";
        tg.bottomBarColor = "#3D43CF";
        tg.isVerticalSwipesEnabled = false;
        tg.isHorizontalSwipesEnabled = false;
        if (!user) {
            await getUser();
        }
        
    }, [tg, getUser]);

    if (loading) return <Loading/>;


    return (
        <Routes>
            <Route
                path="/:user_id/:language"
                element={ user && user.status === "user" ? (
                        <UserHome user={user}/>
                    ) : user?.status === "seller" && (
                        <SellerHome user={user}/>
                    )
                }
            />
            {user && user?.status === "user" &&
                UserRouters.map(({Path, Component}) => (
                    <Route
                        key={Path}
                        path={Path}
                        element={
                            <>
                                <Component user={user}/>
                                <Bottom/>
                            </>
                        }
                    />
                ))}
            <Route path="*" element={<div>Not Found</div>}/>
        </Routes>
    );
};

const App = () => {
    return (
        <HashRouter>
            <AppContent/>
        </HashRouter>
    );
};

export default App;

