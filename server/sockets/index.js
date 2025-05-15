const chatSocketHandler = require("./chatSocket.js");
const ticketUserPoolSocketHandler = require("./ticketUserPoolSocket.js");
const ticketDispatcherPoolSocketHandler = require("./ticketDispatcherPoolSocket.js");
module.exports = function (socket, io) {
    chatSocketHandler(socket, io);
    ticketUserPoolSocketHandler(socket, io);
    ticketDispatcherPoolSocketHandler(socket, io);
};
