import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import styles from "./style.module.scss";

const TabFasad3d = () => {
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [selectedArtikul, setSelectedArtikul] = useState('');
    const [selectedSizeId, setSelectedSizeId] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]); // Добавлено для хранения информации о загруженных файлах

    const minQuantity = 1;
    const maxQuantity = 1000;

    const sizes = [ // Переименовал "osnastki" в "sizes" для ясности
        { id: 'size_400x300', name: '400x300', price: 3800, imgSrc: 'resourses/tabel.jpg', artikul: '3dLittle' },
        { id: 'size_500x500', name: '500x500', price: 6800, imgSrc: 'resourses/tabel.jpg', artikul: '3dLittle+' },
        { id: 'size_500x700', name: '500x700', price: 9500, imgSrc: 'resourses/tabel.jpg', artikul: '3dMedium' },
        { id: 'size_600x800', name: '600x800', price: 13000, imgSrc: 'resourses/tabel.jpg', artikul: '3dBig' },
        { id: 'size_1200x2000', name: '1200x2000', price: 20000, imgSrc: 'resourses/tabel.jpg', artikul: '3dBig+' },
        { id: 'size_clear', name: 'Очистить', price: 0, imgSrc: '', artikul: '' }
    ];

    useEffect(() => {
        setTotalPrice(unitPrice * quantity);
    }, [unitPrice, quantity]);

    const updateQuantity = (newQuantity) => {
        if (newQuantity < minQuantity) {
            newQuantity = minQuantity;
        } else if (newQuantity > maxQuantity) {
            newQuantity = maxQuantity;
        }
        setQuantity(newQuantity);
    };

    const handleSizeButtonClick = (price, artikul, id) => {
        if (selectedSizeId === id && id !== 'size_clear') { // Сброс только если это не кнопка "Очистить"
            setUnitPrice(0);
            setSelectedArtikul('');
            setSelectedSizeId('');
        } else {
            setUnitPrice(price);
            setSelectedArtikul(artikul);
            setSelectedSizeId(id);
        }
    };

    const handleMinusClick = () => {
        updateQuantity(quantity - 1);
    };

    const handlePlusClick = () => {
        updateQuantity(quantity + 1);
    };

    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files || evt.target.files; // Для поддержки input[type="file"]
        const newFilesInfo = [];
        setUploadMessage(''); // Сброс сообщения

        if (files.length === 0) {
            setUploadMessage('Нет файлов для загрузки.');
            return;
        }

        for (let i = 0, f; f = files[i]; i++) {
            newFilesInfo.push({
                name: f.name,
                type: f.type || 'n/a',
                size: f.size,
                lastModified: f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
                key: `${f.name}-${f.size}-${f.lastModified}` // Уникальный ключ для React списка
            });

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true); // Предполагается, что у вас есть upload.php

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentage = Math.round((e.loaded / e.total) * 100);
                    setUploadMessage(`Загрузка "${f.name}": ${percentage}%`);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    setUploadMessage(`Файл "${f.name}" загружен успешно!`);
                } else {
                    setUploadMessage(`Ошибка при загрузке "${f.name}": ${xhr.status} ${xhr.statusText}. Пожалуйста, свяжитесь с нами.`);
                    console.error(`Upload error for ${f.name}:`, xhr.status, xhr.statusText, xhr.responseText);
                }
            };
            xhr.onerror = () => {
                setUploadMessage(`Ошибка сети при загрузке "${f.name}". Проверьте подключение.`);
                console.error(`Network error for ${f.name}`);
            };

            xhr.send(formData);
        }
        setUploadedFiles(newFilesInfo); // Обновляем состояние загруженных файлов
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        if (!selectedArtikul || unitPrice === 0) {
            alert('Пожалуйста, выберите размер фасада.');
            return;
        }

        const selectedSizeData = sizes.find(s => s.artikul === selectedArtikul);
        const imageUrl = selectedSizeData ? `${process.env.PUBLIC_URL}/${selectedSizeData.imgSrc}` : `${process.env.PUBLIC_URL}/resourses/default_tabel.jpg`; // Изображение по умолчанию

        const productToAdd = {
            artikul: selectedArtikul,
            name: `Фасадная табличка 3D (${selectedSizeData?.name || ''})`,
            price: totalPrice,
            quantity: quantity,
            description: '3D фасадная табличка для улицы',
            imageUrl: imageUrl,
            selectedSize: selectedSizeData?.name || ''
        };

        try {
            console.log('Отправка запроса на добавление в корзину:', productToAdd);
            const response = await fetch('https://lasergrafics.ru/api/add-to-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => response.text());
                throw new Error(`Не удалось добавить товар в корзину: ${response.status} ${response.statusText}. Сообщение сервера: ${JSON.stringify(errorData)}`);
            }

            const addedProductFromServer = await response.json();
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

            const existingItemIndex = currentCart.findIndex(item =>
                item.artikul === addedProductFromServer.artikul &&
                item.selectedSize === addedProductFromServer.selectedSize
            );

            if (existingItemIndex > -1) {
                currentCart[existingItemIndex].quantity += addedProductFromServer.quantity || 1;
            } else {
                currentCart.push(addedProductFromServer);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Товар успешно добавлен в корзину!');
            setModalItems(currentCart);
            setIsModalOpen(true);
            console.log('Модальное окно должно быть открыто');
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину: ' + error.message);
        }
    };

    const handleDeleteFromModal = (itemId) => {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        currentCart = currentCart.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setModalItems(currentCart);
        if (currentCart.length === 0) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.productPage}> {/* Изменен класс для большей семантики */}
            <Header />

            <main>
                <div className={styles.container}>
                    <img
                        src={selectedSizeId && sizes.find(s => s.id === selectedSizeId)?.imgSrc
                            ? `${process.env.PUBLIC_URL}/${sizes.find(s => s.id === selectedSizeId).imgSrc}`
                            : `${process.env.PUBLIC_URL}/resourses/tabel.jpg` // Изображение по умолчанию
                        }
                        alt="Фасадная табличка 3D"
                        className={styles.image}
                    />
                    <div className={styles.productInfoSection}> {/* Общий контейнер для текстовой части */}
                        <div className={styles.nazvanie}>
                            <h3>Фасадная</h3>
                            <h4>Для улицы</h4>
                        </div>

                        <div className={styles.harakteristiki}>
                            <div className={styles.featureBox}><p>400x300-1200x2000</p></div> {/* Изменен класс на более общий */}
                        </div>
                        <div className={styles.about_product}>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis architecto sed ut fuga culpa soluta quidem corrupti, iusto illo voluptates, accusantium dolorem nostrum. Vitae laudantium quis neque officiis eveniet ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet doloribus nam labore veritatis ut rerum obcaecati, iusto sint amet animi, natus laboriosam dicta voluptates aperiam id consectetur, repellendus autem a.</p>
                            <br /> <h3>Выберите размер:</h3> <br /> <h6 style={{ marginTop: '-2%' }}></h6>
                        </div>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quantity}</h3>
                        <button className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>

                    <div className={styles.chooseOptions}> {/* Переименован класс для ясности */}
                        {sizes.map((item) => (
                            <button
                                key={item.id}
                                className={`${styles.optionButton} ${selectedSizeId === item.id ? styles.active : ''}`}
                                onClick={() => handleSizeButtonClick(item.price, item.artikul, item.id)}
                            >
                                {item.imgSrc && <img src={`${process.env.PUBLIC_URL}/${item.imgSrc}`} alt={item.name} />}
                                <p>{item.name}</p>
                                {item.price !== 0 && (
                                    <figcaption className={styles.figcaption}>
                                        {item.price}р
                                    </figcaption>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.unitPrice}>{(unitPrice).toFixed(2)}р</div>
                        <p className={styles.multiplySign}> x {quantity} = </p>
                        <div className={styles.totalPrice}>{totalPrice.toFixed(2)}р</div>
                    </div>
                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>
                        Перетащите файлы сюда или кликните
                        <input type="file" onChange={(e) => handleFileSelect(e)} multiple style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer' }}/>
                    </div>
                    {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>}
                    {uploadedFiles.length > 0 && (
                        <div className={styles.uploadedFilesContainer}>
                            <h4>Загруженные файлы:</h4>
                            <ul className={styles.uploadedFilesList}>
                                {uploadedFiles.map((file) => (
                                    <li key={file.key}>
                                        <strong>{file.name}</strong> ({file.type}) - {file.size} bytes, last modified: {file.lastModified}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    <div className={styles.orderBtns}>
                        <button className={styles.addToBasket} onClick={handleAddToCart}>Добавить в корзину</button>
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

export default TabFasad3d;