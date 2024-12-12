import React, {useEffect} from 'react';
import "./basket.css"
import {Swiper, SwiperSlide} from "swiper/react";
import {useBasketStore} from "../../../zustand/basketStore.jsx";
import {useParams} from "react-router-dom";
import No_data from "../../../component/no_data/no_data.jsx";

const Basket_bar = ({}) => {
    const {
        getBasketsFromUser,
        baskets_from_user,
        getSingleBasket,
        single_basket_data
    } = useBasketStore()
    const {user_id, language} = useParams()

    useEffect(() => {
        if (!baskets_from_user) {
            getBasketsFromUser(user_id)
        }
        if (baskets_from_user){
            getSingleBasket(user_id, baskets_from_user.carts[0].shop_id)
        }
    }, []);
    console.log(baskets_from_user)
    return (
        <div className="basket_box">
            {/*<Swiper*/}
            {/*    className="btn-button"*/}
            {/*    grabCursor={true}*/}
            {/*    spaceBetween={5}*/}
            {/*    slidesPerView={2.5}*/}
            {/*    loop={false}*/}
            {/*    touchRatio={1}*/}
            {/*    resistanceRatio={0.5}*/}
            {/*    speed={600}*/}
            {/*>*/}
            {/*    <SwiperSlide>*/}

            {/*    </SwiperSlide>*/}

            {/*</Swiper>*/}

            <No_data no_data_title={"Buyurtmalar"} no_data_msg={"Hozirda mavjud buyurtmalar yo'q"}/>
        </div>
    );
};

export default Basket_bar;