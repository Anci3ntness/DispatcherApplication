const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");

const ChatMessage = sequelize.define("ChatMessage", {
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
});

module.exports = ChatMessage;
