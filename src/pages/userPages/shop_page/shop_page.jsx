import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import Banner from "../../../assets/img/image (1).png";
import Banner2 from "../../../assets/img/Group 18.png";
import Banner3 from "../../../assets/img/Group 19.svg";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import { Link, useParams } from "react-router-dom";
import { USER_HOME } from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

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
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    }, {
        id: 1,
        img_url:"https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 2,
        img_url:"",
        name: "Tuxum",
        price: "25000",
        info: "Yangi va sifatli tuxumlar.",
        category_id: "2",
    },
    {
        id: 3,
        img_url:"",
        name: "Kartoshka",
        price: "15000",
        info: "Yangi sabzavot.",
        category_id: "3",
    },
    {
        id: 4,
        img_url:"",
        name: "Olma",
        price: "20000",
        info: "Mevalar orasida mashhur.",
        category_id: "4",
    },
    {
        id: 5,
        img_url:"",
        name: "Vitaminlar",
        price: "50000",
        info: "Dorixona mahsuloti.",
        category_id: "5",
    },
];
const ShopPage = () => {
    const [products] = useState(product);
    const { user_id, language } = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const modalRef = useRef(null);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    // Scroll to category
    const scrollToCategory = (id) => {
        const targetRef = categoryRefs.current[id];
        if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // Open modal with selected product
    const openModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    // Close modal function
    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    // Close modal on outside click or swipe down
    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            closeModal();
        }
    };

    const handleSwipeDown = (e) => {
        if (e.changedTouches && e.changedTouches[0].clientY - e.touches[0].clientY > 50) {
            closeModal();
        }
    };
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientY); // Boshlang'ich Y koordinatasini olish
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientY); // Harakat davomida Y koordinatasini olish
    };

    const handleTouchEnd = () => {
        if (touchEnd - touchStart > 100) { // Agar 100px yoki undan ko'p pastga harakat bo'lsa
            closeModal();
        }
    };
    console.log(modalOpen)
    return (
        <section className="shop_page" onClick={handleOutsideClick} onTouchEnd={handleSwipeDown}>
            <div className="shop_page_header container">
                <Link
                    className="user_map_top_back"
                    to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}
                >
                    <ChevronLeftIcon />
                </Link>
                <h1 className="shop_name">SHOP NAME </h1>
            </div>
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

                {/* Category buttons */}
                <Swiper
                    className="btn-button"
                    grabCursor={true}
                    spaceBetween={20}
                    slidesPerView={2.5}
                >
                    {category.map((cat) => (
                        <SwiperSlide key={cat.id} onClick={() => scrollToCategory(cat.id - 1)}>
                            <LocalGroceryStoreRoundedIcon />
                            {cat.category_name}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Categories */}
            <div className="category_section container">
                {category.map((cat, index) => (
                    <div
                        key={index}
                        className="category_block"
                        ref={(el) => (categoryRefs.current[index] = el)}
                    >
                        <h2 className="category_title">
                            <LocalGroceryStoreRoundedIcon />
                            {cat.category_name}
                        </h2>
                        <div className="product_row">
                            {products
                                .filter((product) => product.category_id === cat.id.toString())
                                .map((product, index) => (
                                    <div
                                        key={index}
                                        className="shop_product_card"
                                        onClick={() => openModal(product)}
                                    >
                                        <img src={product?.img_url} alt="" />
                                        <div className="shop_product_text">
                                            <h3>{product.name}</h3>
                                            <p className="product_count">500 gr</p>
                                            <p className="product_price">{product.price} so'm</p>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="shop_modal"
                     onTouchStart={handleTouchStart}
                     onTouchMove={handleTouchMove}
                     onTouchEnd={handleTouchEnd}
                >
                    <div className="modal_content" ref={modalRef}>
                        {selectedProduct && (
                            <>
                                <img src={selectedProduct.img_url} alt={selectedProduct.name} />
                                <h3>{selectedProduct.name}</h3>
                                <p>{selectedProduct.info}</p>
                                <p>Price: {selectedProduct.price} so'm</p>
                            </>
                        )}
                        <button onClick={closeModal}>Close</button>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ShopPage;
