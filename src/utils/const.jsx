
import UserHome from "../pages/userPages/home/userHome.jsx";
import SellerHome from "../pages/sellerPages/home/sellerHome.jsx";
import UserLayout from "../pages/userLayout/userLayout.jsx";

// USER
export const USER_LAYOUT = "user_layout/"
export const USER_HOME = "user_home/"


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
]
export const SellerRouters = [
    {
        Component:SellerHome,
        Path: SELLER_HOME,
    }
]