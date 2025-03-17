const express = require("express");
const router = express.Router();
const { catchErrors } = require("@/handlers/errorHandlers");
const adminAuth = require("@/controllers/coreControllers/adminAuth");

// Admin Authentication Routes
router.post("/login", catchErrors(adminAuth.login));
router.post("/register", catchErrors(adminAuth.register));
router.route("/verify/:userId/:emailToken").get(catchErrors(adminAuth.verify));
router.post("/forget-password", catchErrors(adminAuth.forgetPassword));
router.post("/reset-password", catchErrors(adminAuth.resetPassword));
router
	.route("/logout")
	.post(adminAuth.isValidAuthToken, catchErrors(adminAuth.logout));

// Logout Route with Authentication Check
router.post(
	"/logout",
	adminAuth.isValidAuthToken,
	catchErrors(adminAuth.logout),
);

module.exports = router;
