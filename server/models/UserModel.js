const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");
const { USER_ROLES } = require("../utility/constants.js");

const User = sequelize.define("User", {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM(Object.values(USER_ROLES).toString()),
        allowNull: false,
        defaultValue: USER_ROLES.USER,
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = User;
