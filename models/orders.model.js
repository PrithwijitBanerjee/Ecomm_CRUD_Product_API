/** Load connection object of node and mysql **/
const conn = require('../db/db_connect');

// Model object -- module scaffolding
const model = {};

// Place a new order by customer /POST
model.placeOrder = (data, cb) => {
    const SQL = "INSERT INTO ecommDb.orders (_pId, _uId) values (?, ?)";
    conn.query(SQL, data, cb);
};

// View all orders details /GET orders 
model.viewAllOrders = cb => {
    const SQL = "SELECT o._id as order_id, p.pro_name, p.pro_desc, u.name, u.email, u.phoneNo, o.order_at from ecommDb.orders o INNER JOIN ecommDb.products p ON p._id = o._pId INNER JOIN ecommDb.users u ON u._id = o._uId";
    conn.query(SQL, cb);
};

// View particular order by order :id  /GET order by :id
model.viewParticularOrder = (data, cb) => {
    const SQL = "SELECT o._id, p.pro_name, p.pro_desc, u.name, u.email, u.phoneNo, o.order_at from ecommDb.orders o INNER JOIN ecommDb.products p ON p._id = o._pId INNER JOIN ecommDb.users u ON u._id = o._uId WHERE o._id=?";
    conn.query(SQL, data, cb);
};

// Cancel order by order :id  /DELETE
model.cancelOrder = (data, cb) => {
    const SQL = "DELETE from ecommDb.orders WHERE _id=?";
    conn.query(SQL, data, cb);
};

// Exporting the module ...
module.exports = model;
console.log("order model is loading ...");