import React from 'react';
import styles from "./style.module.scss";
import StuffUnit from '../stuffUnit/index.jsx';

const Modal = ({ isOpen, onClose, modalItems, handleDeleteFromModal }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose}>×</button>
                {modalItems && modalItems.length > 0 ? (
                    <ul className={styles.spisok}>
                        {modalItems.map((item, index) => (
                            <StuffUnit
                                key={index}
                                item={item}
                                onDelete={() => handleDeleteFromModal(item._id)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p>Нет добавленных товаров</p>
                )}
            </div>
        </div>
    );
};

export default Modal;