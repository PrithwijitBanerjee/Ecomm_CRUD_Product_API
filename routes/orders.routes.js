/** Load express library/ third-party framework **/
const express = require('express');

/** Load order related controllers **/
const orderController = require('../controllers/orders.controller');

/** Create a router service for orders **/
const orderRouter = express.Router();

/** Handling all order related routes/ API Endpoints **/


orderRouter
    // Place a new order by customer /POST
    .post('/buy/:pro_id([0-9]+)/:user_id([0-9]+)', orderController.placeOrder)

    // View all orders details /GET orders 
    .get("/view", orderController.viewAllOrders)

    // View particular order by order :id  /GET order by :id
    .get("/view/:order_id([0-9]+)", orderController.viewParticularOrder)

    // Cancel order by order :id  /DELETE
    .delete("/cancel/:order_id([0-9]+)", orderController.cancelOrder)

    // export all orders data into user's csv file which can be downloadable  /GET ...
    .get("/view/get-csv-orders", orderController.getDataToCsv);


module.exports = orderRouter;
console.log("order router module is loading ...");