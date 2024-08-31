const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true }, // Unique order ID
    items: [{
        id: Number, /*productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },*/
        title: String,
        price: Number,
        quantity: Number,
    }],
    total: Number,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
