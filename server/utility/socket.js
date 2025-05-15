const { Server } = require("socket.io");
const socketsHandler = require("../sockets");
const ApiError = require("./apiError.js");
const jwt = require("jsonwebtoken");

let io;
function initSocket(server) {
    const ioServer = new Server(server);
    ioServer.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(ApiError.unauth("Пользователь не авторизован"));
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = payload;
            next();
        } catch (err) {
            return next(ApiError.forbidden("Отказано в доступе"));
        }
    });
    ioServer.on("connection", socket => {
        console.log("Новый клиент подключился:", socket.id);
        socketsHandler(socket, ioServer);
    });
    io = ioServer;
    return ioServer;
}
function getIO() {
    if (!io) {
        return;
    }
    return io;
}
module.exports = { initSocket, getIO };
