const jwt = require("jsonwebtoken");
const ApiError = require("../utility/apiError.js");
const User = require("../models/UserModel.js");

function checkHandler(...roles) {
    return async (req, res, next) => {
        if (req.method === "OPTIONS") {
            return next();
        }
        try {
            const token = req.headers.authorization.split(" ")[1]; // Bearer, token

            if (!token) {
                return next(ApiError.unauth("Пользователь не авторизован"));
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findByPk(decoded?.id);
            req.user = decoded;
            if (user.role !== decoded.role) return next(ApiError.forbidden("Отказано в доступе"));

            if (![...roles].includes(decoded.role)) {
                return next(ApiError.forbidden("Отказано в доступе"));
            }

            return next();
        } catch (e) {
            return next(ApiError.unauth("Пользователь не авторизован"));
        }
    };
}
module.exports = checkHandler;
