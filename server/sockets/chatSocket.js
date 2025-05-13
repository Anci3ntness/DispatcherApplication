const { Ticket } = require("../models");
module.exports = async function (socket, io) {
    socket.on("chat:join", async ({ ticketId }) => {
        const userId = socket.user.id;
        const ticket = await Ticket.findByPk(ticketId);
        if (!ticket || ![ticket.clientId, ticket.dispatcherId].includes(userId)) {
            socket.emit("error", "Нет доступа к этой заявке");
            return;
        }
        socket.join(`ticket-${ticketId}`);
        console.log(`${socket.id} присоединился к комнате ticket-${ticketId}`);
    });
    socket.on("chat:message", ({ ticketId, message }) => {
        io.to(`ticket-${ticketId}`).emit("chat:message", {
            senderId: socket.user.id,
            message,
        });
    });

    socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);
    });
};
