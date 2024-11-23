import React, { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import Banner from "../../../assets/img/image (1).png";
import Banner2 from "../../../assets/img/Group 18.png";
import Banner3 from "../../../assets/img/Group 18.svg";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import { Link, useParams } from "react-router-dom";
import { USER_HOME } from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";

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
        img_url: Banner,
        name: "Mol go'shti qovirga",
        price: "720900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 2,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 2,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 2,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 3,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Tuxum",
        price: "25000",
        info: "Yangi va sifatli tuxumlar.",
        category_id: "2",
    },
    {
        id: 3,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Tuxum",
        price: "25000",
        info: "Yangi va sifatli tuxumlar.",
        category_id: "4",
    },
];

const ShopPage = () => {
    const [products] = useState(product);
    const { user_id, language } = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const modalRef = useRef(null);

    // Individual states for save and calc (quantity)
    const [saveStatus, setSaveStatus] = useState({});
    const [productQuantity, setProductQuantity] = useState({});

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

    // Save functionality for each product
    const toggleSave = (productId) => {
        setSaveStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId], // Toggle save status
        }));
    };

    // Update quantity for each product
    const updateQuantity = (productId, action) => {
        setProductQuantity((prev) => {
            const currentQty = prev[productId] || 1; // Default quantity is 1
            const newQty =
                action === "increment" ? currentQty + 1 : Math.max(1, currentQty - 1); // Minimum is 1
            return { ...prev, [productId]: newQty };
        });
    };

    const numberFormatter = (number) => {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    return (
        <section className="shop_page">
            <div className="shop_page_header container">
                <Link
                    className="user_map_top_back"
                    to={USER_HOME.replace(":user_id", user_id).replace(":language", language)}
                >
                    <ChevronLeftIcon />
                </Link>
                <h1 className="shop_name">SHOP NAME</h1>
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

                <Swiper
                    className="btn-button"
                    grabCursor={true}
                    spaceBetween={20}
                    slidesPerView={2.5}
                >
                    {category.map((cat,index) => (
                        <SwiperSlide key={index} onClick={() => scrollToCategory(index)}>
                            <LocalGroceryStoreRoundedIcon/>
                            {cat.category_name}
                        </SwiperSlide>
                    ))}
                </Swiper>

        </div>

            {/* Categories */}
            <div className="category_section container">
                {category
                    .filter((cat) =>
                        products.some((product) => product.category_id === cat.id.toString())
                    )
                    .map((cat, index) => (
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
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="shop_product_card"
                                            onClick={() => openModal(product)}
                                        >
                                            <img src={product?.img_url} alt="" />
                                            <div className="shop_product_text">

                                                <h3>{product.name}</h3>
                                                <div className="product_count">
                                                    300 sa
                                                </div>
                                                <p className="product_price">
                                                    {numberFormatter(product.price)} so'm
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}

            </div>

            {/* Modal */}
            {modalOpen && selectedProduct && (
                <div className={`shop_modal open`}>
                    <div className="modal_content open" ref={modalRef}>
                        <div className="modal_item">
                            <img
                                src={selectedProduct.img_url}
                                alt={selectedProduct.name}
                            />
                            <h3>{selectedProduct.name}</h3>
                            <p> {numberFormatter(selectedProduct.price)} so'm</p>
                            <div className="modal_info">
                                <p>{selectedProduct.info}</p>
                            </div>
                        </div>

                        <button onClick={closeModal} className="modal_close">
                            <CloseIcon/>
                        </button>

                        <button
                            onClick={() => toggleSave(selectedProduct.id)}
                            className={`modal_save ${saveStatus[selectedProduct.id] ? "saved" : ""}`}
                        >
                            <FavoriteIcon />
                        </button>

                        <div className="modal_buy">
                            <div className="modal_calc">
                                <button
                                    onClick={() => updateQuantity(selectedProduct.id, "decrement")}
                                >
                                    -
                                </button>
                                <input
                                    type="number"
                                    readOnly
                                    value={productQuantity[selectedProduct.id] || 1}
                                />
                                <button
                                    onClick={() => updateQuantity(selectedProduct.id, "increment")}
                                >
                                    +
                                </button>
                            </div>
                            <button className="modal_buy_btn">Buyurtma berish</button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default ShopPage;
