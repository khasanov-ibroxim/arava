import React from 'react'
import "./Bottom.css"
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import foto from '../../assets/img/Ellipse 2.svg'
import {useTranslation} from "react-i18next";
import {Link, useParams} from "react-router-dom";
import {USER_HOME} from "../../utils/const.jsx";


export default function Bottom() {
  const {t} = useTranslation();
const {user_id , language} = useParams()
  return (
    <section className='bottom'>
            <div className="box-top" >
              <img src={foto} alt="" />
              <div className="icon">
                <ShoppingBasketIcon />
              </div>
              <p className="last">83 856 UZS</p>
              <p className="last_savat">{t("bottomBar.basket")}</p>
            </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page">
              <Link to={USER_HOME.replace(":user_id", user_id).replace(":language", language)} className="box">
                <HomeIcon />
                <p className="bottom">{t("bottomBar.home")}</p>
              </Link>
              <div className="box" style={{marginLeft:"14px"}}>
                <SearchIcon />
                <p className="bottom">{t("bottomBar.search")}</p>
              </div>
              <div className="box" style={{marginRight:"100px"}}>
                <p className="bottom"></p>
              </div>
              <div className="box" >
                <ArticleIcon />
                <p className="bottom">{t("bottomBar.news")}</p>
              </div>
              <div className="box">
                <PersonIcon />
                <p className="bottom">{t("bottomBar.profile")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
