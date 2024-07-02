/** Load express library/ third-party framework **/
const express = require('express');

/** Load the cors library/ third-party module/ external middleware  **/
const cors = require('cors');

/** load product related routes **/
const productsRoute = require('./routes/products.routes');

/** load user related routes **/
const usersRoute = require('./routes/users.routes');

/** load order related routes **/
const ordersRoute = require('./routes/orders.routes');

/** create an Instance of express **/
const app = express();

/** Disable CORS to tell the express server to share their API data to the trustable clients from different origin with different port no. e.g. => Angular, React or, Vue JS **/
app.use(cors({ origin: "http://localhost:5173" })); // specify the trustable frontend client origin with port no.

// use express.static built-in middleware to tell the express server to share server static resources to the client by http res and res pattern ...
app.use(express.static(__dirname + '/public/assests/'));

app.use(express.urlencoded({ extended: true })); // for web-clients, such as: Angular, React or, Vue ...

app.use(express.json()); // for mobile clients or hybrid clients ...

/** Basic Landing Page **/
app.get('/', (_, res) => {
    res.status(200).send("<h1 align='center'>Welcome to REST API</h1>");
});

/** Define all product related routes **/
app.use(`${process.env.API_URL}/products`, productsRoute);

/** Define all user related routes **/
app.use(`${process.env.API_URL}/users`, usersRoute);

/** Define all order related routes **/
app.use(`${process.env.API_URL}/products/order`, ordersRoute);

/** use Route Not Found error middleware**/
app.get((req, res, next) => {
    res.status(404).send("<h2 align='center'>(404) Page Not Found</h2>");
});

/** use custom error handling middleware**/
app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error); // if headers are already sent, delegate to the default Express error handler
    }
    res.status(500).json({err: true, message: error.message });
});

module.exports = app;