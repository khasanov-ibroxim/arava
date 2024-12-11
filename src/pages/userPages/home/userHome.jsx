import React, { useEffect, useState, useCallback, useMemo } from "react";
import "./userHome.css";
import Top from "../../../component/top/Top";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import LocalDiningRoundedIcon from "@mui/icons-material/LocalDiningRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import ViewCompactAltIcon from "@mui/icons-material/ViewCompactAlt";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Bottom from "../../../component/bottom/Bottom.jsx";
import star from "../../../assets/img/Vector.svg";
import product1 from "../../../assets/img/Group 18.svg";
import { Link, useParams } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";

import { SHOP_PAGE } from "../../../utils/const.jsx";
import { homeBannerStore, homeCategoryStore, shopStore } from "../../../zustand/shopStore.jsx";
import No_data from "../../../component/no_data/no_data.jsx";
import Loading from "../../../component/loading/loading.jsx";

const UserHome = React.memo(({ user }) => {
    const { user_id, language } = useParams();
    const [shopLayout, setShopLayout] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    const { getShop, data, loading: shopLoading, error: shopError } = shopStore();
    const { getBanner, data_banner, loading: bannerLoading, error: bannerError } = homeBannerStore();
    const { getCategory, data_category, loading: categoryLoading, error: categoryError } = homeCategoryStore();

    const fetchInitialData = useCallback(async () => {
        try {
            await Promise.all([
                getShop(),
                getBanner(),
                getCategory()
            ]);
        } catch (error) {
            console.error("Failed to fetch initial data:", error);
        }
    }, [getShop, getBanner, getCategory]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleSlideClick = useCallback((index) => {
        setActiveIndex(index);
    }, []);

    const generateShopUrl = useCallback((shopId) =>
            SHOP_PAGE.replace(":shop_id", shopId)
                .replace(":user_id", user_id)
                .replace(":language", language),
        [user_id, language]
    );

    const isLoading = shopLoading || bannerLoading || categoryLoading;
    const hasError = shopError || bannerError || categoryError;

    const shopsToRender = useMemo(() =>
            data && data.length > 0 ? data : [],
        [data]
    );

    if (isLoading) {
        return (
            <div className="loading-container">
                <Loading/>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className="error-container">
                <p>Failed to load data. Please try again later.</p>
            </div>
        );
    }

    return (
        <>
            <Top user={user} user_id={user_id}/>
            <section className="user">
                <div className="container">
                    <div className="icon" onClick={() => setShopLayout(!shopLayout)}>
                        {shopLayout ? <ViewCompactAltIcon/> : <ViewListRoundedIcon/>}
                    </div>

                    <div className="row">
                        <div className="col-lg-12">
                            {data_banner.length > 0 && (
                                <div className="product">
                                    <Swiper
                                        className="product"
                                        grabCursor={true}
                                        spaceBetween={20}
                                        slidesPerView={1.1}
                                    >
                                        {data_banner.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <img
                                                    src={item.photo}
                                                    alt={`Banner ${index + 1}`}
                                                    loading="lazy"
                                                />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}

                            {data_category.length > 0 && (
                                <div>
                                    <Swiper
                                        className="btn-button"
                                        grabCursor={true}
                                        spaceBetween={5}
                                        slidesPerView={2.5}
                                        loop={false}
                                        touchRatio={1}
                                        resistanceRatio={0.5}
                                        speed={600}
                                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                                    >
                                        {data_category.map((cat, index) => (
                                            <SwiperSlide
                                                key={index}
                                                className={activeIndex === index ? "active" : ""}
                                                onClick={() => handleSlideClick(index)}
                                            >
                                                {cat.name}
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`row ${shopLayout ? "shop_active" : ""}`}>
                        {shopsToRender.length > 0 ? (
                            shopsToRender.map((item) => (
                                <Link
                                    to={generateShopUrl(item.id)}
                                    className={`col-lg-12 ${shopLayout ? "shop_active_item" : ""}`}
                                    key={item.id}
                                >
                                    <div
                                        className={`product_item ${
                                            shopLayout ? "shop_active_item_product" : ""
                                        }`}
                                        style={{background: `url(${product1})`}}
                                    >
                                        <div className="bottom">
                                            {item.discount_price && (
                                                <p className="left active">
                                                    {item.discount_price} % gacha chegirma
                                                </p>
                                            )}
                                            <p className="right">
                                                <img src={star} className='star' alt="Rating"/>
                                                {item.rating}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="product_item-bottom">
                                        <p className="bottom-left">
                                            {item.name}{" "}
                                            {item.sub_name && <span className="one">{item.sub_name}</span>} <br/>
                                            <span className="two">{item.category}</span>
                                        </p>
                                        <p className="bottom-right">
                                            {item.deliver && item.work_time === "open" ? (
                                                <>
                                                    {item.deliver} min <AccessTimeIcon/>
                                                </>
                                            ) : (
                                                <>
                                                    Grafik{" "}
                                                    <CalendarMonthIcon style={{transform: "rotate(0deg)"}}/>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            <No_data no_data_title={"Do'kon topilmadi"} no_data_msg={"Hozirda mavjud do'konlar yo'q"}/>
                        )}
                    </div>
                </div>
            </section>
            <Bottom/>
        </>
    );
});

export default UserHome;