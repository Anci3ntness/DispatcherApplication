const { Ticket, ChatMessage } = require("../models");
module.exports = async function (socket, io) {
    socket.on("chat:join", async ({ ticketId }) => {
        const userId = socket.user.id;

        const ticket = await Ticket.findByPk(ticketId);

        if (!ticket || ![ticket.clientId, ticket.dispatcherId].includes(userId)) {
            socket.emit("chat:error", { reason: "Нет доступа к этой заявке" });
            return;
        }
        socket.join(`chat-${ticketId}`);
        console.log(`${socket.user.id} присоединился к комнате chat-${ticketId}`);
    });
    socket.on("chat:message", async ({ ticketId, message }) => {
        const newMessage = await ChatMessage.create({ ticketId, message, senderId: socket.user.id });

        if (!newMessage) {
            return socket.emit("chat:error", { reason: "Произошла непредвиденная ошибка" });
        }
        io.to(`chat-${ticketId}`).emit("chat:message", newMessage);
    });
    socket.on("connect_error", err => {
        console.error("Ошибка подключения:", err.message, err.stack);
    });
    socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);
    });
};
