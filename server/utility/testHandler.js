require("dotenv").config();
const { ChatMessage, sequelize } = require("../models");

module.exports = {
    teardown: async function (context, events) {
        try {
            const result = await ChatMessage.destroy({ where: { message: "Тестовое сообщение" } });
            console.log(`Удалено тестовых сообщений: ${result}`);
        } catch (err) {
            console.error("Ошибка очистки БД:", err.message);
        } finally {
            await sequelize.close();
        }
    },
};
