/** Load express library/ third-party framework **/
const express = require('express');

/** Load user related controllers **/
const userControllers = require('../controllers/users.controller');

/** create a router service for users **/
const usersRouter = express.Router();

/** Handles all users related routes or, API endpoints **/


usersRouter
    // GET all users  /GET
    .get("/list", userControllers.getAllUsers)

    // POST add new user /POST
    .post('/add', userControllers.addUser)

    // DELETE user by :id  /DELETE 
    .delete('/del/:id([0-9]+)', userControllers.delUsr)

    // PUT || PATCH update user by :id     /PUT || /PATCH
    .all("/edit/:id([0-9]+)", userControllers.updateUsr)

    // export all users data into user's csv file which can be downloadable  /GET ...
    .get('/list/get-csv-users', userControllers.getDataToCsv);

module.exports = usersRouter;
console.log("users router is loading ...");