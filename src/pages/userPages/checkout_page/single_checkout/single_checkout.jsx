import React, { useState } from 'react';
import { USER_HOME, USER_SINGLE_BASKET_BAR } from "../../../../utils/const.jsx";
import Back_button from "../../../../component/back_button/back_button.jsx";
import "./sinlgle_checkout.css";
import { Swiper, SwiperSlide } from "swiper/react";
import {EffectCoverflow, Pagination} from 'swiper/modules';
import nal from "../../../../assets/img/nal.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Input, Popconfirm} from "antd";
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
        name: "Fiksal",
        photo: "",
        open: true
    },
];

function SingleCheckout(props) {
    const [activeIndex, setActiveIndex] = useState(0); // Set initial active index

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex); // Update active index on slide change
    };
    console.log(PaymentMethod)
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

                    <div className="checkout_input_box">
                        <p>Ismingiz</p>
                        <Input type="text"/>
                    </div>
                    <div className="checkout_input_box">
                        <p>Telefon raqamingiz</p>
                        <Input type="text"/>
                    </div>


                    <div className="personal_user_item">
                        <p>Manzilingiz : sadsadasd as dasdsdas sad</p>
                        <button type="primary">
                            Manzilni o'zgartirish
                        </button>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default SingleCheckout;
