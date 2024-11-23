import React from 'react';
import "./profile.css"
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import SettingsIcon from '@mui/icons-material/Settings';
const Profile = ({user}) => {
    console.log(user)
    return (
        <div className={"user_profile container"}>
            <div className="user_profile_title">
                <p>Xush kelibsiz</p>
                <h2>{user.username ? user.username : user.first_name}</h2>
            </div>

            <div className="user_profile_box">
              <div className="user_profile_item">
                  <div className="user_profile_item_img"><PermIdentityIcon/></div>
                  <div className="user_profile_item_text">Shaxsiy ma'lumotlarim</div>
                  <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
              </div>
              <div className="user_profile_item">
                  <div className="user_profile_item_img"><FavoriteBorderIcon/></div>
                  <div className="user_profile_item_text">Sevimli mahsulotlarim</div>
                  <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
              </div>
              <div className="user_profile_item">
                  <div className="user_profile_item_img"><ShoppingBasketIcon/></div>
                  <div className="user_profile_item_text">Buyurtmalarim</div>
                  <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
              </div>
              <div className="user_profile_item">
                  <div className="user_profile_item_img"><SettingsIcon/></div>
                  <div className="user_profile_item_text">Sozlamalar</div>
                  <div className="user_profile_item_icon"><ArrowForwardIosIcon/></div>
              </div>
            </div>
        </div>
    );
};

export default Profile;