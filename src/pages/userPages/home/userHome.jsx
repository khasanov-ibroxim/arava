import React from 'react';
import "./userHome.css"
import Top from '../../../component/top/Top';
import LocalGroceryStoreRoundedIcon from '@mui/icons-material/LocalGroceryStoreRounded';
import LocalDiningRoundedIcon from '@mui/icons-material/LocalDiningRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded';
import ViewCompactAltIcon from '@mui/icons-material/ViewCompactAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Bottom from '../../../component/bottom/Bottom.jsx';
import foto from '../../../assets/img/Group 2.svg'
import star from '../../../assets/img/Vector.svg'
import foto1 from '../../../assets/img/Group 3.svg'
import foto2 from '../../../assets/img/Group 10.svg'
import {Link, useParams} from "react-router-dom";
import {A11y,} from "swiper/modules";
import {SwiperSlide, Swiper} from "swiper/react";

import Banner from "../../../assets/img/image (1).png"
import Banner2 from "../../../assets/img/Group 18.png"
import Banner3 from "../../../assets/img/Group 19.svg"

import product1 from "../../../assets/img/Group 18.svg"
import {SHOP_PAGE} from "../../../utils/const.jsx";

const shop_item = [
    {
        id:1,
        img_url: product1,
        sell: "65",
        rating: "4.5",
        name: "VIVO Supermarket",
        sub_name: "Business Bay",
        category: "oziq - ovqat do’kon",
        deliver: "60"
    },
    {
        id:2,
        img_url: product1,
        sell: "65",
        rating: "4.5",
        name: "Ovear Supermarket",
        sub_name: "Business Bay",
        category: "oziq - ovqat do’kon",
        deliver: null
    },
]

const UserHome = ({user}) => {
    const {user_id, language} = useParams();

    return (
        <>
            <Top user={user} user_id={user_id}/>
            {/*{user_id}*/}
            <section className='user'>
                <div className="container">
                    <div className="icon">
                        <ViewListRoundedIcon/>
                        <ViewCompactAltIcon/>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product">
                                <Swiper
                                    className="product"
                                    // install Swiper modules
                                    // modules={[ A11y ]}
                                    grabCursor={true}
                                    spaceBetween={20}
                                    slidesPerView={1.1}
                                    onSwiper={(swiper) => console.log(swiper)}
                                    onSlideChange={() => console.log('slide change')}
                                >
                                    <SwiperSlide> <img src={Banner} alt=""/></SwiperSlide>
                                    <SwiperSlide> <img src={Banner2} alt=""/></SwiperSlide>
                                    <SwiperSlide> <img src={Banner3} alt=""/></SwiperSlide>
                                </Swiper>

                            </div>
                            <div>
                                <Swiper
                                    className="btn-button"
                                    // install Swiper modules
                                    // modules={[ A11y ]}
                                    grabCursor={true}
                                    spaceBetween={20}
                                    slidesPerView={2.5}
                                    onSwiper={(swiper) => console.log(swiper)}
                                    onSlideChange={() => console.log('slide change')}
                                >
                                    <SwiperSlide> <LocalGroceryStoreRoundedIcon/>Supermarket</SwiperSlide>
                                    <SwiperSlide><LocalDiningRoundedIcon/>Restoranlar</SwiperSlide>
                                    <SwiperSlide><AddRoundedIcon/> Dorixona1</SwiperSlide>
                                    <SwiperSlide><AddRoundedIcon/> Dorixona1</SwiperSlide>
                                    <SwiperSlide><AddRoundedIcon/> Dorixona1</SwiperSlide>
                                    <SwiperSlide><AddRoundedIcon/> Dorixona12</SwiperSlide>
                                    <SwiperSlide><AddRoundedIcon/> Dorixona1</SwiperSlide>
                                </Swiper>


                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {shop_item.map((item, index) => (
                            <Link to={SHOP_PAGE.replace(":shop_id" , item.id).replace(":user_id" , user_id).replace(":language" , language)} className="col-lg-12" key={index}>
                                <div className="product_item" style={{background: `url(${item.img_url})`}}>
                                    <div className="bottom">
                                        <p className="left">{item.sell}% gacha chegirma</p>
                                        <p className="right"><img src={star} className='star' alt=""/> {item.rating}</p>
                                    </div>
                                </div>
                                <div className="product_item-bottom">
                                    <p className="bottom-left">
                                        {item.name} <span className='one'>{item.sub_name && item.sub_name}</span><br/>
                                        <span className='two'>{item.category}</span>
                                    </p>
                                    <p className="bottom-right">
                                        {item.deliver ? <>{item.deliver} min <AccessTimeIcon/></> : <>Grafik <CalendarMonthIcon style={{transform:"rotate(0deg)"}}/></>}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>
            <Bottom/>
        </>
    );
};

export default UserHome;