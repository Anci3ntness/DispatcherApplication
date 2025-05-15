const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");
const { TICKET_SPECIALIST_STATUSES } = require("../utility/constants.js");

const TicketAssignment = sequelize.define("TicketAssignment", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    specialistStatus: {
        type: DataTypes.ENUM(),
        values: Object.values(TICKET_SPECIALIST_STATUSES),
        defaultValue: TICKET_SPECIALIST_STATUSES.PENDING,
    },
    note: {
        type: DataTypes.TEXT,
    },
});

module.exports = TicketAssignment;
