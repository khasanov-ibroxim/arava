import React, {useEffect, useState} from 'react';
import "./basket.css";
import {Swiper, SwiperSlide} from "swiper/react";
import {useBasketStore} from "../../../zustand/basketStore.jsx";
import {useParams} from "react-router-dom";
import No_data from "../../../component/no_data/no_data.jsx";

const Basket_bar = () => {
    const {
        basketAllShops,
        getAllShopsBasket
    } = useBasketStore();

    const {user_id, language} = useParams();
    const [shopsData, setShopsData] = useState(basketAllShops && basketAllShops);

    useEffect(() => {
        getAllShopsBasket(user_id)
    }, [])

    console.log(shopsData)
    return (
        <div className="basket_box">
            {shopsData.length > 0 ? (
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
                    {shopsData.map((shop, index) => (
                        <SwiperSlide key={index}>
                            <div className="shop-item">
                                <h3>{shop.shop.name}</h3>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <No_data no_data_title={"Buyurtmalar"} no_data_msg={"Hozirda mavjud buyurtmalar yo'q"}/>
            )}
        </div>
    );
};

export default Basket_bar;
