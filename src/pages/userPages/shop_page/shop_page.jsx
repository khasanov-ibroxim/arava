import React, {useState, useRef, useEffect, useCallback, useMemo} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import {Link, useParams} from "react-router-dom";
import {USER_HOME, USER_SINGLE_BASKET_BAR} from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
    productByShopStore,
    shopBannerStore,
    shopCategoryStore,
    shopSingleStore
} from "../../../zustand/shopStore.jsx";
import {SingleCartStore} from "../../../zustand/cartsStore.jsx";
import infoIcon from "../../../assets/icons/info.png";
import banner from "../../../assets/img/Group 18.svg";

const ShopPage = () => {
    const {user_id, language, shop_id} = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});

    const {data_banner, getBanner} = shopBannerStore();
    const {getSingleShop, data_shop} = shopSingleStore();
    const {getProductByShop, data_product} = productByShopStore();
    const {getCategory, data_category} = shopCategoryStore();
    const {
        createSingleCart,
        getSingleCartState,
        resetCartState,
        single_cart_data,
        updateSingleCart
    } = SingleCartStore();

    const fetchShopData = useCallback(() => {
        if (shop_id) {
            getBanner(shop_id);
            getSingleShop(shop_id);
            getProductByShop(shop_id);
            getCategory(shop_id);
        }
    }, [shop_id, getBanner, getSingleShop, getProductByShop, getCategory]);

    const fetchCartData = useCallback(() => {
        if (user_id && shop_id) {
            getSingleCartState(shop_id, user_id);
        }
    }, [user_id, shop_id, getSingleCartState]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    useEffect(() => {
        fetchCartData();
    }, [fetchCartData]);

    const scrollToCategory = useCallback((index) => {
        const targetRef = categoryRefs.current[index];
        if (targetRef) {
            targetRef.scrollIntoView({behavior: "smooth", block: "start"});
        }
        setActiveIndex(index);
    }, []);

    const openModal = useCallback((product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setSelectedProduct(null);
    }, []);

    const toggleSave = useCallback((productId) => {
        setSaveStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    }, []);

    const updateQuantity = useCallback(async (product, action) => {
        const cartItem = single_cart_data?.carts?.find((item) => item.product_id === product.id);
        const currentQuantity = cartItem?.count || 0;
        const newQuantity = action === "increment" ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);

        try {
            if (cartItem) {
                await updateSingleCart(newQuantity, user_id, product.id);
            } else {
                await createSingleCart(shop_id, product.id, 1, user_id);
            }

            fetchCartData();
            resetCartState();
        } catch (error) {
            console.error("Failed to update cart:", error);
        }
    }, [
        single_cart_data,
        user_id,
        shop_id,
        updateSingleCart,
        createSingleCart,
        fetchCartData,
        resetCartState
    ]);

    const numberFormatter = useCallback((number) =>
            number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        []);

    const cartItemCount = useMemo(() =>
            single_cart_data?.carts?.length || 0,
        [single_cart_data]);

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
                    </div>
                </div>
            )}

            {single_cart_data?.carts?.length > 0 && (
                <Link className={"cart_single_shop"}
                      to={USER_SINGLE_BASKET_BAR.replace(":user_id", user_id)
                          .replace(":language", language)
                          .replace(":shop_id", shop_id)}>
                    <h1>Buyurtmalaringiz {single_cart_data?.carts.length}</h1>
                </Link>)}
        </section>
    );
};

export default React.memo(ShopPage);