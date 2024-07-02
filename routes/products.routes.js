/** Load express library/ third-party framework **/
const express = require('express');

/** Load Product related controllers **/
const productController = require('../controllers/products.controller');

/**  Middleware to handle file upload errors **/
const handleFileUpload = require('../middlewares/fileUpload.middleware');

/** Load user auth verify token custom middleware **/
const verifyUsrAuthToken = require('../middlewares/verifyUsrAuthToken.middleware');

/** Load user role verify custom middleware **/
const verifyUsrRole = require('../middlewares/verifyUserRole.middleware');

/** create a router service for products **/
const productRouter = express.Router();

/** Handles all products related routes/ API Endpoints **/


productRouter
    // GET all products list .... /GET Request // private route
    .get('/list', verifyUsrAuthToken, productController.listAllProducts)

    // GET product by id   /GET  // private route
    .get('/list/:id([0-9]+)', verifyUsrAuthToken, productController.getProductById)

    // GET products between the price range // private route
    .get('/limit/:st([0-9]+)/:en([0-9]+)', verifyUsrAuthToken, productController.getProductsInRange)

    // GET products by search query as keywords .... /GET 
    .get('/list/search', productController.searchProducts)

    // ADD new product to mysql database /POST  // Private Route // only Admin User Allowed
    .post('/add', verifyUsrAuthToken, verifyUsrRole, handleFileUpload, productController.addProduct)

    // UPDATE products based on id from mysql database ... // Private Route // only Admin User Allowed
    .all('/update/:id([0-9]+)', verifyUsrAuthToken, verifyUsrRole, handleFileUpload, productController.updateProduct)

    // DELETE products from mysql database based on id /DELETE // Private Route // only Admin User Allowed
    .delete('/del/:id([0-9]+)', verifyUsrAuthToken, verifyUsrRole, productController.deleteProductById)

    // export all products data into user's csv file which can be downloadable /GET ... // Private Route
    .get('/list/get-csv-products', verifyUsrAuthToken, productController.getDataToCsv);

module.exports = productRouter;
console.log('product router module is loading ...');
