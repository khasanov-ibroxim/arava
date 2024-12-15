import React, { useEffect, useState } from 'react';
import "./basket.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { useBasketStore } from "../../../zustand/basketStore.jsx";
import { useParams } from "react-router-dom";
import No_data from "../../../component/no_data/no_data.jsx";

const Basket_bar = () => {
    const {
        getBasketsFromUser,
        baskets_from_user,
        getSingleBasket,
        single_basket_data
    } = useBasketStore();

    const { user_id, language } = useParams();
    const [shopsData, setShopsData] = useState([]); // Alohida state

    const uniqByShopId = (shops) => {
        const seen = new Set();
        return shops.filter((shop) => {
            if (seen.has(shop.shop_id)) {
                return false;
            }
            seen.add(shop.shop_id);
            return true;
        });
    };

    useEffect(() => {
        const fetchBaskets = async () => {
            try {
                if (!baskets_from_user) {
                    await getBasketsFromUser(user_id);
                }

                if (baskets_from_user && baskets_from_user.carts) {
                    const shopIds = baskets_from_user.carts.map(cart => cart.shop_id);

                    const shopDataPromises = shopIds.map(shopId => getSingleBasket(user_id, shopId));
                    const shopDataResults = await Promise.all(shopDataPromises);

                    // Noyob shoplarni saqlash
                    const uniqueShops = uniqByShopId(shopDataResults);
                    setShopsData(uniqueShops);
                }
            } catch (error) {
                console.error("Error fetching basket data:", error);
            }
        };

        fetchBaskets();
    }, [baskets_from_user, getBasketsFromUser, getSingleBasket, user_id]);

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
                                <h3>{shop.name}</h3>
                                <p>{shop.description}</p>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            ) : (
                <No_data no_data_title={"Buyurtmalar"} no_data_msg={"Hozirda mavjud buyurtmalar yo'q"} />
            )}
        </div>
    );
};

export default Basket_bar;
