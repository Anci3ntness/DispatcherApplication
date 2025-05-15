const express = require("express");
const router = express.Router();
const userRouter = require("./userRoutes.js");
const ticketRouter = require("./ticketRoutes.js");
const chatRouter = require("./chatRoutes.js");

router.use("/user", userRouter);
router.use("/ticket", ticketRouter);
router.use("/chat", chatRouter);

module.exports = router;
