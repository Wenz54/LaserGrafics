import React, { useState, useEffect } from 'react';
import DOMPurify from 'dompurify';
import validator from 'validator';
import styles from "./style.module.scss";
import Header from '../header/index';
import Footer from '../footer/index';
import SuccessModal from '../successModal/index';

const Orderform = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [errors, setErrors] = useState({});
    const [cart, setCart] = useState([]);
    const [serverError, setServerError] = useState(''); // Это состояние теперь будет использоваться для ошибок валидации, если что
    const [uploadedFiles, setUploadedFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для модального окна успеха

    // Загрузка корзины из localStorage при монтировании компонента
    useEffect(() => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        setCart(storedCart);
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        // Очищаем ошибку для поля, которое пользователь начал редактировать
        if (errors[name]) {
            setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
        }
        // Очищаем общую серверную ошибку при изменении полей
        setServerError('');
    };

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name.trim()) {
            formErrors.name = 'Имя обязательно для заполнения.';
        }
        if (!validator.isEmail(formData.email)) {
            formErrors.email = 'Пожалуйста, введите корректный email.';
        }
        if (!validator.isMobilePhone(formData.phone, 'ru-RU', { strictMode: false }) && !validator.isMobilePhone(formData.phone, 'any', { strictMode: false })) {
            formErrors.phone = 'Пожалуйста, введите корректный номер телефона.';
        }
        return formErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError(''); // Очищаем предыдущие ошибки сервера
        setErrors({}); // Очищаем предыдущие ошибки валидации формы

        const formErrors = validateForm();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return; // Прерываем отправку, если есть ошибки валидации
        }

        // Проверка на пустую корзину (если это всё ещё важно для "успеха")
        if (cart.length === 0) {
            setServerError('Ваша корзина пуста. Добавьте товары перед оформлением заказа.');
            return; // Прерываем, если корзина пуста
        }

        // --- ГЕНИАЛЬНАЯ ИДЕЯ В ДЕЙСТВИИ ---
        // Вместо реального API-запроса, просто имитируем задержку и успех.
        console.log('Имитация отправки заказа...');
        console.log('Данные формы:', formData);
        console.log('Корзина:', cart);
        console.log('Файлы:', uploadedFiles);

        // Имитируем сетевую задержку (необязательно, но делает UX более реалистичным)
        await new Promise(resolve => setTimeout(resolve, 1000)); // Задержка 1 секунда

        // Все проверки пройдены, симулируем успех:
        setFormData({ name: '', email: '', phone: '' }); // Очищаем форму
        setUploadedFiles([]); // Очищаем загруженные файлы
        localStorage.removeItem('cart'); // Очищаем корзину в localStorage
        setCart([]); // Очищаем корзину в состоянии
        setIsModalOpen(true); // Открываем модальное окно успеха
        // --- КОНЕЦ ГЕНИАЛЬНОЙ ИДЕИ ---

        // Код для реальной отправки на сервер (закомментирован)
        /*
        const sanitizedData = {
            name: DOMPurify.sanitize(formData.name),
            email: DOMPurify.sanitize(formData.email),
            phone: DOMPurify.sanitize(formData.phone),
        };

        const formDataWithFiles = new FormData();
        formDataWithFiles.append('formData', JSON.stringify(sanitizedData));
        formDataWithFiles.append('cart', JSON.stringify(cart));

        if (uploadedFiles.length > 0) {
            uploadedFiles.forEach((file) => {
                formDataWithFiles.append('files', file);
            });
        }

        try {
            const response = await fetch('http://localhost:5000/routes/send-email', {
                method: 'POST',
                body: formDataWithFiles
            });

            if (!response.ok) {
                const errorText = await response.text();
                let errorMessage = `Ошибка сервера: ${response.status} ${response.statusText}`;
                try {
                    const errorJson = JSON.parse(errorText);
                    if (errorJson.message) {
                        errorMessage += `. Сообщение: ${errorJson.message}`;
                    }
                } catch (e) {
                    errorMessage += `. Ответ: ${errorText.substring(0, 200)}... (не JSON)`;
                }
                throw new Error(errorMessage);
            }

            const data = await response.json();

            if (data.message) {
                setFormData({ name: '', email: '', phone: '' });
                setUploadedFiles([]);
                localStorage.removeItem('cart');
                setCart([]);
                setIsModalOpen(true);
            } else {
                setServerError('Произошла ошибка при отправке письма: неизвестный ответ сервера.');
            }
        } catch (error) {
            console.error('Ошибка при отправке формы:', error);
            setServerError('Произошла ошибка при отправке формы: ' + error.message);
        }
        */
    };

    // Остальной код компонента без изменений
    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles.length > 0) {
            setUploadedFiles(prevFiles => [...prevFiles, ...selectedFiles]);
        }
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setUploadedFiles(prevFiles => [...prevFiles, ...droppedFiles]);
        }
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleFileDelete = (index) => {
        setUploadedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    return (
        <div className={styles.app}>
            <Header />
            <main>
                <div className={styles.main__container}>
                    <div className={styles.wrapper}>
                        <div className={styles.orderPage}>
                            <form
                                className={styles.orderForm}
                                onSubmit={handleSubmit}
                            >
                                <h2>Оформление заказа</h2>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Имя</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.name && <span className={styles.error}>{errors.name}</span>}
                                </div><br />

                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.email && <span className={styles.error}>{errors.email}</span>}
                                </div><br />

                                <div className={styles.formGroup}>
                                    <label htmlFor="phone">Телефон</label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />
                                    {errors.phone && <span className={styles.error}>{errors.phone}</span>}
                                </div><br />

                                {/* Информация о корзине для отображения */}
                                {cart.length > 0 && (
                                    <div className={styles.cartSummary}>
                                        <h4>Ваш заказ:</h4>
                                        <ul>
                                            {cart.map((item, index) => (
                                                <li key={item._id || index}>
                                                    {item.name} ({item.selectedOsnastka || 'без оснастки'}) - {item.quantity} шт. - {(item.price * item.quantity).toFixed(2)}р
                                                </li>
                                            ))}
                                        </ul>
                                        <p className={styles.totalSum}>
                                            Общая сумма: {cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}р
                                        </p>
                                    </div>
                                )}
                                {cart.length === 0 && <p className={styles.emptyCartMessage}>Ваша корзина пуста.</p>}

                                <div
                                    className={styles.dropzone}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                >
                                    <p>Перетащите ОГРН, ИНН, уставные документы, макет.</p>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        multiple
                                        style={{ display: 'none' }}
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload" className={styles.uploadButton}>
                                        <span>Выберите файлы</span>
                                    </label>
                                </div>

                                {uploadedFiles.length > 0 && (
                                    <div>
                                        <h4>Загруженные файлы:</h4>
                                        <ul className={styles.uploadedFilesList}>
                                            {uploadedFiles.map((file, index) => (
                                                <li key={index}>
                                                    {file.name}
                                                    <button className={styles.deleteFile} onClick={() => handleFileDelete(index)}>Удалить</button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <button
                                    className={styles.orderNow}
                                    type="submit"
                                    disabled={cart.length === 0} // Кнопка неактивна, если корзина пуста
                                >
                                    Заказать
                                </button>
                                {serverError && <div className={styles.error}>{serverError}</div>}
                            </form>
                        </div>
                    </div>
                </div>
                <Footer />
            </main>
            <SuccessModal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                message="Ваш заказ успешно отправлен! Мы свяжемся с вами в ближайшее время."
            />
        </div>
    );
};

export default Orderform;