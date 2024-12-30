import React, { useState } from 'react';
import { USER_HOME, USER_SINGLE_BASKET_BAR } from "../../../../utils/const.jsx";
import Back_button from "../../../../component/back_button/back_button.jsx";
import "./sinlgle_checkout.css";
import { Swiper, SwiperSlide } from "swiper/react";
import {EffectCoverflow, Pagination} from 'swiper/modules';
import nal from "../../../../assets/img/nal.png";

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
        <div>
            <Back_button url={USER_SINGLE_BASKET_BAR} title={"Checkout"}/>
            <section className={"single_checkout container"}>
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
                                        check
                                    </div>
                                )}
                                <h1>{item.name}</h1>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </section>
        </div>
    );
}

export default SingleCheckout;
