import React, { useState, useRef } from "react";
import "./shop_page.css";

const ShopPage = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const modalRef = useRef(null);

    // Swipe uchun o'zgaruvchilar
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);

    const openModal = (product) => {
        setSelectedProduct(product);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedProduct(null);
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

    return (
        <section className="shop_page">
            {/* Product cards */}
            <div className="product_row">
                {[...Array(5)].map((_, index) => (
                    <div
                        key={index}
                        className="shop_product_card"
                        onClick={() =>
                            openModal({
                                img_url: "https://via.placeholder.com/150",
                                name: "Product " + (index + 1),
                                info: "This is a sample product description.",
                                price: "50000",
                            })
                        }
                    >
                        <img src="https://via.placeholder.com/150" alt="Product" />
                        <p>Product {index + 1}</p>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div
                    className="shop_modal"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <div className="modal_content" ref={modalRef}>
                        {selectedProduct && (
                            <>
                                <img
                                    src={selectedProduct.img_url}
                                    alt={selectedProduct.name}
                                />
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
