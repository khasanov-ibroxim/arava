import React from 'react'
import "./Bottom.css"
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {useTranslation} from "react-i18next";
import {Link, useLocation, useParams} from "react-router-dom";
import {USER_BASKET_BAR, USER_HOME, USER_PROFILE} from "../../utils/const.jsx";


export default function Bottom() {
    const {t} = useTranslation();
    const {user_id, language} = useParams()
    const location = useLocation();
    return (<>
        <footer>

            <div className="menu">
                <Link to={USER_HOME.replace(":user_id", user_id).replace(":language", language)} className="link">
                   <span className={`link-icon ${location.pathname === `/${user_id}/${language}` ? 'active' : ''}`}>
                       <HomeIcon/>
                   </span>
                    <span className="link-title">Bosh sahifa</span>
                </Link>


                <Link className="link" to={USER_BASKET_BAR.replace(":user_id", user_id).replace(":language", language)}>
                   <span
                       className={`link-icon ${location.pathname === `/${user_id}/${language}/user_basket_bar` ? 'active' : ''}`}>
                       <ShoppingCartIcon/>
                   </span>
                    <span className="link-title">Arava</span>
                </Link>


                <Link to={USER_PROFILE.replace(":user_id", user_id).replace(":language", language)} className="link">
                    <span
                        className={`link-icon ${location.pathname === `/${user_id}/${language}/user_profile` ? 'active' : ''}`}>
                       <PersonIcon/>
                    </span>
                    <span className="link-title">Profile</span>
                </Link>
            </div>

        </footer>
    </>)
}
