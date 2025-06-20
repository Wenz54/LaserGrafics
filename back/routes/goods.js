const express = require('express');
const Goods = require('../models/Goods');
const { authenticate } = require('./auth'); // Импортируем authenticate из auth.js

const router = express.Router();

// Применяем middleware authenticate ко всем роутам в этом файле
router.use(authenticate);

// Создать новый товар
router.post('/goods', async (req, res) => {
    try {
        const newGood = new Goods(req.body);
        await newGood.save();
        res.status(201).json(newGood);
    } catch (error) {
        console.error('Error creating good:', error);
        // Проверка на уникальность артикула
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Product with this artikul already exists.' });
        }
        res.status(500).json({ message: 'Internal server error while creating good.' });
    }
});

// Получить все товары
router.get('/goods', async (req, res) => {
    try {
        const goods = await Goods.find();
        res.status(200).json(goods);
    } catch (error) {
        console.error('Error fetching goods:', error);
        res.status(500).json({ message: 'Internal server error while fetching goods.' });
    }
});

// Получить товар по ID
router.get('/goods/:id', async (req, res) => {
    try {
        const good = await Goods.findById(req.params.id);
        if (!good) {
            return res.status(404).json({ message: 'Good not found' });
        }
        res.status(200).json(good);
    } catch (error) {
        console.error('Error fetching good by ID:', error);
        res.status(500).json({ message: 'Internal server error while fetching good by ID.' });
    }
});

// Обновить товар
router.put('/goods/:id', async (req, res) => {
    try {
        const updatedGood = await Goods.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!updatedGood) {
            return res.status(404).json({ message: 'Good not found' });
        }
        res.status(200).json(updatedGood);
    } catch (error) {
        console.error('Error updating good:', error);
        if (error.code === 11000) { // Ошибка дублирования ключа
            return res.status(400).json({ message: 'Product with this artikul already exists.' });
        }
        res.status(500).json({ message: 'Internal server error while updating good.' });
    }
});

// Удалить товар
router.delete('/goods/:id', async (req, res) => {
    try {
        const deletedGood = await Goods.findByIdAndDelete(req.params.id);
        if (!deletedGood) {
            return res.status(404).json({ message: 'Good not found' });
        }
        res.status(200).json({ message: 'Good deleted successfully' });
    } catch (error) {
        console.error('Error deleting good:', error);
        res.status(500).json({ message: 'Internal server error while deleting good.' });
    }
});

module.exports = router;