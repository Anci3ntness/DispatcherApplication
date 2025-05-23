const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USER, process.env.DATABASE_PASS, {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.DATABASE_HOST,
    logging: false,
    pool: {
        max: 20,
        min: 5,
        acquire: 30000,
        idle: 10000,
    },
});

sequelize
    .authenticate()
    .then(() => console.log("Подключение к Postgres успешно"))
    .catch(err => console.error("Ошибка подключения к Postgres:", err));

module.exports = sequelize;
