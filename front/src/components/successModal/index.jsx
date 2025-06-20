import React from 'react';
import Modal from 'react-modal';
import styles from "./style.module.scss";

const SuccessModal = ({ isOpen, onRequestClose }) => {
    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="Success Modal"
            className={styles.modal}
            overlayClassName={styles.overlay}
        >
            <div className={styles.checkmarkContainer}>
                <div className={styles.checkmark}>
                    <svg
                        className={styles.checkmarkSvg}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 52 52"
                    >
                        <circle
                            className={styles.checkmarkCircle}
                            cx="26"
                            cy="26"
                            r="25"
                            fill="none"
                        />
                        <path
                            className={styles.checkmarkCheck}
                            fill="none"
                            d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        />
                    </svg>
                </div>
                <p className={styles.message}>
                    Ваш заказ принят, наши модераторы уже получили ваше письмо и совсем скоро вам ответят!
                </p>
            </div>
        </Modal>
    );
};

export default SuccessModal;