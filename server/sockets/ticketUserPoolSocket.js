const { Ticket } = require("../models");
module.exports = async function (socket, io) {
    socket.on("ticket-user-pool:join", async () => {
        const userId = socket.user.id;
        socket.join(`ticket-user-pool-${userId}`);
        console.log(`${socket.user.id} присоединился к ticket-user-pool-${userId}`);
    });

    socket.on("disconnect", () => {
        console.log("Клиент отключился:", socket.id);
    });
};
