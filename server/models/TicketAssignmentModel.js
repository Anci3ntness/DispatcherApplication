const { DataTypes } = require("sequelize");
const sequelize = require("../utility/database");
const { TICKET_SPECIALIST_STATUSES } = require("../utility/constants.js");

const TicketAssignment = sequelize.define("TicketAssignment", {
    specialistStatus: {
        type: DataTypes.ENUM(Object.values(TICKET_SPECIALIST_STATUSES).toString()),
        defaultValue: TICKET_SPECIALIST_STATUSES.PENDING,
    },
    note: {
        type: DataTypes.TEXT,
    },
});

module.exports = TicketAssignment;
