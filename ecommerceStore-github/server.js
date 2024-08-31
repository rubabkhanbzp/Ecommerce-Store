const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Product = require('./models/product');
const Order = require('./models/order'); 



const app = express();
const port = 1049;


app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');


mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));



app.get('/', (req, res) => {
    Product.find()
        .then((products) => {
            res.render('index', { products: products });
        })
        .catch((err) => {
            res.status(500).send('Error loading products');
        });
});

app.get('/cart', (req, res) => {
    res.render('cart');
});


app.post('/checkout', async (req, res) => {
    const { items, total } = req.body;

    try {

        
        const uniqueOrderId = 'ORDER-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

        
        const newOrder = new Order({
            orderId: uniqueOrderId, 
            items,
            total,
            createdAt: new Date(),
        });

        
        const savedOrder = await newOrder.save();

        
        res.status(201).json({
            message: 'Order created successfully',
            orderId: savedOrder.orderId, 
            order: savedOrder,
        });

    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Failed to create order', error });
    }
});



app.get('/orderConfirmation', (req, res) => {
    const orderId = req.query.orderId; 

    if (!orderId) {
        return res.status(400).send('Order ID is missing.');
    }

    Order.findOne({ orderId: orderId })
        .then(order => {
            if (!order) {
                return res.status(404).send('Order not found.');
            }

            res.render('orderConfirmation', { orderId: orderId });
        })
        .catch(error => {
            console.error('Error fetching order:', error);
            res.status(500).send('Internal server error.');
        });
});
;



// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});


