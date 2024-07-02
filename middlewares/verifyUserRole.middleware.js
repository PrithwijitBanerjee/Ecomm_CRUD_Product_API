/** Load jsonwebtoken external module **/
const jwt = require('jsonwebtoken');

// custom user defined middleware to chaeck user role ...
const verifyUserRole = (req, res, next) => {
    const bearerHeaderToken = typeof (req.headers['_token']) !== 'undefined' ? req.headers['_token'].split(' ')[1] : false;
    jwt.verify(bearerHeaderToken, process.env.SECRET_KEY, (error, userData) => {
        if (error) {
            return res.status(401).json({
                success: false,
                error
            });
        } else {
            if (userData?.role?.toLowerCase() === "admin user") {
                next();
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Forbidden: only Admin role can access this resource !!!'
                });
            }
        }
    });

}

module.exports = verifyUserRole;