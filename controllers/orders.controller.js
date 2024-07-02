/** Load order related models **/
const orderModel = require('../models/orders.model');

/** Load fs core module in node js **/
const fs = require('node:fs');

/** Load json2csv external module to convert json data to csv(comma-seperated-value) data **/
const json2csv = require('json2csv');

// Controller object -- module scaffolding
const controller = {};

// Place a new order by customer /POST
controller.placeOrder = (req, res) => {
    const _pId = +req.params.pro_id;
    const _uId = +req.params.user_id;
    orderModel.placeOrder([_pId, _uId], (error, results) => {
        if (error) {
            res.status(404).json({
                success: false,
                message: "Customer or, Product of given id doesn't exist !!!"
            });
        } else {
            if (results.affectedRows !== 0) {
                res.status(201).json({
                    success: true,
                    message: "Dear Customer Your Order has been placed successfully",
                    results
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Order not placed, Client Error !!!"
                });
            }
        }
    });
};

// View all orders details /GET orders 
controller.viewAllOrders = (_, res) => {
    orderModel.viewAllOrders((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            if (results?.length !== 0) {
                res.status(200).json({
                    success: true,
                    orders_info: results
                });
            } else {
                res.status(200).json({
                    success: true,
                    orders_info: null
                });
            }
        }
    });
};

// View particular order by order :id  /GET order by :id
controller.viewParticularOrder = (req, res) => {
    const _oId = +req.params.order_id;
    orderModel.viewParticularOrder([_oId], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).json({
                success: true,
                order_info: results.length !== 0 ? results[0] : null
            });
        }
    });
};

// Cancel order by order :id  /DELETE
controller.cancelOrder = (req, res) => {
    const _oId = +req.params.order_id;
    orderModel.cancelOrder([_oId], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            if (results.affectedRows !== 0) {
                res.status(200).json({
                    success: true,
                    message: "Dear Customer Your Order has been cancelled successfully",
                    results
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Order Cancellation Failed, order id doesn't exist !!!"
                });
            }
        }
    });
};

// export all orders data into csv files as csv format ...
controller.getDataToCsv = (_, res) => {
    orderModel.viewAllOrders((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            const json2csvParser = new json2csv.Parser();
            const csvData = json2csvParser.parse(results);
            fs.writeFile(__dirname + '/../csv_files/orders.csv', csvData, (err) => {
                if (err) throw new Error(err);
                else {
                    res.attachment("orders.csv"); // to tell express server the csv file should be downloadable in client's machine ....
                    if (!res.headersSent) {
                        res.status(200).send(csvData);
                    }
                }
            });
        }
    });
}

// Exporting the module ...
module.exports = controller;
console.log("order controller is loading ...");


