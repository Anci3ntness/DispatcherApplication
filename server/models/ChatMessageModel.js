const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");

const ChatMessage = sequelize.define(
    "ChatMessage",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        message: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    },
    {
        indexes: [
            {
                fields: ["ticketId"],
            },
            {
                fields: ["createdAt"],
            },
        ],
    }
);

module.exports = ChatMessage;
