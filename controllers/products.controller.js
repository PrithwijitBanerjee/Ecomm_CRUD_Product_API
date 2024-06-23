const fs = require('node:fs');
const path = require('node:path');
const ProductModel = require('../models/products.models');

const ProductController = {
    listAllProducts: (_, res) => {
        ProductModel.listAllProducts((error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).json({
                    success: true,
                    products: results
                });
            }
        });
    },

    getProductById: (req, res) => {
        const _pId = +req.params.id;
        ProductModel.getProductById(_pId, (error, results) => {
            if (error) {
                res.status(500).send(error);
            } else {
                if (!results?.length) {
                    res.status(404).json({
                        success: false,
                        message: 'Product of given id does not exist !!!',
                        product: null
                    });
                } else {
                    res.status(200).json({
                        success: true,
                        product: results[0]
                    });
                }
            }
        });
    },

    getProductsInRange: (req, res) => {
        const start = +req.params.st;
        const end = +req.params.en;
        if (start <= end) {
            ProductModel.getProductsInRange(start, end, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    if (!results.length) {
                        res.status(404).json({
                            success: false,
                            message: 'No Products found within the given range !!!',
                            products: results
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            products: results
                        });
                    }
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Lower limit always should be less than Upper limit !!!'
            });
        }
    },

    searchProducts: (req, res) => {
        const keywords = req.query.keywords.toLowerCase();
        if (keywords.length !== 0) {
            const searchedTerm = `%${keywords}%`;
            ProductModel.searchProducts(searchedTerm, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    if (!results.length) {
                        res.status(404).json({
                            success: false,
                            message: 'No Products available !!!',
                            products: results
                        });
                    } else {
                        res.status(200).json({
                            success: true,
                            products: results
                        });
                    }
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid Client Request !!!'
            });
        }
    },

    addProduct: (req, res) => {
        const baseUrl = process.env.BASE_URL;
        const { pro_name, pro_desc, pro_price, pro_brand } = req.body;
        if (pro_name && pro_price && pro_desc && pro_brand && req.file) {
            const img_url = `${baseUrl}:${process.env.PORT}/products/${req.file.filename}`;
            const productData = [pro_name, pro_desc, pro_price, pro_brand, img_url];
            ProductModel.addProduct(productData, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    if (results.affectedRows !== 0) {
                        res.status(200).json({
                            success: true,
                            message: 'User added successfully !!!',
                            user: {
                                pro_name,
                                pro_desc,
                                pro_price,
                                pro_brand,
                                pro_image: img_url
                            },
                            results
                        });
                    } else {
                        res.status(400).json({
                            success: false,
                            message: 'Invalid Client Request !!!'
                        });
                    }
                }
            });
        } else {
            res.status(400).json({
                success: false,
                message: 'Invalid Client Request !!!'
            });
        }
    },

    updateProduct: (req, res) => {
        if (req.method === 'PUT' || req.method === 'PATCH') {
            const _pId = +req.params.id;
            const baseUrl = process.env.BASE_URL;
            const { pro_name, pro_desc, pro_price, pro_brand } = req.body;

            ProductModel.getProductImageById(_pId, (error, results) => {
                if (error) {
                    res.status(500).send(error);
                } else {
                    const oldImagePath = results[0]?.pro_image ? __dirname + `/../public/assests/products/${path.basename(results[0].pro_image)}` : null;

                    const unlinkOldImage = (callback) => {
                        if (oldImagePath) {
                            fs.unlink(oldImagePath, callback);
                        } else {
                            callback();
                        }
                    };

                    const img_url = req.file ? `${baseUrl}:${process.env.PORT}/products/${req.file.filename}` : null;

                    if (req.method === 'PUT') {
                        if (pro_name && pro_desc && pro_price && pro_brand && req.file && _pId) {
                            const productData = { pro_name, pro_desc, pro_price, pro_brand, img_url, id: _pId };

                            unlinkOldImage((err2) => {
                                if (err2) {
                                    console.log(err2);
                                }

                                ProductModel.updateProduct(productData, (err3, results) => {
                                    if (err3) {
                                        res.status(500).send(err3);
                                    } else {
                                        if (results.affectedRows !== 0) {
                                            res.status(200).json({
                                                success: true,
                                                message: 'User of given id has been updated successfully',
                                            });
                                        } else {
                                            res.status(400).json({
                                                success: false,
                                                message: 'Updation Failed, Invalid Client Request !!!'
                                            });
                                        }
                                    }
                                });
                            });
                        } else {
                            res.status(400).json({
                                success: false,
                                message: 'Updation Failed, Invalid Client Request !!!'
                            });
                        }
                    }

                    if (req.method === 'PATCH') {
                        const fieldsToUpdate = {};
                        if (pro_name) fieldsToUpdate.pro_name = pro_name;
                        if (pro_desc) fieldsToUpdate.pro_desc = pro_desc;
                        if (pro_price) fieldsToUpdate.pro_price = pro_price;
                        if (pro_brand) fieldsToUpdate.pro_brand = pro_brand;
                        if (req.file) fieldsToUpdate.pro_image = img_url;

                        unlinkOldImage((myErr) => {
                            if (myErr) {
                                console.log(myErr);
                            }

                            if (Object.keys(fieldsToUpdate).length > 0 && _pId) {
                                let SQL = "UPDATE ecommDb.products SET ";
                                let queryParams = [];
                                Object.keys(fieldsToUpdate).forEach((field, index) => {
                                    SQL += `${field}=?`;
                                    if (index < Object.keys(fieldsToUpdate).length - 1) SQL += ', ';
                                    queryParams.push(fieldsToUpdate[field]);
                                });
                                SQL += ' WHERE _id=?';
                                queryParams.push(_pId);

                                ProductModel.partialUpdateProduct(SQL, queryParams, (error, results) => {
                                    if (error) {
                                        res.status(500).send(error);
                                    } else {
                                        if (results.affectedRows !== 0) {
                                            res.status(200).json({
                                                success: true,
                                                message: 'User of given id has been updated successfully',
                                            });
                                        } else {
                                            res.status(400).json({
                                                success: false,
                                                message: 'Updation Failed, Product does not exist !!!'
                                            });
                                        }
                                    }
                                });
                            } else {
                                res.status(400).json({
                                    success: false,
                                    message: 'Update Failed, Invalid Client Request!'
                                });
                            }
                        });
                    }
                }
            });
        } else {
            res.status(405).json({
                success: false,
                message: `${req.method} method not allowed !!!`
            });
        }
    },

    deleteProductById: (req, res) => {
        const _pId = +req.params.id;

        ProductModel.getProductImageById(_pId, (error, result) => {
            if (error) {
                res.status(500).send(error);
            } else {
                const oldImagePath = result[0]?.pro_image ? __dirname + `/../public/assests/products/${path.basename(result[0].pro_image)}` : null;

                const unlinkOldImage = (callback) => {
                    if (oldImagePath) {
                        fs.unlink(oldImagePath, callback);
                    } else {
                        callback();
                    }
                };

                unlinkOldImage((err2) => {
                    if (err2) {
                        console.log(err2);
                    }

                    ProductModel.deleteProductById(_pId, (err3, results) => {
                        if (err3) {
                            res.status(500).send(err3);
                        } else {
                            if (results.affectedRows !== 0) {
                                res.status(200).json({
                                    success: true,
                                    message: 'User of given id has been deleted successfully',
                                });
                            } else {
                                res.status(400).json({
                                    success: false,
                                    message: 'Deletion Failed, Product does not exist !!!'
                                });
                            }
                        }
                    });
                });
            }
        });
    }
};

module.exports = ProductController;
