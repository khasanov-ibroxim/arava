
import UserHome from "../pages/userPages/home/userHome.jsx";
import SellerHome from "../pages/sellerPages/home/sellerHome.jsx";

import LocationUser from "../pages/userPages/home/component/location_user.jsx";
import ShopPage from "../pages/userPages/shop_page/shop_page.jsx";

// USER

export const USER_HOME = "/:user_id/:language"
export const USER_LOCATION = `${USER_HOME}/user_location`
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

]
export const SellerRouters = [
    {
        Component:SellerHome,
        Path: SELLER_HOME,
    }
]