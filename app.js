/** Load express library/ third-party framework **/
const express = require('express');

/** load product related routes **/
const productsRoute = require('./routes/products.routes');

/** create an Instance of express **/
const app = express();

// use express.static middleware to tell the express server to share server static resources to the client by http res and res pattern ...
app.use(express.static(__dirname + '/public/assests/'));

app.use(express.urlencoded({ extended: true })); // for web-clients ...

app.use(express.json()); // for mobile clients or hybrid clients ...

/** Basic Landing Page **/
app.get('/', (_, res) => {
    res.status(200).send("<h1 align='center'>Welcome to REST API</h1>");
});

/** Define all product related routes **/
app.use(`${process.env.API_URL}/products`, productsRoute);

/** use Route Not Found error middleware**/
app.get((req, res, next) => {
    res.status(404).send("<h2 align='center'>(404) Page Not Found</h2>");
});

/** use error handling middleware**/
app.get((error, req, res, next) => {
    if (error) res.status(500).send("<h2 align='center'>Something Went Wrong !!!</h2>");
})

module.exports = app;