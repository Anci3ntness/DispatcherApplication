const chatSocketHandler = require("./chatSocket.js");

module.exports = function (socket, io) {
    chatSocketHandler(socket, io);
};
