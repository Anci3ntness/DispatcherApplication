const ApiError = require("../utility/apiError.js");
const { Ticket, ChatMessage } = require("../models");

class chatController {
    async chatHistoryByTicket(req, res, next) {
        const { ticketId } = req.query;
        if (!ticketId) return next(ApiError.badRequest("Не указана заявка"));
        const dialog = await ChatMessage.findAndCountAll({ where: { ticketId }, order: [["createdAt", "ASC"]] });
        res.json(dialog);
    }
}
module.exports = new chatController();
