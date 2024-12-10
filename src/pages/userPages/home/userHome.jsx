import React, {useEffect, useState} from "react";
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
import {Link, useParams} from "react-router-dom";
import {SwiperSlide, Swiper} from "swiper/react";

import {SHOP_PAGE} from "../../../utils/const.jsx";
import {homeBannerStore, homeCategoryStore, shopStore} from "../../../zustand/shopStore.jsx";

const UserHome = ({user}) => {
    const {user_id, language} = useParams();
    const [shopLayout, setShopLayout] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0); // Track active slide index
    const [error, setError] = useState(null);
    const {getShop, data, loading} = shopStore();
    const {getBanner, data_banner} = homeBannerStore();
    const {getCategory, data_category} = homeCategoryStore();

    useEffect(() => {
        if (!data) {
            getShop().catch(() => setError("Failed to load shop data."));
            getBanner().catch(() => setError("Failed to load banners."));
            getCategory().catch(() => setError("Failed to load categories."));
        }
    }, [data, getShop, getBanner, getCategory]);

    const handleSlideClick = (index) => {
        setActiveIndex(index); // Set active slide index
    };

    const generateShopUrl = (shopId) =>
        SHOP_PAGE.replace(":shop_id", shopId)
            .replace(":user_id", user_id)
            .replace(":language", language);

    return (
        <>
            <Top user={user} user_id={user_id}/>
            <section className="user">
                <div className="container">
                    {/* Layout toggle button */}
                    <div className="icon" onClick={() => setShopLayout(!shopLayout)}>
                        {shopLayout ? <ViewCompactAltIcon/> : <ViewListRoundedIcon/>}
                    </div>

                    {/* Banner Section */}
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="product">
                                {loading && <p>Loading banners...</p>}
                                {error && <p className="error-message">{error}</p>}
                                {data_banner.length > 0 && (
                                    <Swiper
                                        className="product"
                                        grabCursor={true}
                                        spaceBetween={20}
                                        slidesPerView={1.1}
                                    >
                                        {data_banner.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <img src={item.photo} alt={`Banner ${index + 1}`}/>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                )}
                            </div>

                            {/* Category Section */}
                            <div>
                                {data_category.length > 0 && (
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
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Shop List Section */}
                    <div className={`row ${shopLayout ? "shop_active" : ""}`}>
                        {data && data.length > 0 ? (
                            data.map((item, index) => (
                                <Link
                                    to={generateShopUrl(item.id)}
                                    className={`col-lg-12 ${shopLayout ? "shop_active_item" : ""}`}
                                    key={index}
                                >
                                    <div
                                        className={`product_item ${
                                            shopLayout ? "shop_active_item_product" : ""
                                        }`}
                                        style={{background: `url(${product1})`}}
                                    >
                                        <div className="bottom">

                                            <p className={`left ${item.discount_price && "active"}`}>{item.discount_price && <>{item.discount_price} % gacha
                                                chegirma</>}</p>
                                            <p className="right"><img src={star} className='star' alt=""/> {item.rating}
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
                            <p className="no-data">No shops available</p>
                        )}
                    </div>
                </div>
            </section>
            <Bottom/>
        </>
    );
};

export default UserHome;
