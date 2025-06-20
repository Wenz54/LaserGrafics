const express = require('express');
const xss = require('xss');
const Goods = require('../models/Goods'); // Подключаем модель Goods

const router = express.Router();

const sanitizeInput = (input) => xss(input);

// Временное хранение корзины на бэкенде.
// Это не масштабируемо и не персистентно между перезапусками сервера,
// но подходит для тестового "подъема" фронта и бэка.
// В будущем это будет заменено на хранение в БД, как обсуждали.
let temporaryCart = []; // В реальном приложении это будет БД!

router.post('/add-to-cart', async (req, res) => {
    const { artikul, quantity } = req.body;

    try {
        const sanitizedArtikul = sanitizeInput(artikul);
        const parsedQuantity = parseInt(sanitizeInput(quantity), 10);

        if (isNaN(parsedQuantity) || parsedQuantity <= 0) {
            return res.status(400).json({ message: 'Quantity must be a positive number' });
        }

        // 1. Находим товар в базе данных по артикулу
        const good = await Goods.findOne({ artikul: sanitizedArtikul });

        if (!good) {
            return res.status(404).json({ message: 'Product not found with this artikul.' });
        }

        // Создаем объект товара для корзины, используя данные из БД
        const itemForCart = {
            _id: good._id, // Используем ID из БД
            artikul: good.artikul,
            name: good.name,
            price: good.price,
            description: good.description,
            imageUrl: good.imageUrl,
            quantity: parsedQuantity // Количество берем из запроса
        };

        // 2. Добавляем товар в нашу "временную" корзину на сервере
        const existingItemIndex = temporaryCart.findIndex(item => String(item._id) === String(good._id));

        if (existingItemIndex > -1) {
            temporaryCart[existingItemIndex].quantity += parsedQuantity;
        } else {
            temporaryCart.push(itemForCart);
        }

        // Отправляем обратно клиенту полную информацию о добавленном товаре
        res.status(200).json(itemForCart);
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Добавляем роут для получения всех товаров (для GerbDoctor.jsx, чтобы он не хранил статику)
router.get('/products', async (req, res) => {
    try {
        const goods = await Goods.find({}); // Получаем все товары
        res.status(200).json(goods);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;