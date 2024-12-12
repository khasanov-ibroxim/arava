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
import {useBasketStore} from "../../../zustand/basketStore.jsx";  // Using useBasketStore for cart
import infoIcon from "../../../assets/icons/info.png";

const ShopPage = () => {
    const {user_id, language, shop_id} = useParams();
    const categoryRefs = useRef([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [activeIndex, setActiveIndex] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [quantity, setQuantity] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

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
    } = useBasketStore(); // Using useBasketStore for cart data and actions
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
            Promise.all([getSingleBasket(user_id, shop_id), getProductsForCart(shop_id), getTotalSum(user_id, shop_id)]);
        }
    }, [shop_id, user_id]);

    useEffect(() => {
        fetchShopData();
    }, [fetchShopData]);

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

    const updateQuantity = useCallback(
        async (productId, countChange) => {
            if (isUpdating) return; // O'zgartirish jarayonida bloklash
            console.log(countChange)
            setIsUpdating(true);

            // Savatchadan mahsulotni topish
            const existingProduct = single_basket_data?.carts?.find(
                (item) => item.product_id === productId
            );

            if (countChange === 0 && existingProduct) {
                // Agar miqdor 0 bo'lsa va mahsulot mavjud bo'lsa, uni o'chirish
                try {
                    await deleteCartProduct(productId,user_id,existingProduct.id);
                } catch (err) {
                    console.error("Error deleting product:", err);
                }
            } else if (!existingProduct && countChange > 0) {
                // Agar mahsulot savatchada bo'lmasa, yangi mahsulot qo'shish
                try {
                    await createSingleCart(shop_id, productId, countChange, user_id);
                } catch (err) {
                    console.error("Error creating product:", err);
                }
            } else if (existingProduct) {
                // Mahsulot miqdorini yangilash
                try {
                    const newCount = countChange;
                    if (newCount <= 0) {
                        // Agar yangi miqdor 0 yoki undan past bo'lsa, o'chirish
                        await deleteCartProduct(productId,user_id,existingProduct.id );
                    } else {
                        await updateProductQuantity(user_id, shop_id, existingProduct.id, newCount);
                        setQuantity((prevQuantity) => ({
                            ...prevQuantity,
                            [productId]: newCount,
                        }));
                    }
                } catch (err) {
                    console.error("Error updating quantity:", err);
                }
            }

            setIsUpdating(false); // Jarayonni qayta tiklash
        },
        [
            deleteCartProduct,
            createSingleCart,
            updateProductQuantity,
            user_id,
            shop_id,
            single_basket_data,
            isUpdating
        ]
    );


    console.log(data_banner)

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
                            <LocalGroceryStoreRoundedIcon/>
                            {productGroup.category.name}
                        </h2>
                        <div className="product_row">
                            {productGroup.products.map((product , index) => (
                                <div className={"shop_product_box"} key={index}>
                                    {single_basket_data?.carts &&
                                        single_basket_data.carts.some((item) => item.product_id === product.id) && (
                                            <div className={"shop_product_box_absolute"}>
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

                                                        const cartItem = single_basket_data.carts.find(
                                                            (item) => item.product_id === product.id
                                                        );

                                                        if (cartItem) {

                                                            updateQuantity(product.id, cartItem.count - 1);
                                                        }
                                                    }}
                                                >
                                                    -
                                                </div>
                                            </div>
                                        )
                                    }
                                    <div
                                        key={product.id}
                                        className="shop_product_card"
                                        onClick={() => {
                                            const cartItem = single_basket_data.carts.find(
                                                (item) => item.product_id === product.id
                                            );

                                            if (cartItem) {
                                                updateQuantity(product.id, cartItem.count + 1);
                                            }else if (!cartItem) {
                                                updateQuantity(product.id, 1);
                                            }
                                        }}  // Increase quantity by 1
                                    >
                                        <img src={`https://backend1.mussi.uz/${product.photo}`} alt={product.name}/>
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
