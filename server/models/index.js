const sequelize = require("../utility/database");

const User = require("./UserModel.js");
const Ticket = require("./TicketModel.js");
const TicketAssignment = require("./TicketAssignmentModel.js");
const TicketStatusHistory = require("./TicketStatusHistoryModel.js");
const ChatMessage = require("./ChatMessageModel.js");

const syncDatabase = async () => {
    try {
        // Заявки
        User.hasMany(Ticket, { foreignKey: "clientId", as: "clientTickets" });
        User.hasMany(Ticket, { foreignKey: "dispatcherId", as: "dispatcherTickets" });
        Ticket.belongsTo(User, { as: "client", foreignKey: "clientId" });
        Ticket.belongsTo(User, { as: "dispatcher", foreignKey: "dispatcherId" });

        // Чат
        Ticket.hasMany(ChatMessage, { foreignKey: "ticketId" });
        ChatMessage.belongsTo(Ticket, { foreignKey: "ticketId" });
        ChatMessage.belongsTo(User, { as: "sender", foreignKey: "senderId" });

        // Назначение специалиста
        Ticket.hasOne(TicketAssignment, { foreignKey: "ticketId" });
        TicketAssignment.belongsTo(Ticket, { foreignKey: "ticketId" });
        TicketAssignment.belongsTo(User, { as: "specialist", foreignKey: "specialistId" });

        // История статусов
        Ticket.hasMany(TicketStatusHistory, { foreignKey: "ticketId" });
        TicketStatusHistory.belongsTo(Ticket, { foreignKey: "ticketId" });
        TicketStatusHistory.belongsTo(User, { as: "changer", foreignKey: "changedById" });

        await sequelize.sync({ force: false });
        console.info("База данных синхронизирована");
    } catch (error) {
        console.error("Ошибка при синхронизации базы данных:", error);
    }
};

module.exports = {
    sequelize,
    syncDatabase,
    User,
    Ticket,
    TicketAssignment,
    TicketStatusHistory,
    ChatMessage,
};
