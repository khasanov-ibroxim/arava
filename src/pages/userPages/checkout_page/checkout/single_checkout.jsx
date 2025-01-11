import React, {useCallback, useEffect, useState} from 'react';
import {
    SHOP_PAGE, USER_CHECKOUT_ORDER,
    USER_HOME,
    USER_LOCATION,
    USER_SINGLE_BASKET_BAR,
} from "../../../../utils/const.jsx";
import Back_button from "../../../../component/back_button/back_button.jsx";
import "./sinlgle_checkout.css";
import {Swiper, SwiperSlide} from "swiper/react";
import {EffectCoverflow, Pagination} from 'swiper/modules';
import nal from "../../../../assets/img/nal.png";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {Input, message} from "antd";
import {userLocationStore, userStore} from "../../../../zustand/userStore.jsx";
import {Link, useNavigate, useParams} from "react-router-dom";
import {checkoutStore} from "../../../../zustand/checkoutStore.jsx";
import {useBasketStore} from "../../../../zustand/basketStore.jsx";

function SingleCheckout(props) {
    const {user_id, language, shop_id} = useParams();
    const [activeIndex, setActiveIndex] = useState(0);
    const [selectedPaymentId, setSelectedPaymentId] = useState(1); // Tanlangan to'lov turi ID
    const {getLocation, address} = userLocationStore();
    const {data} = userStore();
    const [initialState, setInitialState] = useState(data);
    const {getPaymentMethod, paymentMethod, createOrder} = checkoutStore();
    const {getSingleBasket, single_basket_data, getTotalSum, total_sum} = useBasketStore();
    const navigate = useNavigate();

    const fetchData = async () => {
        try {
            if (address.length === 0) await getLocation();
            if (single_basket_data?.length === 0 || single_basket_data === null) await getSingleBasket(user_id, shop_id);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        fetchData();
        getPaymentMethod();
        getTotalSum(user_id, shop_id);
    }, []);

    const handleSlideChange = (swiper) => {
        setActiveIndex(swiper.activeIndex);
        setSelectedPaymentId(paymentMethod[swiper.activeIndex]?.id); // Tanlangan ID ni saqlaymiz
    };

    const formatPhoneNumber = (value) => {
        const formattedValue = value.replace(/\D/g, '');
        let formattedNumber = '+998';
        if (formattedValue.length > 3) formattedNumber += ' ' + formattedValue.substring(3, 5);
        if (formattedValue.length > 5) formattedNumber += ' ' + formattedValue.substring(5, 8);
        if (formattedValue.length > 8) formattedNumber += ' ' + formattedValue.substring(8, 10);
        if (formattedValue.length > 10) formattedNumber += ' ' + formattedValue.substring(10, 12);
        return formattedNumber;
    };

    const numberFormatter = useCallback((number) => {
        if (number == null) return "0";
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }, []);

    const handleCreateOrder = () => {
        if (!initialState?.first_name?.trim()) {
            message.error("Ismingizni kiriting");
            return;
        }
        if (!initialState?.contact?.trim()) {
            message.error("Telefon raqamingizni kiriting");
            return;
        }
        if (!initialState?.address?.trim()) {
            message.error("Manzilingizni kiriting");
            return;
        }

        createOrder(
            user_id,
            shop_id,
            selectedPaymentId,
            initialState.first_name,
            initialState.contact,
            initialState?.address
        ).then((r) => {
            if (r){
                message.success("Buyurtma muvaffaqiyatli yuborildi");
                navigate(USER_CHECKOUT_ORDER.replace(":shop_id", shop_id)
                    .replace(":user_id", user_id)
                    .replace(":language", language)
                    .replace(":order_id", r.order.id)
                )
            }
            console.log(r)

        }).catch(() => {
            message.error("Buyurtma yuborishda xatolik yuz berdi");
        });
    };

    return (
        <div className={"single_checkout"}>
            <Back_button url={USER_SINGLE_BASKET_BAR} title={"Checkout"}/>
            <section className={"container"}>
                <div className="checkout_payment_method_box">
                    <div className="checkout_title">
                        <h1>To'lov turi</h1>
                        <p>To'lov turini tanlang</p>
                    </div>
                    <Swiper
                        className="product_slider"
                        grabCursor={true}
                        spaceBetween={10}
                        slidesPerView={1.15}
                        onSlideChange={handleSlideChange}
                        initialSlide={0}
                    >
                        {paymentMethod.map((item, index) => (
                            <SwiperSlide
                                key={index}
                                className={`checkout_payment_method_item ${activeIndex === index ? 'active' : ''}`}
                            >
                                <div className="checkout_payment_method_item_content">
                                    {activeIndex === index && (
                                        <div className="checkmark">
                                            <CheckCircleIcon/>
                                        </div>
                                    )}
                                    <h1>{item.name}</h1>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className="checkout_input_section">
                    <div className="checkout_title">
                        <h1>Buyurtmachining ma'lumotlari</h1>
                    </div>

                    <div className="checkout_input_box" style={{marginTop: 5}}>
                        <p>F.I.O</p>
                        <Input
                            type="text"
                            value={initialState?.first_name}
                            onChange={(e) => setInitialState({...initialState, first_name: e.target.value})}
                        />
                    </div>
                    <div className="checkout_input_box">
                        <p>Telefon raqamingiz</p>
                        <Input
                            type="text"
                            value={formatPhoneNumber(initialState?.contact)}
                            onChange={(e) =>
                                setInitialState({...initialState, contact: formatPhoneNumber(e.target.value)})
                            }
                        />
                    </div>
                    <div className="personal_user_item checkout_title">
                        <h1>Manzilingiz :</h1>
                        <p>{address ? address : "Manzilingiz topilmadi"}</p>
                        <Link
                            type="primary"
                            to={USER_LOCATION.replace(":user_id", user_id).replace(":language", language)}
                        >
                            Manzilni o'zgartirish
                        </Link>
                    </div>
                    <div className="checkout_input_box">
                        <p>Manzilingiz haqida to'liqroq ma'lumot bering</p>
                        <Input.TextArea
                            placeholder={"Mo'ljal, Uy, Xonadon, Mahalla, Qavat"}
                            autoSize={{minRows: 3, maxRows: 5}}
                            type="text"
                            value={initialState?.address}
                            onChange={(e) =>
                                setInitialState({...initialState, address: e.target.value})
                            }
                        />
                    </div>
                </div>
                <div className="checkout_input_section">
                    <div className="checkout_title">
                        <h1>Buyurtma ma'lumoti</h1>
                    </div>

                    <div className="checkout_check_box" style={{marginTop: 5}}>
                        <p>Mahsulotlar miqdori</p>
                        <p>{single_basket_data?.carts.length} ta</p>
                    </div>
                    <div className="checkout_check_box" style={{marginTop: 5}}>
                        <p>To'lov turi</p>
                        <p>  {paymentMethod.find(item => item.id === selectedPaymentId)?.name || 'To\'lov turi tanlanmagan'}</p>
                    </div>
                    <div className="checkout_check_box" style={{marginTop: 5}}>
                        <p>Jami</p>
                        <h1>{numberFormatter(total_sum)} so'm</h1>
                    </div>
                    <div className="checkout_check_box" style={{marginTop: 15}}>
                        <button onClick={handleCreateOrder}>
                            Buyurtma berish
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default SingleCheckout;
