const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");

const TicketStatusHistory = sequelize.define("TicketStatusHistory", {
    oldStatus: {
        type: DataTypes.STRING,
    },
    newStatus: {
        type: DataTypes.STRING,
    },
    changedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
});

module.exports = TicketStatusHistory;
