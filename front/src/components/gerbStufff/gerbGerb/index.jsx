import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
// import StuffUnit from "../../stuffUnit/index.jsx"; // StuffUnit seems unused, can be removed if not needed elsewhere
import styles from "./style.module.scss";

const Gerb1 = () => {
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(1200.00); // Base price of the cliche without osnastka
    const [osnastkiPrice, setOsnastkiPrice] = useState(0.00); // Price of the selected osnastka
    const [totalPrice, setTotalPrice] = useState(0); // Total price, will be calculated in useEffect

    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);

    const [selectedArtikul, setSelectedArtikul] = useState('gerbGost'); // Artikuls for tracking selected options
    const [selectedOsnastkaArtikul, setSelectedOsnastkaArtikul] = useState('');
    const [selectedStampType, setSelectedStampType] = useState('');

    const minQuality = 1;
    const maxQuality = 9999;

    const osnastki = [
        { id: 'professional1', name: 'Professional', price: 2800, artikul: 'proffesionalOsn', imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg', size: 'Ø45' },
        { id: 'printy1', name: 'Printy', price: 500, artikul: 'printyOsn', imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg', size: 'Ø45' },
        { id: 'ideal1', name: 'Ideal', price: 400, artikul: 'idealOsn', imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg', size: 'Ø42' },
        { id: 'none', name: 'Очистить', price: 0, artikul: '' }
    ];

    // stampTypes is not used in current JSX for selection, but its definition is kept.
    const stampTypes = [
        { id: 'type1', name: 'Тип 1', price: 100, imgSrc: 'resourses/Kruglie_tovari/52045/52045.jpg' },
        { id: 'type2', name: 'Тип 2', price: 200, imgSrc: 'resourses/Kruglie_tovari/4630/4630.jpg' },
        { id: 'type3', name: 'Тип 3', price: 300, imgSrc: 'resourses/Kruglie_tovari/4924ideal/4924.jpg' },
        { id: 'usual', name: 'Обычная', price: 0, artikul: 'gerbGost' },
    ];

    useEffect(() => {
        setTotalPrice((unitPrice + osnastkiPrice) * quantity);
    }, [unitPrice, osnastkiPrice, quantity]);

    const updateQuantity = (newQuantity) => {
        if (newQuantity < minQuality) {
            newQuantity = minQuality;
        } else if (newQuantity > maxQuality) {
            newQuantity = maxQuality;
        }
        setQuantity(newQuantity);
    };

    const handleOsnastkaButtonClick = (selectedPrice, selectedArtikulValue) => {
        if (selectedOsnastkaArtikul === selectedArtikulValue) {
            setOsnastkiPrice(0);
            setSelectedOsnastkaArtikul('');
        } else {
            setOsnastkiPrice(selectedPrice); // Directly set the price of the selected osnastka
            setSelectedOsnastkaArtikul(selectedArtikulValue);
        }
    };

    const handleMinusClick = () => {
        updateQuantity(quantity - 1);
    };

    const handlePlusClick = () => {
        updateQuantity(quantity + 1);
    };

    // This function for handleStampTypeClick is currently unused in the JSX, 
    // but its definition is kept here.
    const handleStampTypeClick = (selectedPrice, id, artikulValue) => {
        if (id === 'clear' || selectedStampType === id) {
            setSelectedStampType('');
            setUnitPrice(1200.00); // Base price for gerb
            setSelectedArtikul('gerbGost'); // Base artikul
        } else {
            setUnitPrice(selectedPrice); // Update cliche price
            setSelectedStampType(id);
            setSelectedArtikul(artikulValue);
        }
    };

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
            xhr.open('POST', 'upload.php', true);

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
        const listElement = document.getElementById('list'); // Make sure this ID exists if needed for file list
        if (listElement) {
            listElement.innerHTML = `<ul>${output.join('')}</ul>`;
        }
    };

    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    const handleAddToCart = async () => {
        const productToAdd = {
            artikul: selectedArtikul,
            name: 'Гербовая печать',
            price: totalPrice, // Use totalPrice here
            quantity: quantity,
            description: 'Гербовая печать по ГОСТу Р 51511-2001',
            imageUrl: `${process.env.PUBLIC_URL}/resourses/pechati/menti.jpg`,
            selectedOsnastka: selectedOsnastkaArtikul,
            selectedStampType: selectedStampType,
        };

        try {
            const response = await fetch('http://localhost:5000/api/add-to-cart', {
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

            const existingItemIndex = currentCart.findIndex(item =>
                item.artikul === addedProductFromServer.artikul &&
                item.selectedOsnastka === addedProductFromServer.selectedOsnastka
            );

            if (existingItemIndex > -1) {
                currentCart[existingItemIndex] = addedProductFromServer;
            } else {
                currentCart.push(addedProductFromServer);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Товар успешно добавлен в корзину!');
            setModalItems(currentCart);
            setIsModalOpen(true);
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
        <div className={styles.pageWrapper}> {/* Changed to pageWrapper for consistency */}
            <Header />

            <main className={styles.mainContent}> {/* Added mainContent for consistency */}
                <div className={styles.productSection}> {/* New wrapper for main product layout */}
                    <div className={styles.imageColumn}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/pechati/menti.jpg`} alt="Гербовые" className={styles.productImage}/>
                    </div>

                    <div className={styles.detailsColumn}> {/* New wrapper for all details */}
                        <div className={styles.titleBlock}>
                            <h3 className={styles.productName}>Гербовая</h3>
                            <h4 className={styles.productCategory}>По ГОСТу Р 51511-2001</h4>
                        </div>

                        <div className={styles.featuresBlock}>
                            <div className={styles.featureItem}><p>Ø40-48мм</p></div>
                            <div className={styles.featureItem}><p>Клише печати</p></div>
                            <div className={styles.featureItem}><p>Маслобензостойкая резина</p></div>
                        </div>

                        <div className={styles.descriptionBlock}>
                            <p className={styles.productDescription}>
                                <a className={styles.descriptionLink}>Гербовые печати для государственных или муниципальных учреждений.</a> <br /> Cодержание — вышестоящая организация, полное и краткое наименование организации, ОГРН, ИНН, место нахождения организации, в центре герб РФ или герб субъекта РФ, средства защиты — микрошрифт, растровая сетка, линии толщиной 0,08 мм, оснастка — автоматическая, ручная, документы — свидетельства ОГРН, ИНН, уставные документы, при выдаче печати – подпись клиента в журнале учета печатей и штампов.
                                <br /><a className={styles.descriptionLink}>ООО «Лазер Графикс»</a> (сертификат соответствия <a className={styles.descriptionLink}>№ ПС.RU.П.1028 от 01.02.2024) </a> имеет право изготавливать мастичные печати всех типов, в том числе с воспроизведением Государственного герба России, гербов субъектов Российской Федерации, городов России, логотипов предприятий Российской Федерации всех форм собственности и без таковых.
                            </p>
                            <h3 className={styles.chooseOptionTitle}>Выберите оснастку:</h3>
                            {/* The empty h6 tag was removed */}
                        </div>

                        <div className={styles.interactiveBlock}>
                            <div className={styles.itemQuantity}>
                                <button className={styles.quantityButton} onClick={handleMinusClick}>-</button>
                                <h3 className={styles.quantityDisplay}>{quantity}</h3>
                                <button className={styles.quantityButton} onClick={handlePlusClick}>+</button>
                            </div>

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
                                            <figcaption className={styles.optionPrice}>
                                                {osnastka.price}р
                                            </figcaption>
                                        )}
                                        <p className={styles.optionSize}>{osnastka.size}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Removed chooseStampType block as it's commented out in your original code */}

                            <div className={styles.priceRow}>
                                <div className={styles.unitPriceDisplay}>{(unitPrice).toFixed(2)}р</div>
                                {osnastkiPrice > 0 && (
                                    <>
                                        <span className={styles.multiplicationSymbol}> + </span>
                                        <div className={styles.osnastkaPriceDisplay}>{(osnastkiPrice).toFixed(2)}р</div>
                                    </>
                                )}
                                {quantity > 1 && (unitPrice + osnastkiPrice) > 0 && (
                                    <>
                                        <span className={styles.multiplicationSymbol}> x </span>
                                        <span className={styles.quantityInPrice}>{quantity}</span>
                                        <span className={styles.equalsSymbol}> = </span>
                                        <div className={styles.totalPriceDisplay}>{totalPrice.toFixed(2)}р</div>
                                    </>
                                )}
                            </div>

                            {/* <h2 className={styles.uploadInstructions}>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                            <div className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                            {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>} */}

                            <div className={styles.orderButtons}>
                                <button
                                    className={styles.addToCartButton}
                                    onClick={handleAddToCart}
                                >
                                    Добавить в корзину
                                </button>
                            </div>
                        </div>
                    </div> {/* End detailsColumn */}
                </div> {/* End productSection */}
            </main>

            <Footer />

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItems={modalItems}
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
};

export default Gerb1;