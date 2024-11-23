
import UserHome from "../pages/userPages/home/userHome.jsx";
import SellerHome from "../pages/sellerPages/home/sellerHome.jsx";

import LocationUser from "../pages/userPages/home/component/location_user.jsx";
import ShopPage from "../pages/userPages/shop_page/shop_page.jsx";
import News from "../pages/userPages/news/news.jsx";
import Profile from "../pages/userPages/profile/profile.jsx";
import Search from "../pages/userPages/search/search.jsx";
import Basket from "../pages/userPages/basket/basket.jsx";

// USER

export const USER_HOME = "/:user_id/:language"
export const USER_LOCATION = `${USER_HOME}/user_location`
export const USER_NEWS = `${USER_HOME}/user_news`
export const USER_PROFILE = `${USER_HOME}/user_profile`
export const USER_SEARCH = `${USER_HOME}/user_search`
export const USER_BASKET = `${USER_HOME}/user_BASKET`
export const SHOP_PAGE = `${USER_HOME}/:shop_id`

// SELLER

export const SELLER_HOME = "seller_home/"



export const UserRouters = [
    {
        Component:UserHome,
        Path: USER_HOME,
    },
    {
        Component:LocationUser,
        Path: USER_LOCATION,
    },
    {
        Component:ShopPage,
        Path: SHOP_PAGE,
    },
    {
        Component:Profile,
        Path: USER_PROFILE,
    },
    {
        Component:News,
        Path: USER_NEWS,
    },
    {
        Component:Search,
        Path: USER_SEARCH,
    },
    {
        Component:Basket,
        Path: USER_BASKET,
    },

]
export const SellerRouters = [
    {
        Component:SellerHome,
        Path: SELLER_HOME,
    }
]