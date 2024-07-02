/** Load users related models **/
const model = require('../models/users.models');

/** Load bcryptjs external module for password hashing **/
const bcryptjs = require('bcryptjs');

/** Load jsonwebtoken external module for generating random token in token based authentication **/
const jwt = require('jsonwebtoken');

/** Load fs core module in node js **/
const fs = require('node:fs');

/** Load custom validation of email, phoneNo, and password **/
const { validateEmail, validatePassword, validatePhoneNumber } = require('../helpers/customValidation');

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

// POST Sign-Up new user /POST
controller.signUpUser = (req, res) => {
    const { name, email, phoneNo, age, password, security_answer, role } = req.body;
    if (name && email && phoneNo && age && password && security_answer && role) {
        if (!validateEmail(email)) {
            return res.status(400).json({
                success: false,
                message: "SignUp Failed, Invalid Email Format !!!"
            });
        }

        if (!validatePhoneNumber(phoneNo)) {
            return res.status(400).json({
                success: false,
                message: "SignUp Failed, Invalid Phone Number Format !!!"
            });
        }

        if (!validatePassword(password)) {
            return res.status(400).json({
                success: false,
                message: "SignUp Failed, Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character !!!"
            });
        }
        
        const salt = bcryptjs.genSaltSync(10);
        const hashPass = bcryptjs.hashSync(password, salt); // convert the original password into hash password ...
        model.addUsr([name, email, phoneNo, age, hashPass, security_answer, role], (error, results) => {
            if (error) {
                if (!res.headersSent) {
                    res.status(400).send({
                        success: false,
                        message: `User Sign-Up Failed, ${error?.sqlMessage}`
                    });
                }
            } else {
                if (results.affectedRows !== 0) {
                    if (!res.headersSent) {
                        res.status(201).json({
                            success: true,
                            message: "User Sign-Up successfully"
                        });
                    }
                } else {
                    if (!res.headersSent) {
                        res.status(400).json({
                            success: false,
                            message: "User Sign-Up Failed !!!"
                        });
                    }
                }
            }
        })
    } else {
        if (!res.headersSent) {
            res.status(400).json({
                success: false,
                message: "SignUp Failed, Invalid Client Request !!!"
            });
        }
    }
};

// POST Sign-Up new user /POST
controller.signInUser = (req, res) => {
    const { email, password } = req.body;
    if (email && password) {
        model.signInUsr([email], (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (results?.length !== 0) {
                    if (bcryptjs.compareSync(password, results[0].password)) { //comparing the password
                        jwt.sign({
                            email: results[0].email,
                            role: results[0].role
                        }, process.env.SECRET_KEY, {
                            expiresIn: '1m'
                        }, function (err, token) {
                            if (err) {
                                console.log(err);
                                res.status(500).json({
                                    success: false,
                                    message: 'Token generation failed !!!'
                                });
                            } else {
                                res.status(200).json({
                                    success: true,
                                    message: 'User Signed In successfully',
                                    data: results[0],
                                    _token: token,
                                });
                            }
                        });
                    } else {
                        res.status(401).json({
                            success: false,
                            message: 'Sign-In Failed, Password does not match !!!'
                        });
                    }
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'User email doesn\'t exist, please try with different mail Id ....'
                    });
                }
            }
        });
    } else {
        res.status(400).json({
            success: false,
            message: 'User Sign-In Failed, Please fill all the fields properly !!!'
        });
    }
}

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