
import UserHome from "../pages/userPages/home/userHome.jsx";
import SellerHome from "../pages/sellerPages/home/sellerHome.jsx";

import LocationUser from "../pages/userPages/home/component/location_user.jsx";
import ShopPage from "../pages/userPages/shop_page/shop_page.jsx";
import News from "../pages/userPages/news/news.jsx";
import Profile from "../pages/userPages/profile/profile.jsx";
import Search from "../pages/userPages/search/search.jsx";
import Basket_bar from "../pages/userPages/basket_bar/basket_bar.jsx";
import PersonalInformation from "../pages/userPages/profile/component/personal_information.jsx";
import UserSettings from "../pages/userPages/profile/component/user_settings.jsx";
import FavoriteUser from "../pages/userPages/profile/component/favorite_user.jsx";

// USER

export const USER_HOME = "/:user_id/:language"
export const USER_LOCATION = `${USER_HOME}/user_location`
export const USER_NEWS = `${USER_HOME}/user_news`
export const USER_PROFILE = `${USER_HOME}/user_profile`
export const USER_SEARCH = `${USER_HOME}/user_search`
export const USER_BASKET_BAR = `${USER_HOME}/user_basket_bar`
export const SHOP_PAGE = `${USER_HOME}/:shop_id`

export const USER_PROFILE_PERSONAL = `${USER_HOME}/user_profile/personal`
export const USER_PROFILE_FAVORITE = `${USER_HOME}/user_profile/favorite`
export const USER_PROFILE_SETTINGS = `${USER_HOME}/user_profile/settings`


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
        Component:Basket_bar,
        Path: USER_BASKET_BAR,
    },
    {
        Component:PersonalInformation,
        Path: USER_PROFILE_PERSONAL,
    },
    {
        Component:UserSettings,
        Path: USER_PROFILE_SETTINGS,
    },
    {
        Component:FavoriteUser,
        Path: USER_PROFILE_FAVORITE,
    },

]
export const SellerRouters = [
    {
        Component:SellerHome,
        Path: SELLER_HOME,
    }
]