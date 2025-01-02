import React, {useEffect, useState} from 'react';
import {USER_HOME, USER_LOCATION, USER_SINGLE_BASKET_BAR} from "../../../../utils/const.jsx";
import Back_button from "../../../../component/back_button/back_button.jsx";
import "./sinlgle_checkout.css";
import {Swiper, SwiperSlide} from "swiper/react";
import {EffectCoverflow, Pagination} from 'swiper/modules';
import nal from "../../../../assets/img/nal.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Input, Popconfirm} from "antd";
import {userLocationStore, userStore} from "../../../../zustand/userStore.jsx";
import {Link, useParams} from "react-router-dom";

const PaymentMethod = [
    {
        id: 1,
        name: "Naxt",
        photo: "https://api.logobank.uz/media/logos_png/payme-01.png",
        open: true
    },
    {
        id: 2,
        name: "Click",
        photo: "",
        open: true
    },
    {
        id: 3,
        name: "Payme",
        photo: "",
        open: true
    },
    {
        id: 4,
        name: "Fiskal",
        photo: "",
        open: true
    },
];

function SingleCheckout(props) {
    const {user_id , language} = useParams()
    const [activeIndex, setActiveIndex] = useState(0); // Set initial active index
    const {getLocation, address} = userLocationStore();
    const {data,} = userStore();
    const [initialState, setInitialState] = useState(data);


    useEffect(() => {
        getLocation()
    }, [])


    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
    };

    const formatPhoneNumber = (value) => {
        const formattedValue = value.replace(/\D/g, '');
        let formattedNumber = '+998';
        if (formattedValue.length > 3) formattedNumber += ' ' + formattedValue.substring(3, 5);
        if (formattedValue.length > 5) formattedNumber += ' ' + formattedValue.substring(5, 8);
        if (formattedValue.length > 8) formattedNumber += ' ' + formattedValue.substring(8, 10);
        if (formattedValue.length > 10) formattedNumber += ' ' + formattedValue.substring(10, 12);
        return formattedNumber;
    };

    return (
        <div className={"single_checkout"}>
            <Back_button url={USER_SINGLE_BASKET_BAR} title={"Checkout"}/>
            <section className={" container"}>

                <div className="checkout_payment_method_box">

                    <div className="checkout_title">
                        <h1>To'lov turi</h1>
                        <p>To'lov turini tanlang</p>
                    </div>
                    <Swiper
                        className="product_slider" grabCursor={true} spaceBetween={10} slidesPerView={1.15}
                        onSlideChange={handleSlideChange}
                        initialSlide={0} // Start from the second slide (index 1)
                    >
                        {PaymentMethod.map((item, index) => (
                            <SwiperSlide
                                key={index}
                                className={`checkout_payment_method_item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <div className="checkout_payment_method_item_content">
                                    {activeIndex === index && (
                                        <div className="checkmark">
                                            <CheckCircleIcon/>
                                        </div>
                                    )}
                                    <h1>{item.name}</h1>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="checkout_input_section">
                    <div className="checkout_title">
                        <h1>Buyurtmachining malumotlari</h1>
                        <p>Malumotlaringizni kiriting</p>
                    </div>

                    <div className="checkout_input_box" style={{marginTop: 5}}>
                        <p>F.I.O</p>
                        <Input type="text" value={initialState?.first_name}
                               onChange={(e) => setInitialState({...initialState, first_name: e.target.value})}
                        />
                    </div>
                    <div className="checkout_input_box">
                        <p>Telefon raqamingiz</p>
                        <Input type="text" value={formatPhoneNumber(initialState?.contact)}
                               onChange={(e) =>
                                   setInitialState({...initialState, contact: formatPhoneNumber(e.target.value)})
                               }
                        />
                    </div>


                    <div className="personal_user_item checkout_title">
                        <h1>Manzilingiz :</h1>
                        <p>
                            {address ? address : "Manzilingiz topilmadi"}</p>
                        <Link type="primary"
                              to={USER_LOCATION.replace(":user_id", user_id).replace(":language", language)}>
                            Manzilni o'zgartirish
                        </Link>
                    </div>


                </div>
            </section>
        </div>
    );
}

export default SingleCheckout;
