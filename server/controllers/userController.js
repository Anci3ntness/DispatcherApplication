const ApiError = require("../utility/apiError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");

function jwtGenerate(id, email, role) {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

class userController {
    async registration(req, res, next) {
        const { email, password, role } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный логин или пароль"));
        }
        if (email.length > 50 || email.length < 5 || password.length < 5 || password.length > 50) {
            return next(ApiError.badRequest("Неверная длина логина или пароля"));
        }
        const candidate = await User.findOne({ where: { email } });
        if (candidate) {
            return next(ApiError.badRequest("Пользователь с таким именем уже существует"));
        }
        const hashPass = await bcrypt.hash(password, 5);
        const user = await User.create({ email, role, passwordHash: hashPass });
        const token = jwtGenerate(user.id, user.email, user.role);
        return res.json({ token: token });
    }
    async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(ApiError.badRequest("Некорректный логин или пароль"));
        }
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден"));
        }
        let comparePass = bcrypt.compareSync(password, user.passwordHash);
        if (!comparePass) {
            return next(ApiError.badRequest("Неверный пароль"));
        }
        const token = jwtGenerate(user.id, user.email, user.role);
        return res.json({ token: token });
    }
    async auth(req, res, next) {
        const token = jwtGenerate(req.user.id, req.user.email, req.user.role);
        return res.json({ token: token });
    }
}
module.exports = new userController();
