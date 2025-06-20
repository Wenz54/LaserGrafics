import React, { useState } from 'react'; // useEffect не нужен, если нет зависимых расчетов
import Header from "../../header/index.jsx";
import Footer from "../../footer/index.jsx";
import Modal from "../../modal/index.jsx";
import StuffUnit from "../../stuffUnit/index.jsx";
import styles from "./style.module.scss";
import { Link } from "react-router-dom";

const RoundMetal = () => {
    // Состояния для загрузки файла и модального окна (корзины)
    const [uploadMessage, setUploadMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalItems, setModalItems] = useState([]); // Используем массив для элементов корзины в модальном окне

    // Так как цены и оснастки не выбираются интерактивно,
    // мы можем определить их как константы или получить с сервера.
    // Для простоты, зададим фиксированные значения для добавления в корзину.
    const productArtikul = 'roundMetalStamp'; // Артикул для металлической печати
    const productName = 'Металлическая печать';
    const productBasePrice = 900.00; // Фиксированная базовая цена
    const productQuantity = 1; // Фиксированное количество

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
            // Убедитесь, что 'upload.php' существует и настроен на сервере
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
            xhr.onerror = () => { // Добавим обработчик ошибок сети
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

    const handleAddToCart = async () => {
        const productToAdd = {
            artikul: productArtikul,
            name: productName,
            price: productBasePrice, // Фиксированная цена
            quantity: productQuantity, // Фиксированное количество
            description: 'Металлическая печать. Для подробностей свяжитесь с менеджером.',
            imageUrl: `${process.env.PUBLIC_URL}/resourses/catato.jpg`, // Изображение товара
            selectedOsnastka: '', // Нет выбранной оснастки
        };

        try {
            // Убедитесь, что URL сервера правильный (используем 5000, как в Gerb1)
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

            // Проверяем, существует ли уже такой товар (по artikul) в корзине
            // Для этого товара, скорее всего, не будет "selectedOsnastka", так что просто по artikul
            const existingItemIndex = currentCart.findIndex(item =>
                item.artikul === addedProductFromServer.artikul
            );

            if (existingItemIndex > -1) {
                // Если товар уже есть, обновляем количество (если сервер вернул обновленное)
                currentCart[existingItemIndex].quantity += addedProductFromServer.quantity || productQuantity;
                // Также обновим цену, если сервер вернул новую
                currentCart[existingItemIndex].price += addedProductFromServer.price || productBasePrice;
            } else {
                // Если товара нет, добавляем новый
                currentCart.push(addedProductFromServer);
            }

            localStorage.setItem('cart', JSON.stringify(currentCart));
            alert('Товар успешно добавлен в корзину!');

            // Обновляем состояние модального окна, чтобы оно отобразило текущую корзину
            setModalItems(currentCart);
            setIsModalOpen(true);

        } catch (error) {
            console.error('Error adding product to cart:', error);
            alert('Произошла ошибка при добавлении товара в корзину: ' + error.message);
        }
    };

    // Удаление товара из модального окна (корзины)
    const handleDeleteFromModal = (itemId) => {
        let currentCart = JSON.parse(localStorage.getItem('cart')) || [];
        // Предполагается, что у item есть уникальный _id с сервера
        currentCart = currentCart.filter(item => item._id !== itemId);
        localStorage.setItem('cart', JSON.stringify(currentCart));
        setModalItems(currentCart); // Обновляем состояние модального окна
        // Если корзина пуста после удаления, можно закрыть модалку
        if (currentCart.length === 0) {
            setIsModalOpen(false);
        }
    };

    return (
        <div className={styles.gerb1Page}>
            <Header />

            <main>
                <div className={styles.container}>
                    <img src={`${process.env.PUBLIC_URL}/resourses/catato.jpg`} alt="Металлическая печать" className={styles.image}/>
                    <div className={styles.nazvanie}>
                        <h3>Металлическая</h3>
                        <h4>Так закалялась сталь</h4>
                    </div>

                    <div className={styles.harakteristiki}>
                        <div className={styles.sindzi_4moshnik}><p>Латунь</p></div>
                        <div className={styles.sindzi_4moshnik}><p>Сталь</p></div>
                    </div>
                    <div className={styles.about_product}>
                        <p>Конструктор металлических печатей с рассчётом цены внутри сайта было бы сделать слишком сложно, поэтому обратитесь в <Link to="/contacts">Контакты</Link> для связи с нашими самыми добрыми и отзывчивыми менеджерами, которые обязательно в лёгкой и доступной форме помогут Вам с дизайном и покупкой лучших металлических печатей на свете!</p>
                    </div>
                </div>

                <div className={styles.interactivePartWrapper}>
                    {/* Раздел с количеством и ценой удален, так как интерактивный расчет не предусмотрен */}
                    <p className={styles.priceInfo}>Цена: {productBasePrice.toFixed(2)}р</p> {/* Отображаем фиксированную цену */}

                    <h2>Последний шаг: мышкой перетащите сюда ваши документы</h2>
                    <div id="drop_zone" className={styles.dropZone} onDragOver={handleDragOver} onDrop={handleFileSelect}>Вот сюда</div>
                    {/* Используем обычный параграф для сообщений о загрузке */}
                    {uploadMessage && <p className={styles.uploadMessage}>{uploadMessage}</p>}

                    <div className={styles.orderBtns}>
                        <button id="addToBasket" className={styles.addToBasket} data-artikul={productArtikul} onClick={handleAddToCart}>Добавить в корзину</button>
                    </div>
                </div>

                <Footer />
            </main>

            {/* Модальное окно теперь работает с массивом modalItems */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                modalItems={modalItems}
                handleDeleteFromModal={handleDeleteFromModal}
            />
        </div>
    );
}

export default RoundMetal;