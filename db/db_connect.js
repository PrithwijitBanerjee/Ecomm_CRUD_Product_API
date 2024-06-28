/** load mysql driver for connect nodejs with mysql db **/
const mysql = require('mysql');

/** Establish a connection string between Express server with mysql db **/
const conn = mysql.createConnection({
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS
});

/** verify whether the mysql is properly connected with node js or not  **/
conn.connect((error) => {
    if (error) throw error;
    else {
        console.log('mysql db connected successfully !!!');
    }
});

module.exports = conn;
console.log('conn object module is loading ...');