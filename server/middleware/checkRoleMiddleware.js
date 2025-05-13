const jwt = require("jsonwebtoken");
const ApiError = require("../utility/apiError.js");

function roleHandler(role) {
    return (req, res, next) => {
        if (req.method === "OPTIONS") {
            next();
        }
        try {
            const token = req.headers.authorization.split(" ")[1]; // Bearer, token
            if (!token) {
                next(new ApiError.unauth("Пользователь не авторизован"));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
            if (decoded.role !== role) {
                next(new ApiError.forbidden("Отказано в доступе"));
            }
            next();
        } catch (e) {
            next(new ApiError.unauth("Пользователь не авторизован"));
        }
    };
}
module.exports = roleHandler;
