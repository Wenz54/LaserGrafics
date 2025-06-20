import React, { useState, useEffect } from 'react';
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

const RightSide = ({ cart, onOrderClick }) => {
    const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);
    const totalAmount = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

    const handleOrderClick = (event) => {
        if (cart.length === 0) {
            event.preventDefault();
            setShowEmptyCartMessage(true);
        } else {
            setShowEmptyCartMessage(false);
            onOrderClick();
        }
    };

    return (
        <div className={styles.check}>
            <Link to="/orderPage" className={styles.plate} onClick={handleOrderClick}>
                <button className={`${styles.oformit} ${cart.length === 0 ? styles.disabled : ''}`} disabled={cart.length === 0}>
                    Оформить заказ
                </button>
            </Link>
            {showEmptyCartMessage && (
                <div className={styles.emptyCartMessage}>
                    Сначала добавьте что-то в корзину!
                </div>
            )}
            <div className={styles.frstRow}>
                <h3>{cart.length}</h3>
                <p> Товаров</p>
            </div>
            <div className={styles.scndRow}>
                <h3>На сумму:</h3>
                <p>{totalAmount.toFixed(2)}</p>
                <h3>руб.</h3>
            </div>
        </div>
    );
}

export default RightSide;