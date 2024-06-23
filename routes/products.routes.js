/** Load express library/ third-party framework **/
const express = require('express');

/** Load multer for file upload handling **/
const multer = require('multer');

/** Load Product related controllers **/
const productController = require('../controllers/products.controller');

/** load upload object module **/
const uploadObj = require('../uploads/fileConfig');

/** create a router service for products **/
const productRouter = express.Router();

/** Handles all products related routes/ API Endpoints **/


// GET all products list .... /GET Request
productRouter.get('/list', productController.listAllProducts);

// GET product by id   /GET 
productRouter.get('/list/:id([0-9]+)', productController.getProductById);

// GET products between the price range 
productRouter.get('/limit/:st([0-9]+)/:en([0-9]+)', productController.getProductsInRange);

// GET products by search query as keywords .... /GET 
productRouter.get('/list/search', productController.searchProducts);

// Middleware to handle file upload errors
const handleFileUpload = (req, res, next) => {
    uploadObj.single('pro_image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({ message: 'File size exceeds the limit of 5 MB!' });
            }
            return res.status(400).json({ message: err.message });
        } else if (err) {
            return res.status(400).json({ message: err.message });
        }
        next();
    });
};

// ADD new product to mysql database /POST
productRouter.post('/add', handleFileUpload, productController.addProduct);

// UPDATE products based on id from mysql database ...
productRouter.all('/update/:id([0-9]+)', handleFileUpload, productController.updateProduct);

// DELETE products from mysql database based on id /DELETE
productRouter.delete('/del/:id([0-9]+)', productController.deleteProductById);

module.exports = productRouter;
console.log('product router module is loading ...');
