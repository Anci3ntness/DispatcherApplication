const { Server } = require("socket.io");
const socketsHandler = require("../sockets");
const ApiError = require("./apiError.js");
const jwt = require("jsonwebtoken");

function initSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;

        if (!token) {
            return next(new ApiError.unauth("Пользователь не авторизован"));
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            socket.user = payload;
            next();
        } catch (err) {
            return next(new ApiError.forbidden("Отказано в доступе"));
        }
    });
    io.on("connection", socket => {
        console.log("Новый клиент подключился:", socket.id);
        socketsHandler(socket, io);
    });

    return io;
}

module.exports = initSocket;
