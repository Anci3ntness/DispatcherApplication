const ApiError = require("../utility/apiError.js");
const { Ticket, User, TicketStatusHistory, TicketAssignment } = require("../models");
const { v4 } = require("uuid");
const { TICKET_MAIN_STATUSES, TICKET_SPECIALIST_STATUSES } = require("../utility/constants.js");
const { getIO } = require("../utility/socket.js");

class ticketController {
    async createTicket(req, res, next) {
        const userId = req.user.id;
        const { topic, address } = req.body;
        if (!topic || !address) return next(ApiError.badRequest("Неправильный адрес или тематика"));
        const newTicket = await Ticket.create({
            topic,
            address,
            id: v4(),
            clientId: userId,
            status: TICKET_MAIN_STATUSES.NEW,
        });

        if (!newTicket) return next(ApiError.internal("Произошла непредвиденная ошибка. Попробуйте повторить запрос."));
        const ticketWithClient = await Ticket.findByPk(newTicket.id, {
            include: { model: User, as: "client" },
        });
        getIO().to("ticket-dispatcher-pool").emit("ticket:create", { ticketWithClient });
        res.status(201).json(ticketWithClient);
    }
    async getAllTickets(req, res, next) {
        const { status } = req.query;
        const where = {};
        if (Object.values(TICKET_MAIN_STATUSES).includes(status)) {
            where.status = status;
        }
        const tickets = await Ticket.findAndCountAll({
            where,
            include: { model: User, as: "client" },
            order: [["createdAt", "ASC"]],
        });
        res.status(201).json(tickets);
    }
    async getTicketsByUser(req, res, next) {
        const userId = req.user.id;

        const tickets = await Ticket.findAndCountAll({
            where: { clientId: userId },
            include: { model: User, as: "client" },
            order: [["createdAt", "ASC"]],
        });
        res.status(201).json(tickets);
    }
    async getTicketsByDispatcher(req, res, next) {
        const userId = req.user.id;

        const tickets = await Ticket.findAndCountAll({
            where: { dispatcherId: userId },
            include: { model: User, as: "client" },
            order: [["createdAt", "ASC"]],
        });
        res.status(201).json(tickets);
    }
    async getTicketsBySpecialist(req, res, next) {
        const userId = req.user.id;

        const tickets = await TicketAssignment.findAndCountAll({
            where: { specialistId: userId },
            include: { model: Ticket, include: { model: User, as: "client" } },
        });

        res.status(201).json(tickets);
    }

    async getTicketById(req, res, next) {
        const { ticketId } = req.params;
        const ticket = await Ticket.findByPk(ticketId, { include: { model: User, as: "client" } });
        const specialist = await TicketAssignment.findOne({
            where: { ticketId },
            include: { model: User, as: "specialist" },
        });
        if (!specialist) return res.status(201).json(ticket);
        else return res.status(201).json({ ...ticket.toJSON(), specialist: { ...specialist.specialist.toJSON() } });
    }
    async updateTicketStatus(req, res, next) {
        const { ticketId, status } = req.body;
        const userId = req.user.id;
        const ticket = await Ticket.findByPk(ticketId, { include: { model: User, as: "client" } });
        const oldStatus = structuredClone(ticket.status);
        ticket.status = status;
        const updatedTicket = await ticket.save();
        await TicketStatusHistory.create({ oldStatus, newStatus: status, ticketId: ticket.id, changedById: userId });
        getIO().to(`ticket-user-pool-${updatedTicket.clientId}`).emit("ticket:statusUpdated", updatedTicket);
        res.status(201).json(ticket);
    }
    async getTicketStatusHistory(req, res, next) {
        const { ticketId } = req.query;
        const history = await TicketStatusHistory.findAll({ where: { ticketId }, order: [["createdAt", "ASC"]] });
        res.status(201).json(history);
    }
    async getAssignTicket(req, res, next) {
        const { ticketId } = req.query;
        const assign = await TicketAssignment.findOne({
            where: { ticketId },
        });
        res.status(201).json(assign);
    }

    async assignSpecialistToTicket(req, res, next) {
        const { specialistId, ticketId } = req.body;

        const assign = await TicketAssignment.create({
            specialistId,
            ticketId,
        });

        res.status(201).json(assign);
    }
    async updateAssign(req, res, next) {
        const { id, note, status } = req.body;
        const cond = {};
        if (!!status) cond.specialistStatus = status;
        if (!!note) cond.note = note;
        const assign = await TicketAssignment.update(cond, { where: { id } });
        res.status(201).json(assign);
    }
}
module.exports = new ticketController();
