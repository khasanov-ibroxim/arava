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
const UserHome = () => {
    return (
        <>
            <Top />
            <section className='user'>
                <div className="container">
                    <div className="icon">
                        <ViewListRoundedIcon />
                        <ViewCompactAltIcon />
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
                            <div className="btn-button">
                                <button><LocalGroceryStoreRoundedIcon />Supermarketlar</button>
                                <button><LocalDiningRoundedIcon />Restoranlar</button>
                                <button><AddRoundedIcon /> Dorixona</button>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product-two">
                                <img src={foto} className='logo' alt="" />
                                <div className="bottom">
                                    <p className="left">65% gacha chegirma</p>
                                    <p className="right"><img src={star} className='star' alt="" /> 4.5 (500+)</p>
                                </div>
                            </div>
                            <div className="product-two-bottom">
                                <p className="bottom-left">
                                    VIVO  Supermarket  <span className='one'>Business Bay</span><br/>
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
                                <img src={foto1} className='logo' alt="" />
                                <div className="bottom">
                                    <p className="left">65% chegirma</p>
                                    <p className="right"><img src={star} className='star' alt="" /> 4.5 (500+)</p>
                                </div>
                            </div>
                            <div className="product-three-bottom">
                                <p className="bottom-left">
                                Ovear  Supermarket   <span className='one'>Business Bay</span><br/>
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
                                <img src={foto2} className='logo' alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Bottom />
        </>
    );
};

export default UserHome;