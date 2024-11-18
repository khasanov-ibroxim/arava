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
import {useParams} from "react-router-dom";
import {A11y,} from "swiper/modules";
import {SwiperSlide , Swiper} from "swiper/react";

import Banner from "../../../assets/img/image (1).png"
import Banner2 from "../../../assets/img/Group 18.png"
import Banner3 from "../../../assets/img/Group 19.svg"


const UserHome = ({user}) => {
    const {user_id} = useParams();

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
                            <div >
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
                        <div className="col-lg-12">
                            <div className="product-two">
                                <img src={foto} className='logo' alt=""/>
                                <div className="bottom">
                                    <p className="left">65% gacha chegirma</p>
                                    <p className="right"><img src={star} className='star' alt=""/> 4.5 (500+)</p>
                                </div>
                            </div>
                            <div className="product-two-bottom">
                                <p className="bottom-left">
                                    VIVO Supermarket <span className='one'>Business Bay</span><br/>
                                    <span className='two'>oziq - ovqat do’kon</span>
                                </p>
                                <p className="bottom-right">
                                    60 min
                                    <AccessTimeIcon/>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-three">
                                <img src={foto1} className='logo' alt=""/>
                                <div className="bottom">
                                    <p className="left">65% chegirma</p>
                                    <p className="right"><img src={star} className='star' alt=""/> 4.5 (500+)</p>
                                </div>
                            </div>
                            <div className="product-three-bottom">
                                <p className="bottom-left">
                                    Ovear Supermarket <span className='one'>Business Bay</span><br/>
                                    <span className='two'>oziq - ovqat do’kon</span>
                                </p>
                                <p className="bottom-right">
                                    Grafik
                                    <CalendarMonthIcon/>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-four">
                                <img src={foto2} className='logo' alt=""/>
                            </div>
                            <div className="product-three-bottom">
                                <p className="bottom-left">
                                    Ovear Supermarket <span className='one'>Business Bay</span><br/>
                                    <span className='two'>oziq - ovqat do’kon</span>
                                </p>
                                <p className="bottom-right">
                                    Grafik
                                    <CalendarMonthIcon/>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Bottom/>
        </>
    );
};

export default UserHome;