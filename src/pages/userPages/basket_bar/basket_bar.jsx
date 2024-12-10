import React from 'react';
import "./basket.css"
import {Swiper, SwiperSlide} from "swiper/react";
const Basket_bar = ({active_shop_id}) => {
    return (
        <div className="basket_box">
            <Swiper
                className="btn-button"
                grabCursor={true}
                spaceBetween={5}
                slidesPerView={2.5}
                loop={false}
                touchRatio={1}
                resistanceRatio={0.5}
                speed={600}
            >
                    <SwiperSlide>
                     sadsad
                    </SwiperSlide>

            </Swiper>
        </div>
    );
};

export default Basket_bar;