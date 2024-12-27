import React, { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import { Link, useParams } from "react-router-dom";
import { USER_HOME, USER_SINGLE_BASKET_BAR } from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

import {
    productByShopStore,
    shopBannerStore,
    shopCategoryStore,
    shopSingleStore
} from "../../../zustand/shopStore.jsx";
import { useBasketStore } from "../../../zustand/basketStore.jsx";
import Cart_item from "../../../component/cart_item/cart_item.jsx";

const ShopPage = () => {
    const { user_id, language, shop_id } = useParams();
    const { data_banner, getBanner } = shopBannerStore();
    const {  data_shop } = shopSingleStore();
    const {single_basket_data,} = useBasketStore();

    const fetchShopData = useCallback(() => {
        if (shop_id) {
            getBanner(shop_id);
        }
    }, [shop_id]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);



    return (
        <section className="shop_page">
            <div className="shop_page_header container">
                <Link
                    className="user_map_top_back"
                    to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}
                >
                    <ChevronLeftIcon />
                </Link>
                <h1 className="shop_name">{data_shop?.shop?.name}</h1>
            </div>

            <div className="shop_banner container">
                {data_banner.length > 0 && (
                    <Swiper className="product_slider" grabCursor={true} spaceBetween={20} slidesPerView={1.1}>
                        {data_banner.map((item, index) => (
                            <SwiperSlide key={index}>
                                <img src={`https://backend1.mussi.uz/${item.photo}`} alt="Banner" />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>



            <div className="category_section container">
                <Cart_item/>
            </div>



            {single_basket_data?.carts?.length > 0 && (
                <Link
                    className={"cart_single_shop"}
                    to={USER_SINGLE_BASKET_BAR.replace(":user_id", user_id)
                        .replace(":language", language)
                        .replace(":shop_id", shop_id)}
                >
                    <h1>Buyurtmalaringiz {single_basket_data?.carts.length}</h1>
                </Link>
            )}
        </section>
    );
};

export default ShopPage;