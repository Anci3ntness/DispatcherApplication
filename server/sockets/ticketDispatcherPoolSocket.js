const { Ticket, TicketStatusHistory } = require("../models/index.js");
const { USER_ROLES, TICKET_MAIN_STATUSES } = require("../utility/constants.js");

module.exports = async function (socket, io) {
    socket.on("ticket-dispatcher-pool:subscribePool", async () => {
        const userRole = socket.user.role;
        if (userRole !== USER_ROLES.DISPATCHER && userRole !== USER_ROLES.ADMIN) {
            socket.emit("ticket-dispatcher-pool:error", { reason: "Нет доступа к заявкам" });
            return;
        }
        socket.join("ticket-dispatcher-pool");
        console.log(`${socket.user.id} присоединился к ticket-dispatcher-pool`);
    });

    socket.on("ticket:take", async ({ ticketId }) => {
        try {
            const ticket = await Ticket.findOne({ where: { id: ticketId, status: TICKET_MAIN_STATUSES.NEW } });

            if (!ticket) {
                return socket.emit("ticket:take_failed", { reason: "Заявка уже занята" });
            }

            ticket.dispatcherId = socket.user.id;
            ticket.status = TICKET_MAIN_STATUSES.IN_PROGRESS;
            const updatedTicket = await ticket.save();
            await TicketStatusHistory.create({
                oldStatus: TICKET_MAIN_STATUSES.NEW,
                newStatus: TICKET_MAIN_STATUSES.IN_PROGRESS,
                ticketId: ticket.id,
                changedById: socket.user.id,
            });
            if (!updatedTicket) return socket.emit("ticket:take_failed", { reason: "Произошла непредвиденная ошибка" });
            io.to("ticket-dispatcher-pool").emit("ticket:ready", {
                dispatcherId: socket.user.id,
                ticketId: updatedTicket.id,
            });

            io.to("ticket-dispatcher-pool").emit("ticket:removed", { ticketId });

            io.to(`ticket-user-pool-${updatedTicket.clientId}`).emit("ticket:statusUpdated", updatedTicket);
            console.log(`Новый статус заявки ${ticket.ticketId}:`, ticket.status);
        } catch (err) {
            console.error("Ошибка при взятии заявки:", err.message);
            socket.emit("ticket:take_failed", { reason: "Ошибка на сервере" });
        }
    });
    socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);
    });
};
