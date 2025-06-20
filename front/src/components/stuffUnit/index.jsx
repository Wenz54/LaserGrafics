import React from 'react';
import styles from "./style.module.scss";

const StuffUnit = ({ item, onDelete, onQuantityChange }) => {
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value, 10);
        if (newQuantity > 0) {
            onQuantityChange(item, newQuantity);
        }
    };

    return (
        <div className={styles.stuffUnit}>
            <img src={item.imageUrl} alt={item.name} className={styles.image} />
            <div className={styles.nameAndDesc}>
                <h2>{item.name}</h2>
                <p>{item.description}</p>
            </div>
            <div className={styles.actions}>
                <button className={styles.deleteBtn} onClick={onDelete}>Удалить</button>
                <div className={styles.count}>
                    <input
                        type="number"
                        className={styles.countInput}
                        min="1"
                        value={item.quantity}
                        onChange={handleQuantityChange}
                    />
                </div>
                <h3 className={styles.price}>{item.price * item.quantity}p</h3>
            </div>
        </div>
    );
};

export default StuffUnit;