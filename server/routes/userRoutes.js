const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController.js");
const authHandler = require("../middleware/authMiddleware.js");
const checkHandler = require("../middleware/checkRoleMiddleware.js");
const { USER_ROLES } = require("../utility/constants.js");

router.post("/registration", userController.registration);
router.post("/login", userController.login);
router.put("/update", checkHandler(USER_ROLES.ADMIN), userController.updateRole);
router.get("/check", authHandler, userController.auth);
router.get("/all", checkHandler(USER_ROLES.ADMIN), userController.getAll);
router.get(
    "/allPerformers",
    checkHandler(USER_ROLES.ADMIN, USER_ROLES.PERFORMER, USER_ROLES.DISPATCHER),
    userController.getAllPerformers
);

module.exports = router;
