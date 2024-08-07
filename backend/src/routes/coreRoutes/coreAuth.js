const express = require("express");
const router = express.Router();
const { catchErrors } = require("@/handlers/errorHandlers");
const adminAuth = require("@/controllers/coreControllers/adminAuth");

// Admin Authentication Routes
router.post("/login", catchErrors(adminAuth.login));
router.post("/forget-password", catchErrors(adminAuth.forgetPassword));
router.post("/reset-password", catchErrors(adminAuth.resetPassword));

// Logout Route with Authentication Check
router.post(
	"/logout",
	adminAuth.isValidAuthToken,
	catchErrors(adminAuth.logout),
);

module.exports = router;
