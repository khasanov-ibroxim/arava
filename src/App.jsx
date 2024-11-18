import React, {useEffect, useState} from 'react';
import {Routes, Route, HashRouter} from "react-router-dom";
import {SELLER_LAYOUT, USER_LAYOUT, UserRouters} from "./utils/const.jsx";
import UserLayout from "./pages/userLayout/userLayout.jsx";
import SellerLayout from "./pages/sellerLayout/sellerLayout.jsx";
import UserHome from "./pages/userPages/home/userHome.jsx";
import SellerHome from "./pages/sellerPages/home/sellerHome.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import {$API} from "./utils/http.jsx";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

const AppContent = () => {

    const tg = window.Telegram.WebApp;
    const hashParts = window.location.hash.split("/");
    const userId = hashParts[1];
    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getUser = async () => {
        try {
            const res = await $API.get('/users/profile', {
                params: {
                    user_id: userId,
                },
            });
            setUser(res.data);
            console.log(res.data);
        } catch (err) {
            setError("Foydalanuvchi ma'lumotlarini olishda xatolik yuz berdi");
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        tg.expand();
        tg.headerColor = "#3D43CF";
        tg.bottomBarColor = "#3D43CF";
        tg.isVerticalSwipesEnabled = false;
        tg.isHorizontalSwipesEnabled = false;

        getUser(); // Foydalanuvchi ma'lumotlarini yuklash
    }, []);

    if (loading) {
        return <div>Yuklanmoqda...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <Routes>
            <Route
                path="/:user_id/:language"
                element={
                    user.status === "client" ? (
                        <UserHome user={user} />
                    ) : user.status === "seller" ? (
                        <SellerHome user={user} />
                    ) : (
                        <div>Not Found</div>
                    )
                }
            />
            {user.status === "client" && (
                UserRouters.map(({ Path, Component }, index) => (
                        <Route key={Path} path={Path } element={<Component user={user}/>} />
                    ))
            )}
            {user.status === "seller" && (
                <Route path={SELLER_LAYOUT + "*"} element={<SellerLayout />} />
            )}
            <Route path="*" element={<div>Not Found</div>} />
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
