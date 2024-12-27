import React, {useCallback, useEffect, useRef, useState} from "react";
import {useBasketStore} from "../../zustand/basketStore";
import {useParams} from "react-router-dom";
import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import LocalGroceryStoreRoundedIcon from "@mui/icons-material/LocalGroceryStoreRounded";
import infoIcon from "../../assets/icons/info.png";
import CloseIcon from "@mui/icons-material/Close";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {userStore} from "../../zustand/userStore.jsx";

const CartItem = () => {
    const {user_id, shop_id} = useParams();
    const {
        getProductsForCart,
        single_basket_products,
        addToCart,
        single_basket_data,
        getSingleBasket,
        decrementCart
    } = useBasketStore();
    const {data} = userStore()
    const categoryRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [saveStatus, setSaveStatus] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    console.log(data.type)
    const scrollToCategory = useCallback((index) => {
        const targetRef = categoryRefs.current[index];
        if (targetRef) {
            targetRef.scrollIntoView({behavior: "auto", block: "start"});
        }
        setActiveIndex(index);
    }, [categoryRefs]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                await getProductsForCart(shop_id);
                await getSingleBasket(user_id, shop_id)
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };
        fetchProducts();
    }, [shop_id]);


    // Modal handlers
    const openModal = useCallback((product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    }, []);

    const closeModal = useCallback(() => {
        setModalOpen(false);
        setSelectedProduct(null);
    }, []);

    // Favorite toggle handler
    const toggleSave = useCallback((productId) => {
        setSaveStatus((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    }, []);

    // Number formatter utility
    const numberFormatter = useCallback(
        (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "),
        []
    );

    return (
        <>
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
                {single_basket_products &&
                    single_basket_products.map((cat, index) => (
                        <SwiperSlide
                            key={index}
                            ref={(el) => (categoryRefs.current[categoryIndex] = el)}
                            onClick={() => scrollToCategory(index)}
                            className={activeIndex === index ? "activeCategory" : ""}
                        >
                            {cat.category.name}
                        </SwiperSlide>
                    ))}
            </Swiper>

            <div className="category_section ">
                {single_basket_products?.map((productGroup, categoryIndex) => {
                    return (
                        <div
                            key={categoryIndex}
                            ref={(el) => (categoryRefs.current[categoryIndex] = el)}
                            className="category_block"
                        >
                            {productGroup.products.length > 0 &&
                                <h2 className="category_title">
                                    <LocalGroceryStoreRoundedIcon/>
                                    {productGroup.category.name}
                                </h2>
                            }

                            <div className="product_row">
                                {productGroup.products.map((product, index) => {
                                    const existingProduct = single_basket_data?.carts?.find(
                                        item => item.product_id === parseInt(product.id)
                                    );
                                    return (
                                        <div className={"shop_product_box"} key={index}>

                                            {existingProduct &&
                                                <div className={"shop_product_box_absolute"}>
                                                    <p className="shop_product_count">
                                                        {existingProduct?.count}
                                                    </p>
                                                    <div
                                                        className="shop_product_decrement"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (existingProduct.count > 0)
                                                                decrementCart(user_id, shop_id, product.id, existingProduct, existingProduct.count - 1);
                                                        }}
                                                    >
                                                        -
                                                    </div>
                                                </div>
                                            }

                                            <div
                                                className="shop_product_card"
                                                onClick={() => addToCart(user_id, shop_id, product.id, existingProduct ? existingProduct.count + 1 : 1, "add")}
                                            >
                                                <img src={`https://backend1.mussi.uz/${product.photo}`}
                                                     alt={product.name}/>
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
                                                    <p className="product_price">
                                                        {data.type === "one" && <>{numberFormatter(product.one_price)} so'm</>}
                                                        {data.type === "optom" && <>{numberFormatter(product.optom_price)} so'm</>}
                                                        {data.type === "restorator" && <>{numberFormatter(product.restorator_price)} so'm</>}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}
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
        </>
    );
};

export default CartItem;
