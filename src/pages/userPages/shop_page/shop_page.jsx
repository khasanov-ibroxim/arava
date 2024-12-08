import React, { useState, useRef, useEffect } from "react";
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
import infoIcon from "../../../assets/icons/info.png";

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
        name: "Mol go'shti qovirga sadasd as dasdasdas asdasd",
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
        id: 120,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 4,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Go'sht",
        price: "72900",
        info: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
        category_id: "1",
    },
    {
        id: 5,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Tuxum",
        price: "25000",
        info: "Yangi va sifatli tuxumlar.",
        category_id: "2",
    },
    {
        id: 6,
        img_url: "https://yukber.uz/image/cache/catalog/product/YK1712/YK1712-600x600.jpg",
        name: "Tuxum",
        price: "25000",
        info: "Yangi va sifatli tuxumlar.",
        category_id: "4",
    },
];

const ShopPage = () => {
    const { user_id, language } = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const modalRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(null); // Track active slide index

    const [saveStatus, setSaveStatus] = useState({});
    const [productQuantity, setProductQuantity] = useState([]);

    useEffect(() => {
        // Load saved cart from localStorage on mount
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        setProductQuantity(savedCart);
    }, []);

    useEffect(() => {
        // Save cart to localStorage whenever productQuantity changes
        if (productQuantity.length > 0) {
            localStorage.setItem("cart", JSON.stringify(productQuantity));
        }
    }, [productQuantity]);

    const scrollToCategory = (index) => {
        const targetRef = categoryRefs.current[index];
        if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setActiveIndex(parseInt(index));
    };

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
    };

    const toggleSave = (productId) => {
        setSaveStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId], // Toggle save status
        }));
    };

    const updateQuantity = (product, action) => {
        setSelectedProduct(product);

        if (selectedProduct) {
            setProductQuantity((prev) => {
                const existingProduct = prev.find((item) => item.product_id === product.id);
                const newQuantity =
                    action === "increment"
                        ? existingProduct
                            ? existingProduct.count + 1
                            : 1  // Start count at 1 when adding a new product
                        : existingProduct
                            ? Math.max(1, existingProduct.count - 1)
                            : 1; // Ensure count doesn't go below 1

                if (existingProduct) {
                    return prev.map((item) =>
                        item.product_id === product.id
                            ? { ...item, count: newQuantity, price_product: selectedProduct.price }
                            : item
                    );
                }

                // Otherwise, add a new product to the cart
                return [
                    ...prev,
                    { product_id: product.id, count: newQuantity, price_product: selectedProduct.price },
                ];
            });
        }
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
                <Swiper className="product_slider" grabCursor={true} spaceBetween={20} slidesPerView={1.1}>
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
                    spaceBetween={0} // Remove space between slides
                    slidesPerView={2.5}
                    loop={false} // Loop slides for continuous scrolling
                    touchRatio={1} // Make it easier to swipe on mobile
                    resistanceRatio={0.5} // Adjust resistance on mobile
                    speed={600} // Speed of the slide transition
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update activeIndex when slide changes
                >
                    {category.map((cat, index) => (
                        <SwiperSlide
                            key={index}
                            className={activeIndex === index ? "active" : ""}
                            onClick={() => scrollToCategory(index)} // When clicked, scroll to category
                        >
                            <LocalGroceryStoreRoundedIcon />
                            {cat.category_name}
                        </SwiperSlide>
                    ))}
                </Swiper>

            </div>

            <div className="category_section container">
                {category
                    .filter((cat) => product.some((product) => product.category_id === cat.id.toString()))
                    .map((cat, index) => (
                        <div key={index} className="category_block" ref={(el) => (categoryRefs.current[index] = el)}>
                            <h2 className="category_title">
                                <LocalGroceryStoreRoundedIcon />
                                {cat.category_name}
                            </h2>
                            <div className="product_row">
                                {product
                                    .filter((product) => product.category_id === cat.id.toString())
                                    .map((product) => (
                                        <div
                                            key={product.id}
                                            className="shop_product_card"
                                            onClick={() => updateQuantity(product, "increment")}
                                        >
                                            {productQuantity.some((item) => item.product_id === product.id) && (
                                                <p className={"shop_product_count"}>
                                                    {productQuantity.find((item) => item.product_id === product.id).count}
                                                </p>
                                            )}
                                            <img src={infoIcon} onClick={() => openModal(product)} className={"product_info_icon"} />
                                            <img src={product?.img_url} alt="" />
                                            <div className="shop_product_text">
                                                <h3>{product.name}</h3>
                                                <div className="product_count">300 sa</div>
                                                <p className="product_price">{numberFormatter(product.price)} so'm</p>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))}
            </div>

            {/* Modal */}
            {modalOpen && selectedProduct && (
                <div className={"shop_modal open"}>
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
                            <FavoriteIcon/>
                        </button>

                        <div className="modal_buy">
                            <div className="modal_calc">
                                <button
                                    onClick={() => updateQuantity(selectedProduct, "decrement")}
                                >
                                    -
                                </button>
                                {productQuantity.some((item) => item.product_id === selectedProduct.id) && (
                                    <p className={""}>
                                        {productQuantity.find((item) => item.product_id === selectedProduct.id).count}
                                    </p>
                                )}
                                <button
                                    onClick={() => updateQuantity(selectedProduct, "increment")}
                                >
                                    +
                                </button>
                            </div>
                            <button className="modal_buy_btn">Savatga qo'shish</button>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default ShopPage;
