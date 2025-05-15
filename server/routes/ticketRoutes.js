const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/ticketController.js");
const checkHandler = require("../middleware/checkRoleMiddleware.js");
const { USER_ROLES } = require("../utility/constants.js");
const authHandler = require("../middleware/authMiddleware.js");

router.get("/getAll", checkHandler(USER_ROLES.DISPATCHER, USER_ROLES.ADMIN), ticketController.getAllTickets);
router.put(
    "/updateTicketStatus",
    checkHandler(USER_ROLES.DISPATCHER, USER_ROLES.ADMIN),
    ticketController.updateTicketStatus
);
router.post("/create", authHandler, ticketController.createTicket);
router.put("/updateAssign", checkHandler(USER_ROLES.PERFORMER, USER_ROLES.ADMIN), ticketController.updateAssign);
router.post(
    "/assignSpecialistToTicket",
    checkHandler(USER_ROLES.DISPATCHER, USER_ROLES.ADMIN),
    ticketController.assignSpecialistToTicket
);
router.get("/getTicketStatusHistory", checkHandler(USER_ROLES.ADMIN), ticketController.getTicketStatusHistory);
router.get("/getByUser", authHandler, ticketController.getTicketsByUser);
router.get(
    "/getByDispatcher",
    checkHandler(USER_ROLES.DISPATCHER, USER_ROLES.ADMIN),
    ticketController.getTicketsByDispatcher
);
router.get(
    "/getBySpecialist",
    checkHandler(USER_ROLES.PERFORMER, USER_ROLES.ADMIN),
    ticketController.getTicketsBySpecialist
);
router.get(
    "/getAssignTicket",
    checkHandler(USER_ROLES.PERFORMER, USER_ROLES.DISPATCHER, USER_ROLES.ADMIN),
    ticketController.getAssignTicket
);
router.get("/:ticketId", authHandler, ticketController.getTicketById);

module.exports = router;
