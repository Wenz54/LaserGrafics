// server.js
const express = require('express');
const cors = require('cors'); // Установите: npm install cors
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware для парсинга JSON-тела запросов
app.use(express.json());

// Middleware для разрешения CORS.
// Во время разработки можно использовать `app.use(cors());`
// Для продакшена лучше указать конкретный источник:
app.use(cors({
    origin: 'https://lasergrafics-2.onrender.com', // Укажите URL вашего React-приложения
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Простейшее хранилище для корзины в памяти серверач
// В реальном приложении это была бы база данных (MongoDB, PostgreSQL и т.д.)
let serverCart = [];

// Роут для добавления товара в корзину
app.post('/api/add-to-cart', (req, res) => {
    const product = req.body;
    console.log('Received product for cart:', product);

    // Базовая валидация данных
    if (!product || !product.artikul || !product.name || product.price === undefined || !product.quantity) {
        console.error('Invalid product data received:', product);
        return res.status(400).json({ message: 'Некорректные данные товара. Отсутствуют артикул, название, цена или количество.' });
    }

    // Ищем, есть ли уже такой товар в serverCart.
    // Уникальность определяется комбинацией `artikul` и `selectedOsnastka`.
    const existingItemIndex = serverCart.findIndex(item =>
        item.artikul === product.artikul &&
        item.selectedOsnastka === product.selectedOsnastka
    );

    if (existingItemIndex > -1) {
        // Если товар уже есть, обновляем его количество и общую цену
        serverCart[existingItemIndex].quantity += product.quantity;
        serverCart[existingItemIndex].price += product.price; // Добавляем цену нового пакета к существующей
        console.log('Updated existing item in server cart:', serverCart[existingItemIndex]);
    } else {
        // Если товара нет, добавляем новый. Генерируем простой уникальный ID.
        // В реальном приложении ID будет генерироваться базой данных.
        product._id = Date.now().toString(); // Простое уникальное ID для идентификации на фронтенде (например, для удаления)
        serverCart.push(product);
        console.log('Added new item to server cart:', product);
    }

    console.log('Current server cart state:', serverCart);
    // Возвращаем добавленный/обновленный товар клиенту.
    // Это важно, чтобы фронтенд мог получить _id для нового товара, если он был создан.
    res.status(200).json(product); 
});

// Роут для получения содержимого корзины (для отладки или для страницы корзины)
app.get('/api/cart', (req, res) => {
    console.log('Fetching current server cart:', serverCart);
    res.status(200).json(serverCart);
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});