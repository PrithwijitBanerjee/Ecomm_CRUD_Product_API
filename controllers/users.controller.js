/** Load users related models **/
const model = require('../models/users.models');

/** Load fs core module in node js **/
const fs = require('node:fs');

/** Load user related models **/
const userModels = require("../models/users.models");

/** Load json2csv external module to convert json data to csv(comma-seperated-value) data **/
const json2csv = require('json2csv');

// Controller Object -- Module scaffolding
const controller = {};


// GET all users  /GET
controller.getAllUsers = (_, res) => {
    userModels.getAllUsers((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            res.status(200).json({
                success: true,
                users: results
            });
        }
    });
};

// POST add new user /POST
controller.addUser = (req, res) => {
    const { name, email, phoneNo, age } = req.body;
    if (name && email && phoneNo && age) {
        model.addUsr([name, email, phoneNo, age], (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (results.affectedRows !== 0) {
                    res.status(201).json({
                        success: true,
                        message: "User has been added successfully"
                    });
                } else {
                    res.status(400).json({
                        success: false,
                        message: "You have a problem in your request !!!"
                    });
                }
            }
        })
    } else {
        res.status(400).json({
            success: false,
            message: "Invalid Client Request !!!"
        });
    }
};

// PUT || PATCH update user by :id     /PUT || /PATCH
controller.updateUsr = (req, res) => {
    const _uId = +req.params.id;
    const { name, email, phoneNo, age } = req.body;
    if (req.method === "PUT" || req.method === "PATCH") {
        if (req.method === "PUT") {
            if (name && email && phoneNo && age && _uId) {
                model.updateUsr([name, email, phoneNo, age, _uId], (error, results) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        if (results.affectedRows !== 0) {
                            res.status(200).json({
                                success: true,
                                message: "User has been updated successfully"
                            });
                        } else {
                            res.status(404).json({
                                success: false,
                                message: "Updation Failed, User of given id does not exist !!!"
                            });
                        }
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Updation Failed, Invalid Client Request !!!"
                });
            }
        } else {
            const fieldsToUpdate = {};
            if (name) fieldsToUpdate.name = name;
            if (email) fieldsToUpdate.email = email;
            if (phoneNo) fieldsToUpdate.phoneNo = phoneNo;
            if (age) fieldsToUpdate.age = age;
            if (Object.keys(fieldsToUpdate).length > 0) {
                model.patchUpdate(fieldsToUpdate, (error, results) => {
                    if (error) {
                        res.status(500).send(error);
                    } else {
                        if (results.affectedRows !== 0) {
                            res.status(200).json({
                                success: true,
                                message: "User has been updated successfully"
                            });
                        } else {
                            res.status(404).json({
                                success: false,
                                message: "Updation Failed, User of given id does not exist !!!"
                            });
                        }
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Updation Failed, You need to select atleast one field !!!"
                });
            }
        }
    } else {
        res.status(405).json({
            success: false,
            message: `${req.method} method is not allowed !!!`
        });
    }
};

// DELETE user by :id  /DELETE 
controller.delUsr = (req, res) => {
    const _uId = +req.params.id;
    model.delUsr([_uId], (error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            if (results.affectedRows !== 0) {
                res.status(200).json({
                    success: true,
                    message: "User has been deleted successfully"
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Deletion Failed, User of given id does not exist !!!"
                });
            }
        }
    });
};

// export all users data into csv files as csv format ...
controller.getDataToCsv = (req, res) => {
    userModels.getAllUsers((error, results) => {
        if (error) {
            res.status(500).send(error);
        } else {
            const json2csvParser = new json2csv.Parser();
            const csvData = json2csvParser.parse(results);
            fs.writeFile(__dirname + '/../csv_files/users.csv', csvData, (err) => {
                if (err) throw new Error(err);
                else {
                    res.attachment("users.csv"); // to tell express server the csv file should be downloadable in client's machine ....
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