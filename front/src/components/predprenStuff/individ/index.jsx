import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import styles from "./style.module.scss"; // Предполагается, что здесь содержатся специфичные для этой страницы стили, НЕ ОБЩИЕ

const Individ = () => {
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [selectedArtikul, setSelectedArtikul] = useState('');
    const [selectedType, setSelectedType] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    const minQuantity = 1;
    const maxQuantity = 1000;

    const types = [
        { id: 'type_ip', name: 'ИП', price: 500, imgSrc: 'resourses/pechati/oooAndIp.jpg', artikul: 'predprenIP' },
        { id: 'type_ooo', name: 'ООО', price: 600, imgSrc: 'resourses/lawer.jpg', artikul: 'predprenOOO' },
        { id: 'type_clear', name: 'Очистить', price: 0, imgSrc: '', artikul: '' }
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

    const handleTypeButtonClick = (price, artikul, id) => {
        if (selectedType === id && id !== 'type_clear') {
            setUnitPrice(0);
            setSelectedArtikul('');
            setSelectedType('');
        } else {
            setUnitPrice(price);
            setSelectedArtikul(artikul);
            setSelectedType(id);
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

        const files = evt.dataTransfer.files;
        const newFilesInfo = [];
        setUploadMessage('');

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
                key: `${f.name}-${f.size}-${f.lastModified}`
            });

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true);

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
        setUploadedFiles(newFilesInfo);
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        if (!selectedArtikul || unitPrice === 0) {
            alert('Пожалуйста, выберите тип печати.');
            return;
        }

        const selectedTypeData = types.find(type => type.artikul === selectedArtikul);
        const imageUrl = selectedTypeData ? `${process.env.PUBLIC_URL}/${selectedTypeData.imgSrc}` : `${process.env.PUBLIC_URL}/resourses/default_stamp.jpg`;

        const productToAdd = {
            artikul: selectedArtikul,
            name: `Печать индивидуальная (${selectedTypeData?.name || ''})`,
            price: totalPrice,
            quantity: quantity,
            description: 'Индивидуальная печать для ИП/ООО',
            imageUrl: imageUrl,
            selectedType: selectedTypeData?.name || ''
        };

        try {
            console.log('Отправка запроса на добавление в корзину:', productToAdd);
            const response = await fetch('http://localhost:3000/api/add-to-cart', {
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
                item.selectedType === addedProductFromServer.selectedType
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
        <div className={styles.gerb1Page}> {/* Используем класс "gerb1Page" */}
            <Header />

            <main>
                <div className={styles.container}>
                    <img
                        src={selectedType && types.find(t => t.id === selectedType)?.imgSrc
                            ? `${process.env.PUBLIC_URL}/${types.find(t => t.id === selectedType).imgSrc}`
                            : `${process.env.PUBLIC_URL}/resourses/pechati/oooAndIp.jpg`
                        }
                        alt="Печать индивидуальная"
                        className={styles.image}
                    />
                    <div className={styles.productInfoSection}>
                        <div className={styles.nazvanie}>
                            <h3>Печать индивидуальная</h3>
                            <h4>Для предпринимателей</h4>
                        </div>

                        <div className={styles.harakteristiki}>
                            <div className={styles.sindzi_4moshnik}><p>Круглая печать</p></div>
                        </div>
                        <div className={styles.about_product}>
                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis architecto sed ut fuga culpa soluta quidem corrupti, iusto illo voluptates, accusantium dolorem nostrum. Vitae laudantium quis neque officiis eveniet ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet doloribus nam labore veritatis ut rerum obcaecati, iusto sint amet animi, natus laboriosam dicta voluptates aperiam id consectetur, repellendus autem a.</p>
                            <br /> <h3>Выберите тип печати:</h3> <br /> <h6 style={{ marginTop: '-2%' }}></h6>
                        </div>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    <div className={styles.itemQuality}>
                        <button id="minus" className={styles.minus} onClick={handleMinusClick}>-</button>
                        <h3>{quantity}</h3>
                        <button id="plus" className={styles.plus} onClick={handlePlusClick}>+</button>
                    </div>

                    <div className={styles.chooseOsnastka}>
                        {types.map((item) => (
                            <button
                                key={item.id}
                                id={item.id}
                                className={`${styles.chooseOsnastkaButton} ${selectedType === item.id ? styles.active : ''}`}
                                onClick={() => handleTypeButtonClick(item.price, item.artikul, item.id)}
                            >
                                {item.imgSrc && <img src={`${process.env.PUBLIC_URL}/${item.imgSrc}`} alt={item.name} />}
                                <p>{item.name}</p>
                                {item.price !== 0 && (
                                    <figcaption className={styles.figcaption} style={{ color: 'black', textAlign: 'center' }}>
                                        {item.price}р
                                    </figcaption>
                                )}
                            </button>
                        ))}
                    </div>
                    <div className={styles.priceRow}>
                        <div className={styles.priceStamp}>{(unitPrice).toFixed(2)}р</div>
                    </div>
                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div id="drop_zone" className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>
                        Перетащите файлы сюда или кликните
                        <input type="file" onChange={(e) => handleFileSelect({ dataTransfer: { files: e.target.files }, stopPropagation: () => {}, preventDefault: () => {} })} multiple style={{ opacity: 0, position: 'absolute', width: '100%', height: '100%', left: 0, top: 0, cursor: 'pointer' }}/>
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

export default Individ;