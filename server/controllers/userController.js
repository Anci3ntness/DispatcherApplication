const ApiError = require("../utility/apiError.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User, TicketAssignment } = require("../models");
const { v4 } = require("uuid");
const { USER_ROLES } = require("../utility/constants.js");
const { Op, Sequelize } = require("sequelize");
function jwtGenerate(id, email, role) {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, { expiresIn: "24h" });
}

class userController {
    async registration(req, res, next) {
        const { email, password, role = USER_ROLES.user } = req.body;
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

        const user = await User.create({ id: v4(), name: email, email, role, passwordHash: hashPass });

        if (!user) return next(ApiError.internal("Произошла непредвиденная ошибка. Попробуйте повторить запрос."));
        const token = jwtGenerate(user.id, user.email, user.role);

        return res.json({ token: token, data: { name: user.name, createdAt: user.createdAt } });
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
        return res.json({ token: token, data: { name: user.name, createdAt: user.createdAt } });
    }
    async updateRole(req, res, next) {
        const { id, role } = req.body;
        if (!id || !role) {
            return next(ApiError.badRequest("Некорректный запрос"));
        }
        const user = await User.findByPk(id);
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден"));
        }
        user.role = role;
        const updatedUser = await user.save();
        if (!updatedUser)
            return next(ApiError.internal("Произошла непредвиденная ошибка. Попробуйте повторить запрос."));

        return res.json(updatedUser);
    }
    async auth(req, res, next) {
        const user = await User.findOne({ where: { id: req.user.id } });
        if (!user) return next(ApiError.badRequest("Пользователь не найден"));
        const token = jwtGenerate(req.user.id, req.user.email, req.user.role);
        return res.json({ token: token, data: { name: user.name, createdAt: user.createdAt } });
    }
    async getAll(req, res, next) {
        const users = await User.findAll();
        return res.json(users);
    }
    async getAllPerformers(req, res, next) {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.notIn]: Sequelize.literal('(SELECT DISTINCT "specialistId" FROM "TicketAssignments")'),
                },
                role: USER_ROLES.PERFORMER,
            },
        });
        return res.json(users);
    }
}
module.exports = new userController();
