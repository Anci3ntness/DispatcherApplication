const jwt = require("jsonwebtoken");
const ApiError = require("../utility/apiError.js");

function authHandler(req, res, next) {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(" ")[1]; // Bearer, token
        if (!token) {
            next(ApiError.unauth("Пользователь не авторизован"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (e) {
        next(ApiError.unauth("Пользователь не авторизован"));
    }
}
module.exports = authHandler;
