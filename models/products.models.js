/** Load connection object of node and mysql **/
const conn = require('../db/db_connect');

const ProductModel = {
    listAllProducts: (callback) => {
        const query = 'SELECT * FROM ecommDB.products';
        conn.query(query, callback);
    },

    getProductById: (id, callback) => {
        const query = 'SELECT * FROM ecommDB.products WHERE _id=?';
        conn.query(query, [id], callback);
    },

    getProductsInRange: (start, end, callback) => {
        const query = 'SELECT * FROM ecommDb.products WHERE pro_price BETWEEN ? AND ? ORDER BY pro_price';
        conn.query(query, [start, end], callback);
    },

    searchProducts: (searchedTerm, callback) => {
        const query = 'SELECT * FROM ecommDb.products WHERE pro_desc LIKE ? ORDER BY pro_price';
        conn.query(query, [searchedTerm], callback);
    },

    addProduct: (productData, callback) => {
        const query = 'INSERT INTO ecommDb.products(pro_name, pro_desc, pro_price, pro_brand, pro_image) VALUES (?, ?, ?, ?, ?)';
        conn.query(query, productData, callback);
    },

    updateProduct: (productData, callback) => {
        const { pro_name, pro_desc, pro_price, pro_brand, img_url, id } = productData;
        const query = 'UPDATE ecommDb.products SET pro_name=?, pro_desc=?, pro_price=?, pro_brand=?, pro_image=? WHERE _id=?';
        conn.query(query, [pro_name, pro_desc, pro_price, pro_brand, img_url, id], callback);
    },

    partialUpdateProduct: (SQL, queryParams, callback) => {
        conn.query(SQL, queryParams, callback);
    },

    deleteProductById: (id, callback) => {
        const query = 'DELETE FROM ecommDb.products WHERE _id=?';
        conn.query(query, [id], callback);
    },

    getProductImageById: (id, callback) => {
        const query = 'SELECT pro_image FROM ecommDb.products WHERE _id=?';
        conn.query(query, [id], callback);
    }
};

module.exports = ProductModel;
