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

const UserHome = ({user}) => {
    const {user_id} = useParams();

    return (
        <>
            <Top user={user} user_id={user_id}/>
            {user_id}
            <section className='user'>
                <div className="container">
                    <div className="icon">
                        <ViewListRoundedIcon/>
                        <ViewCompactAltIcon/>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product">
                                <p className="top">
                                    Food city
                                </p>
                                <p className="title">
                                    eng arzoni bizda
                                </p>
                                <button>
                                    Ko’rish
                                </button>
                            </div>
                            <div >
                                <Swiper
                                    className="btn-button"
                                    // install Swiper modules
                                    modules={[ A11y ]}
                                    grabCursor={true}
                                    spaceBetween={50}
                                    slidesPerView={3}
                                    onSwiper={(swiper) => console.log(swiper)}
                                    onSlideChange={() => console.log('slide change')}
                                >
                                    <SwiperSlide> <button><LocalGroceryStoreRoundedIcon/>Supermarketlar</button></SwiperSlide>
                                    <SwiperSlide><button><LocalDiningRoundedIcon/>Restoranlar</button></SwiperSlide>
                                    <SwiperSlide><button><AddRoundedIcon/> Dorixona1</button></SwiperSlide>
                                    <SwiperSlide><button><AddRoundedIcon/> Dorixona2</button></SwiperSlide>
                                    <SwiperSlide><button><AddRoundedIcon/> Dorixona3</button></SwiperSlide>
                                    <SwiperSlide><button><AddRoundedIcon/> Dorixona4</button></SwiperSlide>
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