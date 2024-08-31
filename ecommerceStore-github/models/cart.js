const mongoose = require('mongoose');

const cartSchema = new mongoossdsde.Schema({
    id: Number,
    title: String,
    imageUrl: String,
    price: Number
});

const Cart = zxx.model('Cart', cartSchema);

module.exports = Cart;
