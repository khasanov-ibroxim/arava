import React, {useState, useRef, useEffect} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import {Link, useParams} from "react-router-dom";
import {USER_HOME} from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {productByShopStore, shopBannerStore, shopCategoryStore, shopSingleStore} from "../../../zustand/shopStore.jsx";
import {SingleCartStore} from "../../../zustand/cartsStore.jsx"; // Import the Zustand store
import infoIcon from "../../../assets/icons/info.png";
import banner from "../../../assets/img/Group 18.svg";

const ShopPage = () => {
    const {user_id, language, shop_id} = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [productQuantity, setProductQuantity] = useState([]);

    const {data_banner, getBanner} = shopBannerStore();
    const {getSingleShop, data_shop} = shopSingleStore();
    const {getProductByShop, data_product} = productByShopStore();
    const {getCategory, data_category} = shopCategoryStore();
    const {createSingleCart, getSingleCartState, single_cart_data} = SingleCartStore(); // Use Zustand actions

    useEffect(() => {
        // Fetch necessary data when shop_id is updated
        getBanner(shop_id);
        getSingleShop(shop_id);
        getProductByShop(shop_id);
        getCategory(shop_id);
    }, [shop_id]);

    useEffect(() => {
        // Fetch cart data on product quantity or shop_id change
        if (user_id && shop_id) {
            saveToCart()
            getSingleCartState(shop_id, user_id);
        }
    }, [productQuantity, shop_id, user_id]);

    const scrollToCategory = (index) => {
        const targetRef = categoryRefs.current[index];
        if (targetRef) {
            targetRef.scrollIntoView({behavior: "smooth", block: "start"});
        }
        setActiveIndex(index);
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
            [productId]: !prev[productId],
        }));
    };

    const updateQuantity = (product, action) => {
        setProductQuantity((prev) => {
            const existingProduct = prev.find((item) => item.product_id === product.id);
            const newQuantity =
                action === "increment"
                    ? existingProduct
                        ? existingProduct.count + 1
                        : 1
                    : existingProduct && existingProduct.count > 1
                        ? existingProduct.count - 1
                        : 1;

            if (existingProduct) {
                return prev.map((item) =>
                    item.product_id === product.id
                        ? {...item, count: newQuantity}
                        : item
                );
            }

            return [
                ...prev,
                {product_id: product.id, count: newQuantity},
            ];
        });

    };

    const saveToCart = async () => {
        try {
            if (productQuantity.length === 0) {
                console.warn("No items to add to cart.");
                return;
            }

            // Handle saving each cart item
            for (const item of productQuantity) {
                await createSingleCart(shop_id, item.product_id, item.count, user_id);
            }
        } catch (error) {
            console.error("Failed to save cart:", error);
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
                    <ChevronLeftIcon/>
                </Link>
                <h1 className="shop_name">{data_shop?.shop?.name}</h1>
            </div>

            <div className="shop_banner container">
                {data_banner.length > 0 && (
                    <Swiper className="product_slider" grabCursor={true} spaceBetween={20} slidesPerView={1.1}>
                        {data_banner.map((item, index) => (
                            <SwiperSlide key={index}>
                                <img src={banner} alt="Banner"/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}

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
                    >
                        {data_category.map((cat, index) => (
                            <SwiperSlide
                                key={index}
                                className={activeIndex === index ? "active" : ""}
                                onClick={() => scrollToCategory(index)}
                            >
                                {cat.name}
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            <div className="category_section container">
                {data_product?.map((categoryData, categoryIndex) => (
                    <div
                        key={categoryData.category.id}
                        ref={(el) => (categoryRefs.current[categoryIndex] = el)}
                        className="category_block"
                    >
                        <h2 className="category_title">
                            <LocalGroceryStoreRoundedIcon/>
                            {categoryData.category.name}
                        </h2>
                        <div className="product_row">
                            {categoryData.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="shop_product_card"
                                    onClick={() => updateQuantity(product, "increment")}
                                >
                                    {single_cart_data?.carts && single_cart_data.carts.some((item) => item.product_id === product.id) && (
                                        <>
                                            <p className="shop_product_count">
                                                {
                                                    single_cart_data.carts.find(
                                                        (item) => item.product_id === product.id
                                                    )?.count || ""
                                                }
                                            </p>
                                            <div className="shop_product_decrement"
                                                 onClick={() => updateQuantity(product, "decrement")}>
                                                -
                                            </div>
                                        </>

                                    )}

                                    <img src={"https://placehold.co/600x400"} alt={product.name}/>
                                    <img src={infoIcon} onClick={() => openModal(product)}
                                         className={"product_info_icon"} alt={product.name}/>
                                    <div className="shop_product_text">
                                        <h3>{product.name}</h3>
                                        <p className="product_price">{numberFormatter(product.one_price)} so'm</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {modalOpen && selectedProduct && (
                <div className="shop_modal open">
                    <div className="modal_content open">
                        <div className="modal_item">
                            <img src={selectedProduct.photo} alt={selectedProduct.name}/>
                            <h3>{selectedProduct.name}</h3>
                            <p>{numberFormatter(selectedProduct.one_price)} so'm</p>
                            <div className="modal_info">
                                <p>{selectedProduct.description}</p>
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
                                <button onClick={() => updateQuantity(selectedProduct, "decrement")}>-</button>
                                <p>
                                    {productQuantity.find((item) => item.product_id === selectedProduct.id)?.count || 0}
                                </p>
                                <button onClick={() => updateQuantity(selectedProduct, "increment")}>+</button>
                            </div>
                            <button className="modal_buy_btn" onClick={saveToCart}>
                                Savatga qo'shish
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {single_cart_data?.carts?.length > 0 && (<div className={"cart_single_shop"}>
              <h1>Buyurtmalaringiz {single_cart_data?.carts.length}</h1>
            </div>)}
        </section>
    );
};

export default ShopPage;
