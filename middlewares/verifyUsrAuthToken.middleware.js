/** Load jsonwebtoken external module **/
const jwt = require('jsonwebtoken');

// Define custom user auth midleware for verify the auth token ...
const verifyUserAuthToken = (req, res, next) => {
    const bearerHeaderToken = typeof (req.headers['_token']) !== 'undefined' ? req.headers['_token'].split(' ')[1] : false;
    if (bearerHeaderToken) {
        jwt.verify(bearerHeaderToken, process.env.SECRET_KEY, (err, userData) => {
            if (err) {
                res.status(401).json({
                    success: false,
                    error: err
                });
            } else {
                next(); // calling the next middleware ...
            }
        });
    } else {
        if (!res.headersSent) {
            return res.status(401).json({
                success: false,
                message: 'User Authentication Failed, Token is needed in header !!!'
            });
        }
    }
}

module.exports = verifyUserAuthToken;