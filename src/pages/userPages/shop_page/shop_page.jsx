import React, {useState, useRef, useEffect, useCallback} from "react";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "./shop_page.css";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import {Link, useParams} from "react-router-dom";
import {USER_HOME, USER_SINGLE_BASKET_BAR} from "../../../utils/const.jsx";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {productByShopStore, shopBannerStore, shopCategoryStore, shopSingleStore} from "../../../zustand/shopStore.jsx";
import {useBasketStore} from "../../../zustand/basketStore.jsx";
import infoIcon from "../../../assets/icons/info.png";

const ShopPage = () => {
    const {user_id, language, shop_id} = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [localQuantities, setLocalQuantities] = useState({});
    const [pendingUpdates, setPendingUpdates] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const updateTimeoutRef = useRef(null);

    const {data_banner, getBanner} = shopBannerStore();
    const {getSingleShop, data_shop} = shopSingleStore();
    const {
        getSingleBasket,
        single_basket_data,
        getTotalSum,
        total_sum,
        getProductsForCart,
        single_basket_products,
        updateProductQuantity,
        deleteCartProduct,
        createSingleCart
    } = useBasketStore();
    const {getCategory, data_category} = shopCategoryStore();

    const fetchShopData = useCallback(() => {
        if (shop_id) {
            getBanner(shop_id);
            getSingleShop(shop_id);
            getCategory(shop_id);
        }
    }, [shop_id, getBanner, getSingleShop, getCategory]);

    useEffect(() => {
        if (shop_id) {
            Promise.all([
                getSingleBasket(user_id, shop_id),
                getProductsForCart(shop_id),
                getTotalSum(user_id, shop_id)
            ]);
        }
    }, [shop_id, user_id, getSingleBasket, getProductsForCart, getTotalSum]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

    useEffect(() => {
        if (single_basket_data?.carts) {
            const quantities = {};
            single_basket_data.carts.forEach(cart => {
                quantities[cart.product_id] = cart.count;
            });
            setLocalQuantities(quantities);
        }
    }, [single_basket_data]);

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

    const onToggleStart = useCallback((productId, newCount) => {
        setLocalQuantities(prev => ({
            ...prev,
            [productId]: newCount
        }));

        setPendingUpdates(prev => ({
            ...prev,
            [productId]: newCount
        }));
    }, []);

    const onToggleEnd = useCallback(() => {
        if (isUpdating) return;
        if (updateTimeoutRef.current) {
            clearTimeout(updateTimeoutRef.current);
        }

        updateTimeoutRef.current = setTimeout(async () => {
            setIsUpdating(true);
            const updates = Object.entries(pendingUpdates);

            for (const [productId, newCount] of updates) {
                const existingProduct = single_basket_data?.carts?.find(
                    item => item.product_id === parseInt(productId)
                );

                try {
                    if (newCount === 0 && existingProduct) {
                        await deleteCartProduct(productId, user_id, existingProduct.id);
                    } else if (!existingProduct && newCount > 0) {
                        await createSingleCart(shop_id, productId, newCount, user_id);
                    } else if (existingProduct && newCount > 0) {
                        await updateProductQuantity(user_id, shop_id, existingProduct.id, newCount);
                    }
                } catch (error) {
                    console.error('Error updating product:', error);
                    setLocalQuantities(prev => ({
                        ...prev,
                        [productId]: existingProduct?.count || 0
                    }));
                }
            }

            setPendingUpdates({});

            await Promise.all([
                getSingleBasket(user_id, shop_id),
                getTotalSum(user_id, shop_id)
            ]);

            setIsUpdating(false);
        }, 500);
    }, [
        pendingUpdates,
        single_basket_data,
        shop_id,
        user_id,
        deleteCartProduct,
        createSingleCart,
        updateProductQuantity,
        getSingleBasket,
        getTotalSum,
        isUpdating
    ]);

    const handleQuantityUpdate = useCallback((productId, countChange) => {
        const newCount = countChange;
        onToggleStart(productId, newCount);
        onToggleEnd();
    }, [onToggleStart, onToggleEnd]);

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
                    <ChevronLeftIcon/>
                </Link>
                <h1 className="shop_name">{data_shop?.shop?.name}</h1>
            </div>

            <div className="shop_banner container">
                {data_banner.length > 0 && (
                    <Swiper className="product_slider" grabCursor={true} spaceBetween={20} slidesPerView={1.1}>
                        {data_banner.map((item, index) => (
                            <SwiperSlide key={index}>
                                <img src={`https://backend1.mussi.uz/${item.photo}`} alt="Banner"/>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                )}
            </div>

            {data_category.length > 0 && (
                <Swiper
                    className="btn-button shop_category"
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

            <div className="category_section container">
                {single_basket_products?.map((productGroup, categoryIndex) => (
                    <div
                        key={productGroup.category.id}
                        ref={(el) => (categoryRefs.current[categoryIndex] = el)}
                        className="category_block"
                    >
                        <h2 className="category_title">
                            <LocalGroceryStoreRoundedIcon/>
                            {productGroup.category.name}
                        </h2>
                        <div className="product_row">
                            {productGroup.products.map((product, index) => (
                                <div className={"shop_product_box"} key={index}>
                                    {localQuantities[product.id] > 0 && (
                                        <div className={"shop_product_box_absolute"}>
                                            <p className="shop_product_count">
                                                {localQuantities[product.id]}
                                            </p>
                                            <div
                                                className="shop_product_decrement"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleQuantityUpdate(product.id, localQuantities[product.id] - 1);
                                                }}
                                            >
                                                -
                                            </div>
                                        </div>
                                    )}
                                    <div
                                        className="shop_product_card"
                                        onClick={() => {
                                            const currentCount = localQuantities[product.id] || 0;
                                            handleQuantityUpdate(product.id, currentCount + 1);
                                        }}
                                    >
                                        <img src={`https://backend1.mussi.uz/${product.photo}`} alt={product.name}/>
                                        <img
                                            src={infoIcon}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                openModal(product);
                                            }}
                                            className={"product_info_icon"}
                                            alt={product.name}
                                        />
                                        <div className="shop_product_text">
                                            <h3>{product.name}</h3>
                                            <p className="product_price">{numberFormatter(product.one_price)} so'm</p>
                                        </div>
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
                            <img src={`https://backend1.mussi.uz/${selectedProduct.photo}`} alt={selectedProduct.name}/>
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