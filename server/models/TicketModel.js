const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");
const { TICKET_MAIN_STATUSES } = require("../utility/constants.js");

const Ticket = sequelize.define("Ticket", {
    topic: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(Object.values(TICKET_MAIN_STATUSES).toString()),
        defaultValue: TICKET_MAIN_STATUSES.NEW,
    },
});

module.exports = Ticket;
