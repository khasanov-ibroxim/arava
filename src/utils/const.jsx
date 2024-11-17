
import UserHome from "../pages/userPages/home/userHome.jsx";
import SellerHome from "../pages/sellerPages/home/sellerHome.jsx";
import UserLayout from "../pages/userLayout/userLayout.jsx";
import LocationUser from "../pages/userPages/home/component/location_user.jsx";

// USER
export const USER_LAYOUT = "user_layout/"
export const USER_HOME = "/:user_id/:language"
export const USER_LOCATION = `${USER_HOME}/user_location`


// SELLER
export const SELLER_LAYOUT = "seller_layout/"
export const SELLER_HOME = "seller_home/"



export const UserRouters = [
    {
        Component:UserLayout,
        Path: USER_LAYOUT,
    },
    {
        Component:UserHome,
        Path: USER_HOME,
    },
    {
        Component:LocationUser,
        Path: USER_LOCATION,
    },
]
export const SellerRouters = [
    {
        Component:SellerHome,
        Path: SELLER_HOME,
    }
]