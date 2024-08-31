const mongoose = require('mongoose');
const XLSX = require('xlsx');
const Product = require('./models/product');

mongoose.connect('mongodb://localhost:27017/ecommerce')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB', err));

const workbook = XLSX.readFile('./data/products.xlsx');
const sheet_name_list = workbook.SheetNames;
const productsData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

const products = productsData.map(data => ({
    id: data.ID,
    title: data.Title,
    imageUrl: data.Image,  
    price: parseFloat(data.Price.replace(/[^0-9.-]+/g, ""))
}));

Product.insertMany(products)
    .then(() => {
        console.log('Products imported successfully');
        mongoose.connection.close();
    })
    .catch((err) => {
        console.error('Error importing products:', err);
        mongoose.connection.close();
    });
