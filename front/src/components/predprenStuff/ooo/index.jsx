import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx";
import styles from "./style.module.scss";

const Ooo = () => {
    // Состояния для управления количеством, ценами и выбором
    const [quantity, setQuantity] = useState(1); // Используем только quantity
    const [unitPrice, setUnitPrice] = useState(900.00); // Базовая цена клише для ООО
    const [osnastkiPrice, setOsnastkiPrice] = useState(0.00); // Цена выбранной оснастки
    const [totalPrice, setTotalPrice] = useState(0); // Общая цена (будет рассчитана в useEffect)

    const [uploadMessage, setUploadMessage] = useState(''); // Для сообщений о загрузке файла
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна корзины
    const [modalItems, setModalItems] = useState([]); // Элементы для отображения в модальном окне (массив)

    const [selectedArtikul, setSelectedArtikul] = useState('oooBase'); // Артикул самой печати (базовый для ООО)
    const [selectedOsnastkaArtikul, setSelectedOsnastkaArtikul] = useState(''); // Артикул выбранной оснастки
    const [selectedStampType, setSelectedStampType] = useState(''); // Артикул выбранного типа защиты/размера

    const minQuantity = 1;
    const maxQuantity = 1000;

    // Данные об оснастках (аналогично Business.jsx)
    const osnastki = [
        { id: 'osn_professional1', name: 'Professional 1', price: 900, artikul: 'proffesionalOsn', imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø45' },
        { id: 'osn_printy1', name: 'Printy 1', price: 500, artikul: 'printyOsn', imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg', size: 'Ø45' },
        { id: 'osn_ideal1', name: 'Ideal 1', price: 300, artikul: 'idealOsn', imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg', size: 'Ø42' },
        { id: 'osn_none', name: 'Очистить', price: 0, artikul: '' }
    ];

    // Данные о типах штампов (я изменил названия для ясности, предположим это разные размеры или особенности для ООО)
    const stampTypes = [
        { id: 'ooo_type1', name: 'Тип 1 (Ø42мм)', price: 100, artikul: 'oooType1', imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg' },
        { id: 'ooo_type2', name: 'Тип 2 (Ø45мм)', price: 200, artikul: 'oooType2', imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg' },
        { id: 'ooo_type3', name: 'Тип 3 (Ø50мм)', price: 300, artikul: 'oooType3', imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg' },
        { id: 'ooo_usual', name: 'Обычная (Ø42мм)', price: 0, artikul: 'oooBase' },
    ];

    // Эффект для пересчета общей цены при изменении unitPrice, osnastkiPrice или quantity
    useEffect(() => {
        setTotalPrice((unitPrice + osnastkiPrice) * quantity);
    }, [unitPrice, osnastkiPrice, quantity]);

    // Обновление количества
    const updateQuantity = (newQuantity) => {
        if (newQuantity < minQuantity) {
            newQuantity = minQuantity;
        } else if (newQuantity > maxQuantity) {
            newQuantity = maxQuantity;
        }
        setQuantity(newQuantity);
    };

    // Обработчик клика по кнопке оснастки
    const handleOsnastkaButtonClick = (selectedPrice, selectedArtikulValue) => {
        if (selectedOsnastkaArtikul === selectedArtikulValue) {
            setOsnastkiPrice(0);
            setSelectedOsnastkaArtikul('');
        } else {
            if (selectedArtikulValue === '') { // Если выбрали "Очистить"
                setOsnastkiPrice(0);
                setSelectedOsnastkaArtikul('');
            } else {
                setOsnastkiPrice(selectedPrice);
                setSelectedOsnastkaArtikul(selectedArtikulValue);
            }
        }
    };

    // Обработчик выбора типа штампа (здесь "размера" или "особенности")
    const handleStampTypeClick = (selectedPrice, id, artikulValue) => {
        // Базовая цена для ООО может быть 900.00
        const baseOooPrice = 900.00;

        if (id === 'ooo_usual') { // Если выбрали "Обычная"
            setSelectedStampType('ooo_usual');
            setUnitPrice(baseOooPrice); // Сбрасываем на базовую цену для ООО
            setSelectedArtikul('oooBase'); // Сбрасываем на базовый артикул
        } else {
            setSelectedStampType(id);
            setUnitPrice(baseOooPrice + selectedPrice); // Базовая цена ООО + цена выбранного типа
            setSelectedArtikul(artikulValue); // Устанавливаем артикул, соответствующий выбранному типу
        }
    };

    // Обработчики для кнопок +/- количества
    const handleMinusClick = () => {
        updateQuantity(quantity - 1);
    };

    const handlePlusClick = () => {
        updateQuantity(quantity + 1);
    };

    // Функции для загрузки файлов (без изменений)
    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files;
        const output = [];
        for (let i = 0, f; f = files[i]; i++) {
            output.push(
                `<li><strong>${escape(f.name)}</strong> (${f.type || 'n/a'}) - ${f.size} bytes, last modified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'}</li>`
            );

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true); // Предполагается, что у вас есть upload.php

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded / e.total) * 100);
                    setUploadMessage(`Загрузка: ${percentage}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setUploadMessage('Мы загрузили ваше фото!');
                } else {
                    setUploadMessage('Возникла ошибка при отправке данных на сервер. Пожалуйста, свяжитесь с нами любым удобным Вам способом через страницу "Контакты"');
                }
            };
            xhr.onerror = () => {
                setUploadMessage('Ошибка сети при загрузке файла. Проверьте подключение.');
            };

            xhr.send(formData);
        }
        const listElement = document.getElementById('list');
        if (listElement) {
            listElement.innerHTML = `<ul>${output.join('')}</ul>`;
        }
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    // Основная функция добавления товара в корзину
    const handleAddToCart = async () => {
        const productToAdd = {
            artikul: selectedArtikul, // Артикул основной печати с выбранным типом/размером
            name: 'Печать для ООО', // Название товара
            price: totalPrice, // ОБЩАЯ цена за текущее количество, тип и оснастку
            quantity: quantity, // Количество товара
            description: 'Печать для ООО с выбранным типом и оснасткой',
            imageUrl: `${process.env.PUBLIC_URL}/resourses/pechati/oooAndIp.png`, // Изображение
            selectedOsnastka: selectedOsnastkaArtikul, // Артикул выбранной оснастки (может быть пустым)
            selectedStampType: selectedStampType // Артикул выбранного типа/размера печати
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-to-cart', { // Проверьте порт вашего сервера
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => response.text());
                throw new Error(`Failed to add product to cart: ${response.status} ${response.statusText}. Server message: ${JSON.stringify(errorData)}`);
            }

            const addedProductFromServer = await response.json();
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

            // Проверяем, существует ли уже такой товар (по artikul, selectedOsnastka и selectedStampType) в корзине
            const existingItemIndex = currentCart.findIndex(item =>
                item.artikul === addedProductFromServer.artikul &&
                item.selectedOsnastka === addedProductFromServer.selectedOsnastka &&
                item.selectedStampType === addedProductFromServer.selectedStampType
            );

            if (existingItemIndex > -1) {
                // Если товар уже есть, обновляем количество и общую цену
                currentCart[existingItemIndex].quantity += addedProductFromServer.quantity || 1;
                currentCart[existingItemIndex].price += addedProductFromServer.price || 0; // Добавляем цену, если сервер ее обновляет
            } else {
                // Если товара нет, добавляем новый
                currentCart.push(addedProductFromServer);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Товар успешно добавлен в корзину!');
            setModalItems(currentCart); // Обновляем состояние модального окна
            setIsModalOpen(true);
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину: ' + error.message);
        }
    };

    // Удаление товара из модального окна (корзины)
    const handleDeleteFromModal = (itemId) => {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        currentCart = currentCart.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setModalItems(currentCart); // Обновляем состояние модального окна
        if (currentCart.length === 0) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.gerb1Page}>
            <Header />

            <main>
                <div className={styles.container}>
                    <img src={`${process.env.PUBLIC_URL}/resourses/pechati/oooAndIp.jpg`} alt="Печать для ООО" />
                    <div className={styles.nazvanie}>
                        <h3>Для ООО</h3>
                        <h4>Moneymoneymoney</h4>
                    </div>
                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>Ø42-45мм</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Резина</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis architecto sed ut fuga culpa soluta quidem corrupti, iusto illo voluptates, accusantium dolorem nostrum. Vitae laudantium quis neque officiis eveniet ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet doloribus nam labore veritatis ut rerum obcaecati, iusto sint amet animi, natus laboriosam dicta voluptates aperiam id consectetur, repellendus autem a.</p>
                        <br /> <h3>Выберите размер:</h3> <br /> <h6 style={{ marginTop: '-2%' }}></h6>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button id="minus" className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quantity}</h3> {/* Использовать quantity */}
                        <button id="plus" className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>

                    {/* Выбор типа штампа (размера/особенности) */}
                    <div className={styles.chooseStampType}>
                        {stampTypes.map((stampType) => (
                            <button
                                key={stampType.id}
                                id={stampType.id}
                                className={`${styles.chooseStampTypeButton} ${selectedStampType === stampType.id ? styles.active : ''}`}
                                onClick={() => handleStampTypeClick(stampType.price, stampType.id, stampType.artikul)}
                            >
                                {stampType.imgSrc && <img src={`${process.env.PUBLIC_URL}/${stampType.imgSrc}`} alt={stampType.name} />}
                                <p className={styles.name}>{stampType.name}</p>
                                <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                    {stampType.price}р
                                </figcaption>
                            </button>
                        ))}
                    </div>

                    {/* Выбор оснастки */}
                    <div className={styles.chooseOsnastka}>
                        {osnastki.map((osnastka) => (
                            <button
                                key={osnastka.id}
                                id={osnastka.id}
                                className={`${styles.chooseOsnastkaButton} ${selectedOsnastkaArtikul === osnastka.artikul ? styles.active : ''}`}
                                onClick={() => handleOsnastkaButtonClick(osnastka.price, osnastka.artikul)}
                            >
                                {osnastka.imgSrc && <img src={`${process.env.PUBLIC_URL}/${osnastka.imgSrc}`} alt={osnastka.name} />}
                                <p className={styles.osnastkaName}>{osnastka.name}</p>
                                {osnastka.price !== 0 && (
                                    <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                        {osnastka.price}р
                                    </figcaption>
                                )}
                                {osnastka.size && <p>{osnastka.size}</p>}
                            </button>
                        ))}
                    </div>

                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{(unitPrice * quantity).toFixed(2)}р</div> <p className={styles.priceStamp}> + </p>
                        <div className={styles.priceOsn}>{(osnastkiPrice * quantity).toFixed(2)}р</div>
                        <div className={styles.totalPrice}>Итого: {totalPrice.toFixed(2)}р</div>
                    </div>

                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div id="drop_zone" className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                    {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>}

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} data-artikul={selectedArtikul} onClick={handleAddToCart}>Добавить в корзину</button>
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

export default Ooo;