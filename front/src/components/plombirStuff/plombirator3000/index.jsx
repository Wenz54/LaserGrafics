import React, { useState, useEffect } from 'react';
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import styles from "./style.module.scss"; 

const Plombirator3000 = () => {
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState(0); // Цена выбранной оснастки
    const [totalPrice, setTotalPrice] = useState(0);
    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]);
    const [selectedArtikul, setSelectedArtikul] = useState(''); // Хранит артикул выбранной оснастки
    const [selectedOsnastkaId, setSelectedOsnastkaId] = useState(''); // Хранит ID выбранной оснастки для активного стиля

    const minQuality = 1;
    const maxQuality = 1000;

    const osnastki = [
        { id: 'osnastka_standard', name: 'Стандарт', price: 1500, imgSrc: 'resourses/plombirator.jpg', artikul: 'plombir3kStandard' },
        { id: 'osnastka_reinforced', name: 'Усиленный', price: 2500, imgSrc: 'resourses/plombirator.jpg', artikul: 'plombir3kReinforced' },
        { id: 'osnastka_clear', name: 'Очистить', price: 0, imgSrc: '', artikul: '' }
    ];

    // Эффект для пересчета общей цены при изменении количества или цены оснастки
    useEffect(() => {
        setTotalPrice(unitPrice * quantity);
    }, [unitPrice, quantity]);

    // Обновление количества товара с учетом минимального и максимального значений
    const updateQuantity = (newQuantity) => {
        if (newQuantity < minQuality) {
            newQuantity = minQuality;
        } else if (newQuantity > maxQuality) {
            newQuantity = maxQuality;
        }
        setQuantity(newQuantity);
    };

    // Обработка нажатия кнопок выбора оснастки
    const handleOsnastkaButtonClick = (price, artikul, id) => {
        if (selectedOsnastkaId === id && id !== 'osnastka_clear') {
            // Если та же опция нажата снова (и это не "Очистить"), снимаем выбор
            setUnitPrice(0);
            setSelectedArtikul('');
            setSelectedOsnastkaId('');
        } else {
            // Устанавливаем новую цену и артикул для выбранной оснастки
            setUnitPrice(price);
            setSelectedArtikul(artikul);
            setSelectedOsnastkaId(id);
        }
    };

    // Уменьшение количества
    const handleMinusClick = () => {
        updateQuantity(quantity - 1);
    };

    // Увеличение количества
    const handlePlusClick = () => {
        updateQuantity(quantity + 1);
    };

    // Обработка выбора файла (Drag-and-Drop)
    const handleFileSelect = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();

        const files = evt.dataTransfer.files;
        // const output = []; // Закомментировано, если не используется для отображения списка файлов

        for (let i = 0, f; f = files[i]; i++) {
            // output.push( // Закомментировано
            //     `<li><strong>${escape(f.name)}</strong> (${f.type || 'n/a'}) - ${f.size} bytes, last modified: ${f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a'}</li>`
            // );

            const formData = new FormData();
            formData.append('file', f);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'upload.php', true); // Убедитесь, что 'upload.php' - это правильный эндпоинт для загрузки файлов

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
        // Если вам нужно отобразить список загруженных файлов, раскомментируйте и убедитесь, что элемент с id="list" существует
        // const listElement = document.getElementById('list');
        // if (listElement) {
        //     listElement.innerHTML = `<ul>${output.join('')}</ul>`;
        // }
    };

    // Обработка события перетаскивания файла над зоной
    const handleDragOver = (evt) => {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'copy';
    };

    // --- Логика добавления товара в корзину ---
    const handleAddToCart = async () => {
        // Валидация: Убедитесь, что оснастка выбрана и цена больше 0
        if (!selectedArtikul || unitPrice <= 0) {
            alert('Пожалуйста, выберите оснастку для пломбиратора, чтобы добавить товар в корзину.');
            return; // Останавливаем функцию, если валидация не пройдена
        }

        const productToAdd = {
            artikul: selectedArtikul,
            name: `Пломбиратор 3000 (${osnastki.find(o => o.artikul === selectedArtikul)?.name || ''})`,
            price: totalPrice,
            quantity: quantity,
            description: 'Пломбиратор для опломбирования',
            imageUrl: `${process.env.PUBLIC_URL}/resourses/plombirator.jpg`,
            selectedOsnastka: osnastki.find(o => o.artikul === selectedArtikul)?.name || ''
        };

        try {
            console.log('Отправка запроса на добавление в корзину:', productToAdd);
            const response = await fetch('http://localhost:5000/api/add-to-cart', { // Проверьте URL вашего API
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(productToAdd),
            });

            if (!response.ok) {
                // Если ответ НЕ ОК, сначала читаем тело ответа как текст.
                // Это гарантирует, что мы потребляем тело только один раз.
                const rawErrorData = await response.text();
                let errorData;
                try {
                    // Пытаемся распарсить текст как JSON.
                    errorData = JSON.parse(rawErrorData);
                } catch (e) {
                    // Если не JSON, используем сырой текст как сообщение об ошибке.
                    errorData = rawErrorData; 
                }
                throw new Error(`Не удалось добавить товар в корзину: ${response.status} ${response.statusText}. Сообщение сервера: ${JSON.stringify(errorData)}`);
            }

            // Если ответ ОК, тогда читаем его как JSON.
            const addedProductFromServer = await response.json();
            let currentCart = JSON.parse(localStorage.getItem('cart')) || [];

            // Проверяем, существует ли уже такой товар в корзине (по артикулу и выбранной оснастке)
            const existingItemIndex = currentCart.findIndex(item =>
                item.artikul === addedProductFromServer.artikul &&
                item.selectedOsnastka === addedProductFromServer.selectedOsnastka
            );

            if (existingItemIndex > -1) {
                // Если товар существует, обновляем его данные (предполагаем, что сервер возвращает обновленный товар)
                currentCart[existingItemIndex] = addedProductFromServer;
            } else {
                // Иначе добавляем новый товар в корзину
                currentCart.push(addedProductFromServer);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Товар успешно добавлен в корзину!');
            setModalItems(currentCart); // Обновляем элементы модального окна новой корзиной
            setIsModalOpen(true); // Открываем модальное окно
            console.log('Модальное окно должно быть открыто');
        } catch (error) {
            console.error('Ошибка при добавлении товара в корзину:', error);
            alert('Произошла ошибка при добавлении товара в корзину: ' + error.message);
        }
    };

    // Удаление товара из модального окна корзины
    const handleDeleteFromModal = (itemId) => {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        currentCart = currentCart.filter(item => item._id !== itemId); // Фильтруем по _id, который должен приходить с сервера
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setModalItems(currentCart);
        if (currentCart.length === 0) {
            setIsModalOpen(false); // Закрываем модальное окно, если корзина пуста
        }
    };

    return (
        <div className={styles.pageWrapper}>
            <Header />

            <main className={styles.mainContent}>
                <div className={styles.productSection}>
                    <div className={styles.imageColumn}>
                        <img src={`${process.env.PUBLIC_URL}/resourses/plombirator.jpg`} alt="Пломбиратор 3000" className={styles.productImage} />
                    </div>

                    <div className={styles.detailsColumn}>
                        <div className={styles.titleBlock}>
                            <h3 className={styles.productName}>Пломбиратор 3000</h3>
                            <h4 className={styles.productCategory}>Для пломб</h4>
                        </div>

                        <div className={styles.featuresBlock}>
                            <div className={styles.featureItem}><p>Диаметр оттиска 10мм</p></div>
                        </div>

                        <div className={styles.descriptionBlock}>
                            <p className={styles.productDescription}>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Blanditiis architecto sed ut fuga culpa soluta quidem corrupti, iusto illo voluptates, accusantium dolorem nostrum. Vitae laudantium quis neque officiis eveniet ullam! Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet doloribus nam labore veritatis ut rerum obcaecati, iusto sint amet animi, natus laboriosam dicta voluptates aperiam id consectetur, repellendus autem a.</p>
                            <h3 className={styles.chooseOptionTitle}>Выберите оснастку:</h3>
                        </div>

                        <div className={styles.interactiveBlock}>
                            <div className={styles.itemQuantity}>
                                <button className={styles.quantityButton} onClick={handleMinusClick}>-</button>
                                <h3 className={styles.quantityDisplay}>{quantity}</h3>
                                <button className={styles.quantityButton} onClick={handlePlusClick}>+</button>
                            </div>

                            <div className={styles.chooseOsnastka}>
                                {osnastki.map((item) => (
                                    <button
                                        key={item.id}
                                        id={item.id}
                                        className={`${styles.chooseOsnastkaButton} ${selectedOsnastkaId === item.id ? styles.active : ''}`}
                                        onClick={() => handleOsnastkaButtonClick(item.price, item.artikul, item.id)}
                                    >
                                        {item.imgSrc && <img src={`${process.env.PUBLIC_URL}/${item.imgSrc}`} alt={item.name} />}
                                        <p className={styles.osnastkaName}>{item.name}</p>
                                        {item.price !== 0 && (
                                            <figcaption className={styles.optionPrice}>
                                                {item.price}р
                                            </figcaption>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className={styles.priceRow}>
                                <div className={styles.unitPriceDisplay}>
                                    {(unitPrice).toFixed(2)}р
                                </div>
                                {quantity > 1 && unitPrice > 0 && (
                                    <>
                                        <span className={styles.multiplicationSymbol}> x </span>
                                        <span className={styles.quantityInPrice}>{quantity}</span>
                                        <span className={styles.equalsSymbol}> = </span>
                                        <div className={styles.totalPriceDisplay}>
                                            {totalPrice.toFixed(2)}р
                                        </div>
                                    </>
                                )}
                            </div>

                            <h2 className={styles.uploadInstructions}>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                            <div className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                            {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>}

                            <div className={styles.orderButtons}>
                                <button className={styles.addToCartButton} onClick={handleAddToCart}>Добавить в корзину</button>
                            </div>
                        </div>
                    </div>
                </div>
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
}

export default Plombirator3000;