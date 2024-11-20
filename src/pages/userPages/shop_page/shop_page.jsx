import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"; // Swiper uchun CSS
import "./shop_page.css";

import Banner from "../../../assets/img/image (1).png";
import Banner2 from "../../../assets/img/Group 18.png";
import Banner3 from "../../../assets/img/Group 19.svg";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";


const category = [
    { id: 1, category_name: "Go'sht" },
    { id: 2, category_name: "Tuxum" },
    { id: 3, category_name: "Sabzavotlar" },
    { id: 4, category_name: "Mevalar" },
    { id: 5, category_name: "Dorixona" },
];

const product = [
    {
        id: 1,
        img_url:Banner,
        name: "Mol go'shti qovirga",
        price: "72900",
        info: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: `Lorem ipsum dolor sit amet, consectetur adipisicing elit.`,
        category_id: "1",
    },
    {
        id: 2,
        img_url:"",
        name: "Tuxum",
        price: "25000",
        info: `Yangi va sifatli tuxumlar.`,
        category_id: "2",
    },
    {
        id: 3,
        img_url:"",
        name: "Kartoshka",
        price: "15000",
        info: `Yangi sabzavot.`,
        category_id: "3",
    },
    {
        id: 4,
        img_url:"",
        name: "Olma",
        price: "20000",
        info: `Mevalar orasida mashhur.`,
        category_id: "4",
    },
    {
        id: 5,
        img_url:"",
        name: "Vitaminlar",
        price: "50000",
        info: `Dorixona mahsuloti.`,
        category_id: "5",
    },
];

const ShopPage = () => {
    const [products] = useState(product);

    // Har bir kategoriya uchun ref yaratamiz
    const categoryRefs = useRef([]);

    // Scroll qilish funksiyasi
    const scrollToCategory = (id) => {
        const targetRef = categoryRefs.current[id];
        if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    return (
        <section className="shop_page">
            {/* Banner bo'limi */}
            <div className="shop_banner container">
                <Swiper
                    className="product_slider"
                    grabCursor={true}
                    spaceBetween={20}
                    slidesPerView={1.1}
                >
                    <SwiperSlide>
                        <img src={Banner} alt="Banner 1" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={Banner2} alt="Banner 2" />
                    </SwiperSlide>
                    <SwiperSlide>
                        <img src={Banner3} alt="Banner 3" />
                    </SwiperSlide>
                </Swiper>

                {/* Kategoriyalar uchun tugmalar */}
                <Swiper
                    className="btn-button"
                    grabCursor={true}
                    spaceBetween={20}
                    slidesPerView={2.5}
                >
                    {category.map((cat) => (
                        <SwiperSlide
                            key={cat.id}
                            onClick={() => scrollToCategory(cat.id - 1)}
                        >
                            <LocalGroceryStoreRoundedIcon />
                            {cat.category_name}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Kategoriyalar */}
            <div className="category_section container">
                {category.map((cat, index) => (
                    <div
                        key={cat.id}
                        className="category_block"
                        ref={(el) => (categoryRefs.current[index] = el)} // Refni saqlash
                    >
                        <h2 className="category_title">
                            <LocalGroceryStoreRoundedIcon />
                            {cat.category_name}
                        </h2>
                        <div className="product_row">
                            {products
                                .filter(
                                    (product) =>
                                        product.category_id === cat.id.toString()
                                )
                                .map((product) => (
                                    <div key={product.id} className="shop_product_card">
                                        <img src={product?.img_url} alt=""/>
                                        <div className="shop_product_text">
                                            <h3>{product.name}</h3>
                                            <p className="product_count">500 gr</p>
                                            <p className="product_price">
                                                {product.price} so'm
                                            </p>
                                        </div>

                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ShopPage;
