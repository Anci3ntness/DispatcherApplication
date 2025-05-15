const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");
const { TICKET_MAIN_STATUSES } = require("../utility/constants.js");

const Ticket = sequelize.define("Ticket", {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    topic: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    address: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM(),
        values: Object.values(TICKET_MAIN_STATUSES),
        defaultValue: TICKET_MAIN_STATUSES.NEW,
    },
});

module.exports = Ticket;
