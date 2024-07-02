/** Load express library/ third-party framework **/
const express = require('express');

/** Load order related controllers **/
const orderController = require('../controllers/orders.controller');

/** Load user auth verify token custom middleware **/
const verifyUsrAuthToken = require('../middlewares/verifyUsrAuthToken.middleware');

/** Load user role verify custom middleware **/
const verifyUsrRole = require('../middlewares/verifyUserRole.middleware');

/** Create a router service for orders **/
const orderRouter = express.Router();

/** Handling all order related routes/ API Endpoints **/


orderRouter
    // Place a new order by customer /POST // Private Route
    .post('/buy/:pro_id([0-9]+)/:user_id([0-9]+)', verifyUsrAuthToken, orderController.placeOrder)

    // View all orders details /GET orders // Private Route // Only Admin user can access this route ...
    .get("/view", verifyUsrAuthToken, verifyUsrRole, orderController.viewAllOrders)

    // View particular order by order :id  /GET order by :id // Private Route
    .get("/view/:order_id([0-9]+)", verifyUsrAuthToken, orderController.viewParticularOrder)

    // Cancel order by order :id  /DELETE // Private Route
    .delete("/cancel/:order_id([0-9]+)", verifyUsrAuthToken, orderController.cancelOrder)

    // export all orders data into user's csv file which can be downloadable  /GET ... // Private Route // Only Admin user can access this route ...
    .get("/view/get-csv-orders", verifyUsrAuthToken, verifyUsrRole, orderController.getDataToCsv);


module.exports = orderRouter;
console.log("order router module is loading ...");