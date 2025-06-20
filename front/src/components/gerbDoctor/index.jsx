import React, { useState, useEffect } from 'react';
import Header from "../header/index.jsx";
import Footer from "../footer/index.jsx";
import Modal from "../modal/index.jsx";
import styles from "./style.module.scss";

// Базовый URL вашего бэкенда
const API_BASE_URL = 'http://localhost:5000/api';

const GerbDoctor = () => {
    const [quality, setQuality] = useState(1);
    const [price, setPrice] = useState(900.00); // Общая цена (клише + оснастка) * количество
    const [unitStampPrice, setUnitStampPrice] = useState(900.00); // Цена за 1 клише
    const [osnastkiPrice, setOsnastkiPrice] = useState(0.00); // Цена выбранной оснастки
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]); // Товары, добавленные в модальное окно
    const [selectedOsnastkaArtikul, setSelectedOsnastkaArtikul] = useState('');

    // **ВНИМАНИЕ:** В будущем, `osnastki` должны загружаться с бэкенда,
    // точно так же, как и основное клише "Для врачей".
    // Пока для быстрого запуска они остаются статичными, но убедитесь,
    // что их `artikul` и `price` соответствуют тому, что есть в вашей БД `Goods`.
    const osnastki = [
        { id: 'professional1', name: 'Professional 1', price: 900, artikul: 'proffesionalOsn', imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø30' },
        { id: 'printy1', name: 'Printy 1', price: 500, artikul: 'printyOsn', imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg', size: 'Ø30' },
        { id: 'ideal1', name: 'Ideal 1', price: 300, artikul: 'idealOsn', imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg', size: 'Ø30' },
        { id: 'none', name: 'Очистить', price: 0, artikul: 'noOsnastka' }
    ];

    // Артикул для самой печати "Для врачей".
    // Этот артикул ДОЛЖЕН СУЩЕСТВОВАТЬ В ВАШЕЙ БД `Goods`!
    const doctorStampArtikul = 'gerbDoctor';

    const minQuality = 1;
    const maxQuality = 1000;

    useEffect(() => {
        // Обновляем общую цену при изменении количества, цены клише или цены оснастки
        const newPrice = (unitStampPrice + osnastkiPrice) * quality;
        setPrice(newPrice);
    }, [quality, unitStampPrice, osnastkiPrice]);

    const updateQuality = (newQuality) => {
        if (newQuality < minQuality) {
            newQuality = minQuality;
        } else if (newQuality > maxQuality) {
            newQuality = maxQuality;
        }
        setQuality(newQuality);
    };

    const handleButtonClick = (price, artikul) => {
        if (artikul === 'noOsnastka') {
            setSelectedOsnastkaArtikul('');
            setOsnastkiPrice(0);
        } else {
            if (selectedOsnastkaArtikul === artikul) {
                setSelectedOsnastkaArtikul('');
                setOsnastkiPrice(0);
            } else {
                setOsnastkiPrice(price); // Просто устанавливаем новую цену оснастки
                setSelectedOsnastkaArtikul(artikul);
            }
        }
    };

    const handleMinusClick = () => {
        updateQuality(quality - 1);
    };

    const handlePlusClick = () => {
        updateQuality(quality + 1);
    };

    const handleAddToCart = async () => {
        try {
            let productsAddedToSession = []; // Товары, которые будут добавлены в текущую сессию для модалки

            // 1. Добавляем само клише (печать)
            const stampResponse = await fetch(`${API_BASE_URL}/add-to-cart`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ artikul: doctorStampArtikul, quantity: quality }),
            });

            if (!stampResponse.ok) {
                const errorData = await stampResponse.json();
                throw new Error(`Failed to add stamp: ${errorData.message}`);
            }
            const addedStamp = await stampResponse.json();
            productsAddedToSession.push(addedStamp);

            // 2. Если выбрана оснастка, добавляем и её
            if (selectedOsnastkaArtikul && selectedOsnastkaArtikul !== 'noOsnastka') {
                const osnastkaResponse = await fetch(`${API_BASE_URL}/add-to-cart`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ artikul: selectedOsnastkaArtikul, quantity: quality }),
                });

                if (!osnastkaResponse.ok) {
                    const errorData = await osnastkaResponse.json();
                    throw new Error(`Failed to add osnastka: ${errorData.message}`);
                }
                const addedOsnastka = await osnastkaResponse.json();
                productsAddedToSession.push(addedOsnastka);
            }

            // 3. Обновляем localStorage корзину
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
            productsAddedToSession.forEach(p => {
                const existingIndex = currentCart.findIndex(item => String(item._id) === String(p._id));
                if (existingIndex > -1) {
                    currentCart[existingIndex].quantity += p.quantity;
                } else {
                    currentCart.push(p);
                }
            });
            localStorage.setItem('cart', JSON.stringify(currentCart));

            // 4. Открываем модальное окно с добавленными товарами
            setModalItems(productsAddedToSession);
            setIsModalOpen(true);

        } catch (error) {
            console.error('Error adding product(s) to cart:', error);
            alert(`Ошибка при добавлении товара в корзину: ${error.message}. Пожалуйста, попробуйте еще раз.`);
        }
    };

    const handleDeleteFromModal = (itemId) => {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart = cart.filter(item => String(item._id) !== String(itemId)); // Сравниваем по строковому представлению ID
        localStorage.setItem('cart', JSON.stringify(cart));
        setModalItems(prevItems => prevItems.filter(item => String(item._id) !== String(itemId)));
        // Если после удаления в модальном окне не осталось товаров, закрыть его
        if (cart.length === 0) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.gerb1Page}>
            <Header />

            <main>
                <div className={styles.container}>
                    <img src={`${process.env.PUBLIC_URL}/resourses/pechati/doctor.jpg`} alt="Для врачей" />
                    <div className={styles.nazvanie}>
                        <h3>Для врачей</h3>
                        <h4>Во всех вариациях</h4>
                    </div>
                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>Ø25-30мм</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Клише печати</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Маслобензостойкая резина</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>
                            Печать врача — это небольшой круглый штамп, диаметром от 25 до 30 миллиметров, с обязательными данными: ФИО доктора и его специальность или надпись "врач". Изготавливается из маслобензостойкой резины методом лазерной гравировки, что обеспечивает долговечность и четкость надписей. Печать может быть оснащена автоматической, ручной или карманной оснасткой, что делает ее удобной для использования. Кроме того, печать должна сопровождаться дипломом об образовании, подтверждающим квалификацию доктора.
                        </p>
                        <br /> <h3>Выберите оснастку:</h3> <br />
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button id="minus" className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quality}</h3>
                        <button id="plus" className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>

                    <div className={styles.chooseOsnastka}>
                        {osnastki.map((osnastka) => (
                            <button
                                key={osnastka.id}
                                id={osnastka.id}
                                className={`${styles.chooseOsnastkaButton} ${selectedOsnastkaArtikul === osnastka.artikul ? styles.active : ''}`}
                                onClick={() => handleButtonClick(osnastka.price, osnastka.artikul)}
                            >
                                {osnastka.imgSrc && <img src={`${process.env.PUBLIC_URL}/${osnastka.imgSrc}`} alt={osnastka.name} />}
                                <p className={styles.osnastkaName}>{osnastka.name}</p>
                                {osnastka.price !== 0 && (
                                    <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                        {osnastka.price}р
                                    </figcaption>
                                )}
                                <p>{osnastka.size}</p>
                            </button>
                        ))}
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{price.toFixed(2)}р</div>
                    </div>

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} onClick={handleAddToCart}>Добавить в корзину</button>
                    </div>
                </div>

                <Footer />
            </main>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItems={modalItems}
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
}

export default GerbDoctor;