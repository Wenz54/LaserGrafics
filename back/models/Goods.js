// models/Goods.js
const mongoose = require('mongoose');

const goodsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    artikul: { type: String, unique: true, required: true }, // Уникальный артикул - важно для поиска
    imageUrl: { type: String }, // URL изображения
    // Добавьте другие поля, если они понадобятся, например:
    // category: { type: String },
    // availableQuantity: { type: Number, default: 0 },
    // isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Good', goodsSchema);