const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: Number,
    title: String,
    imageUrl: String,
    price: Number
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
