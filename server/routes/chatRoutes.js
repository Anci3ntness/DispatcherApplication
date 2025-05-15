const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController.js");
const checkHandler = require("../middleware/checkRoleMiddleware.js");
const { USER_ROLES } = require("../utility/constants.js");
const authHandler = require("../middleware/authMiddleware.js");

router.get("/getHistory", authHandler, chatController.chatHistoryByTicket);

module.exports = router;
