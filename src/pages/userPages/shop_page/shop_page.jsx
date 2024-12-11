import React, { useState, useRef, useEffect, useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import { Link, useParams } from "react-router-dom";
import { USER_HOME, USER_SINGLE_BASKET_BAR } from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { productByShopStore, shopBannerStore, shopCategoryStore, shopSingleStore } from "../../../zustand/shopStore.jsx";
import { useBasketStore } from "../../../zustand/basketStore.jsx";  // Using useBasketStore for cart
import infoIcon from "../../../assets/icons/info.png";
import banner from "../../../assets/img/Group 18.svg";

const ShopPage = () => {
    const { user_id, language, shop_id } = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [quantity, setQuantity] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    const { data_banner, getBanner } = shopBannerStore();
    const { getSingleShop, data_shop } = shopSingleStore();
    const {
        getSingleBasket,
        single_basket_data,
        getTotalSum,
        total_sum,
        getProductsForCart,
        single_basket_products,
        updateProductQuantity,
        createSingleCart
    } = useBasketStore(); // Using useBasketStore for cart data and actions
    const { getCategory, data_category } = shopCategoryStore();

    const fetchShopData = useCallback(() => {
        if (shop_id) {
            getBanner(shop_id);
            getSingleShop(shop_id);
            getCategory(shop_id);
        }
    }, [shop_id, getBanner, getSingleShop, getCategory]);

    useEffect(() => {
        if (shop_id) {
            Promise.all([getSingleBasket(user_id, shop_id), getProductsForCart(shop_id), getTotalSum(user_id, shop_id)]);
        }
    }, [shop_id, user_id]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    const scrollToCategory = useCallback((index) => {
        const targetRef = categoryRefs.current[index];
        if (targetRef) {
            targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
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

    const updateQuantity = useCallback(
        async (productId, countChange) => {
            if (isUpdating || countChange === 0) return; // Prevent updates if already updating or no change

            setIsUpdating(true);

            // Find the product in the cart
            const existingProduct = single_basket_data?.carts?.find(
                (item) => item.product_id === productId
            );

            if (!existingProduct) {
                // If the product is not in the cart, create a new cart entry with a count of 1
                await createSingleCart(shop_id, productId, 1, user_id);
            } else {
                if(countChange === "decrement") return;
                const updatedCount = Math.max(existingProduct.count + countChange, 1); // Ensure at least 1 item in the cart

                try {
                    // If the product exists, update the cart quantity
                    await updateProductQuantity(user_id, shop_id, productId, updatedCount);

                    // Optimistically update the UI with the new quantity
                    setQuantity((prevQuantity) => ({
                        ...prevQuantity,
                        [productId]: updatedCount,
                    }));
                } catch (err) {
                    console.error("Error updating quantity", err);
                }
            }

            setIsUpdating(false); // Reset the updating state after the operation is complete
        },
        [updateProductQuantity, user_id, shop_id, single_basket_data, isUpdating]
    );


    const numberFormatter = useCallback(
        (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        []
    );

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
                                <img src={banner} alt="Banner" />
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
                {single_basket_products?.map((productGroup, categoryIndex) => (
                    <div
                        key={productGroup.category.id}
                        ref={(el) => (categoryRefs.current[categoryIndex] = el)}
                        className="category_block"
                    >
                        <h2 className="category_title">
                            <LocalGroceryStoreRoundedIcon />
                            {productGroup.category.name}
                        </h2>
                        <div className="product_row">
                            {productGroup.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="shop_product_card"
                                    onClick={() => updateQuantity(product.id, 1)}  // Increase quantity by 1
                                >
                                    {single_basket_data?.carts &&
                                        single_basket_data.carts.some((item) => item.product_id === product.id) && (
                                            <>
                                                <p className="shop_product_count">
                                                    {
                                                        single_basket_data.carts.find(
                                                            (item) => item.product_id === product.id
                                                        )?.count || ""
                                                    }
                                                </p>
                                                <div
                                                    className="shop_product_decrement"
                                                    onClick={() => {
                                                        // Find the current cart item
                                                        const cartItem = single_basket_data.carts.find(
                                                            (item) => item.product_id === product.id
                                                        );
                                                        // Check if the item exists and if the quantity is greater than 1 before decrementing
                                                        if (cartItem && cartItem.count > 1) {
                                                            // Call updateQuantity function to decrement the quantity
                                                            updateQuantity(product.id, cartItem.count - 1);
                                                        }
                                                    }}
                                                >
                                                    -
                                                </div>
                                            </>
                                        )
                                    }


                                    <img src={"https://placehold.co/600x400"} alt={product.name} />
                                    <img
                                        src={infoIcon}
                                        onClick={() => openModal(product)}
                                        className={"product_info_icon"}
                                        alt={product.name}
                                    />
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
                            <img src={selectedProduct.photo} alt={selectedProduct.name} />
                            <h3>{selectedProduct.name}</h3>
                            <p>{numberFormatter(selectedProduct.one_price)} so'm</p>
                            <div className="modal_info">
                                <p>{selectedProduct.description}</p>
                            </div>
                        </div>
                        <button onClick={closeModal} className="modal_close">
                            <CloseIcon />
                        </button>
                        <button
                            onClick={() => toggleSave(selectedProduct.id)}
                            className={`modal_save ${saveStatus[selectedProduct.id] ? "saved" : ""}`}
                        >
                            <FavoriteIcon />
                        </button>
                    </div>
                </div>
            )}

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
