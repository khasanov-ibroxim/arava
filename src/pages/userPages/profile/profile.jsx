import React from 'react';
import "./profile.css"
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SettingsIcon from '@mui/icons-material/Settings';
import {userStore} from "../../../zustand/userStore.jsx";
import {Link, useParams} from "react-router-dom";
import {
    USER_BASKET_BAR,
    USER_PROFILE_FAVORITE,
    USER_PROFILE_PERSONAL,
    USER_PROFILE_SETTINGS
} from "../../../utils/const.jsx";

import "./component/profile_component.css"

const Profile = ({user}) => {
    const {data} = userStore()
    const {user_id, language} = useParams()

    return (
        <>

            <div className={"user_profile container"}>
                <div className="user_profile_title">
                    <p>Xush kelibsiz</p>
                    <h2>{data.username ? data.username : data.first_name}</h2>
                </div>

                <div className="user_profile_box">
                    <Link className="user_profile_item"
                          to={USER_PROFILE_PERSONAL.replace(":user_id", user_id).replace(":language", language)}>
                        <div className="user_profile_item_img"><PermIdentityIcon/></div>
                        <div className="user_profile_item_text">Shaxsiy ma'lumotlarim</div>
                        <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
                    </Link>
                    <Link className="user_profile_item"
                          to={USER_PROFILE_FAVORITE.replace(":user_id", user_id).replace(":language", language)}>
                        <div className="user_profile_item_img"><FavoriteBorderIcon/></div>
                        <div className="user_profile_item_text">Sevimli mahsulotlarim</div>
                        <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
                    </Link>
                    <Link className="user_profile_item"
                          to={USER_BASKET_BAR.replace(":user_id", user_id).replace(":language", language)}>
                        <div className="user_profile_item_img"><ShoppingBasketIcon/></div>
                        <div className="user_profile_item_text">Buyurtmalarim</div>
                        <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
                    </Link>

                    {/*<Link className="user_profile_item"*/}
                    {/*      to={USER_PROFILE_SETTINGS.replace(":user_id", user_id).replace(":language", language)}>*/}
                    {/*    <div className="user_profile_item_img"><SettingsIcon/></div>*/}
                    {/*    <div className="user_profile_item_text">Sozlamalar</div>*/}
                    {/*    <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>*/}
                    {/*</Link>*/}
                </div>
                <div className="user_profile_hamkor">
                    <h4>Hamkorlik uchun murojat qiling</h4>
                    <a href="#">Biz bilan bog'lanish</a>
                </div>
            </div>
        </>
    );
};

export default Profile;