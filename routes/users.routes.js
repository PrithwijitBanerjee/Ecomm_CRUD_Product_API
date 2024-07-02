/** Load express library/ third-party framework **/
const express = require('express');

/** Load user related controllers **/
const userControllers = require('../controllers/users.controller');

/** Load user auth verify token custom middleware **/
const verifyUsrAuthToken = require('../middlewares/verifyUsrAuthToken.middleware');

/** Load user role verify custom middleware **/
const verifyUsrRole = require('../middlewares/verifyUserRole.middleware');

/** create a router service for users **/
const usersRouter = express.Router();

/** Handles all users related routes or, API endpoints **/


usersRouter
    // GET all users  /GET // Private route // Only Admin use can access this route
    .get("/list", verifyUsrAuthToken, verifyUsrRole, userControllers.getAllUsers)

    // POST sign-up new user /POST // Public API (Anyone Can Access It)
    .post('/signUp', userControllers.signUpUser)

    // POST sign-in new user /POST // Public API (Anyone Can Access It)
    .post('/signIn', userControllers.signInUser)

    // DELETE user by :id  /DELETE // Private route // Only Admin use can access this route
    .delete('/del/:id([0-9]+)', verifyUsrAuthToken, verifyUsrRole, userControllers.delUsr)

    // PUT || PATCH update user by :id     /PUT || /PATCH  // Private route // Only Admin use can access this route
    .all("/edit/:id([0-9]+)", verifyUsrAuthToken, verifyUsrRole, userControllers.updateUsr)

    // export all users data into user's csv file which can be downloadable  /GET ... // Private route // Only Admin use can access this route
    .get('/list/get-csv-users', verifyUsrAuthToken, verifyUsrRole, userControllers.getDataToCsv);

module.exports = usersRouter;
console.log("users router is loading ...");