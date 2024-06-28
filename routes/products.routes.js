/** Load express library/ third-party framework **/
const express = require('express');

/** Load Product related controllers **/
const productController = require('../controllers/products.controller');

/**  Middleware to handle file upload errors **/
const handleFileUpload = require('../middlewares/fileUpload.middleware');

/** create a router service for products **/
const productRouter = express.Router();

/** Handles all products related routes/ API Endpoints **/


productRouter
    // GET all products list .... /GET Request
    .get('/list', productController.listAllProducts)

    // GET product by id   /GET 
    .get('/list/:id([0-9]+)', productController.getProductById)

    // GET products between the price range 
    .get('/limit/:st([0-9]+)/:en([0-9]+)', productController.getProductsInRange)

    // GET products by search query as keywords .... /GET 
    .get('/list/search', productController.searchProducts)

    // ADD new product to mysql database /POST
    .post('/add', handleFileUpload, productController.addProduct)

    // UPDATE products based on id from mysql database ...
    .all('/update/:id([0-9]+)', handleFileUpload, productController.updateProduct)

    // DELETE products from mysql database based on id /DELETE
    .delete('/del/:id([0-9]+)', productController.deleteProductById)

    // export all products data into user's csv file which can be downloadable /GET ...
    .get('/list/get-csv-products', productController.getDataToCsv);

module.exports = productRouter;
console.log('product router module is loading ...');
