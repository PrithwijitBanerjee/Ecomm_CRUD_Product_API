/** Load connection object of node and mysql **/
const conn = require('../db/db_connect');

// Model object -- module scaffolding
const model = {};

model.getAllUsers = cb => {
    const SQL = "SELECT * from ecommDb.users";
    conn.query(SQL, cb);
}

model.addUsr = (data, cb) => {
    const SQL = "INSERT INTO ecommDb.users (name, email, phoneNo, age, password, security_answer, role) values (?, ?, ?, ?, ?, ?, ?)";
    conn.query(SQL, data, cb);
}
model.signInUsr = (data, cb) => {
    const SQL = "SELECT * FROM ecommDb.users WHERE email=?";
    conn.query(SQL, data, cb);
}
model.updateUsr = (data, cb) => {
    const SQL = "UPDATE ecommDb.users SET name=?, email=?, phoneNo=?, age=? WHERE _id=?";
    conn.query(SQL, data, cb);
}

model.patchUpdate = (data, cb) => {
    let SQL = "UPDATE ecommDb.users SET ";
    const queryParams = [];
    Object.keys(data).forEach((field, index) => {
        SQL += `${field}=?`;
        if (index < Object.keys(fieldsToUpdate).length - 1) SQL += ", ";
        queryParams.push(fieldsToUpdate[field]);
    });
    SQL += " WHERE _id=?";
    queryParams.push(_uId);
    conn.query(SQL, queryParams, cb);
}

model.delUsr = (data, cb) => {
    const SQL = "DELETE from ecommDb.users WHERE _id=?";
    conn.query(SQL, data, cb);
}

// Exporting the module ...
module.exports = model;