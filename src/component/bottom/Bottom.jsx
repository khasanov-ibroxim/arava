import React from 'react'
import "./Bottom.css"
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import foto from '../../assets/img/Ellipse 2.svg'
import {useTranslation} from "react-i18next";
import {Link, useLocation, useParams} from "react-router-dom";
import {USER_BASKET_BAR, USER_HOME, USER_NEWS, USER_PROFILE, USER_SEARCH} from "../../utils/const.jsx";


export default function Bottom() {
    const {t} = useTranslation();
    const {user_id, language} = useParams()
    const location = useLocation();
    return (<>
        <footer>
            <Link
                  to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}
                  className={`footer_item ${location.pathname === `/${user_id}/${language}` ? 'active' : ''}`}
            >
                <HomeIcon/>
                <p>Marketplace</p>
            </Link>
            <Link

                to={USER_BASKET_BAR.replace(":user_id", user_id).replace(":language", language)}
                className={`footer_item ${location.pathname === `/${user_id}/${language}/user_basket_bar` ? 'active' : ''}`}
            >
                <ShoppingBasketIcon/>
                <p>Basket</p>
            </Link>
            <Link

                  to={USER_PROFILE.replace(":user_id", user_id).replace(":language", language)}
                  className={`footer_item ${location.pathname === `/${user_id}/${language}/user_profile` ? 'active' : ''}`}
            >
                <PersonIcon/>
               <p>Profile</p>
            </Link>
        </footer>
    </>)
}
