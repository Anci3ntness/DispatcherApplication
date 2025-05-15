const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");

const TicketStatusHistory = sequelize.define("TicketStatusHistory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    oldStatus: {
        type: DataTypes.STRING,
    },
    newStatus: {
        type: DataTypes.STRING,
    },
});

module.exports = TicketStatusHistory;
