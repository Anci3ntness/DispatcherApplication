const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: process.env.DATABASE_DIALECT,
    storage: process.env.DATABASE_STORAGE,
    logging: false,
});

module.exports = sequelize;
