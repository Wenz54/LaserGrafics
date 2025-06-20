import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import styles from "./style.module.scss";

const TabOffice = () => {
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);

    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [selectedArtikul, setSelectedArtikul] = useState('');
    const [selectedSizeId, setSelectedSizeId] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]); // Added to store info about uploaded files

    const minQuantity = 1;
    const maxQuantity = 1000;

    const sizes = [ // Renamed "osnastki" to "sizes" for clarity
        { id: 'size_200x100', name: '200x100', price: 1200, imgSrc: 'resourses/tabel.jpg', artikul: 'officeSmall' },
        { id: 'size_300x150', name: '300x150', price: 1800, imgSrc: 'resourses/tabel.jpg', artikul: 'officeMedium' },
        { id: 'size_400x200', name: '400x200', price: 2500, imgSrc: 'resourses/tabel.jpg', artikul: 'officeLarge' },
        { id: 'size_500x250', name: '500x250', price: 3200, imgSrc: 'resourses/tabel.jpg', artikul: 'officeXLarge' },
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
        if (selectedSizeId === id && id !== 'size_clear') { // Reset only if it's not the "Clear" button
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

        const files = evt.dataTransfer.files || evt.target.files; // For drag-and-drop or input[type="file"]
        const newFilesInfo = [];
        setUploadMessage(''); // Reset message

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
                key: `${f.name}-${f.size}-${f.lastModified}` // Unique key for React list
            });

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true); // Assuming you have upload.php

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
        setUploadedFiles(newFilesInfo); // Update uploaded files state
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        if (!selectedArtikul || unitPrice === 0) {
            alert('Пожалуйста, выберите размер офисной таблички.');
            return;
        }

        const selectedSizeData = sizes.find(s => s.artikul === selectedArtikul);
        const imageUrl = selectedSizeData ? `${process.env.PUBLIC_URL}/${selectedSizeData.imgSrc}` : `${process.env.PUBLIC_URL}/resourses/default_tabel.jpg`; // Default image if not found

        const productToAdd = {
            artikul: selectedArtikul,
            name: `Офисная табличка (${selectedSizeData?.name || ''})`,
            price: totalPrice,
            quantity: quantity,
            description: 'Офисная табличка для помещений',
            imageUrl: imageUrl,
            selectedSize: selectedSizeData?.name || ''
        };

        try {
            console.log('Отправка запроса на добавление в корзину:', productToAdd);
            const response = await fetch('https://lasergrafics.ru/api/add-to-cart', { // Corrected URL
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
        <div className={styles.productPage}> {/* Changed class for better semantics */}
            <Header />

            <main>
                <div className={styles.container}>
                    <img
                        src={selectedSizeId && sizes.find(s => s.id === selectedSizeId)?.imgSrc
                            ? `${process.env.PUBLIC_URL}/${sizes.find(s => s.id === selectedSizeId).imgSrc}`
                            : `${process.env.PUBLIC_URL}/resourses/tabel.jpg` // Default image
                        }
                        alt="Офисная табличка"
                        className={styles.image}
                    />
                    <div className={styles.productInfoSection}> {/* General container for text part */}
                        <div className={styles.nazvanie}>
                            <h3>Офисная табличка</h3>
                            <h4>Для помещений</h4>
                        </div>

                        <div className={styles.harakteristiki}>
                            <div className={styles.featureBox}><p>200x100-500x250</p></div> {/* Changed class to a more general one */}
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

                    <div className={styles.chooseOptions}> {/* Renamed class for clarity */}
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

export default TabOffice;