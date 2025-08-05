const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { registerValidation } = require("../validators/userValidator");
const validateRequest = require("../middlewares/validateRequest");

router.post(
  "/register",
  registerValidation,
  validateRequest,
  userController.register
);
router.get("/role/:role", userController.getUsersByRole);

module.exports = router;
