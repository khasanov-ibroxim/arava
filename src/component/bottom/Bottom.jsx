import React from 'react'
import "./Bottom.css"
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import foto from '../../assets/img/Ellipse 2.svg'
export default function Bottom() {
  return (
    <section className='bottom'>
            <div className="box-top">
              <img src={foto} alt="" />
              <div className="icon">
                <ShoppingBasketIcon />
              </div>
              <p className="last">83 856 UZS</p>
              <p className="last_savat">savat</p>
            </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="page">
              <div className="box">
                <HomeIcon />
                <p className="bottom">Bosh Sahifa</p>
              </div>
              <div className="box">
                <SearchIcon />
                <p className="bottom">Qidiruv</p>
              </div>
              <div className="box">
                <p className="bottom"></p>
              </div>
              <div className="box">
                <ArticleIcon />
                <p className="bottom">Yangiliklar</p>
              </div>
              <div className="box">
                <PersonIcon />
                <p className="bottom">Profile</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
