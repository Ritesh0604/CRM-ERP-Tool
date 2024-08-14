const express = require("express");
const NodeCache = require("node-cache");

const cors = require("cors");
const compression = require("compression");
const cookieParser = require("cookie-parser");

const coreAuthRouter = require("./routes/coreRoutes/coreAuth");
const coreApiRouter = require("./routes/coreRoutes/coreApi");
const coreDownloadRouter = require("./routes/coreRoutes/coreDownloadRouter");
const corePublicRouter = require("./routes/coreRoutes/corePublicRouter");
const adminAuth = require("./controllers/coreControllers/adminAuth");

const errorHandlers = require("./handlers/errorHandlers");
const erpApiRouter = require("./routes/appRoutes/appApi");
const { listAllSettings } = require("@/middlewares/settings");
const rateLimit = require("express-rate-limit");
const useLanguage = require("@/locale/useLanguage");

const fileUpload = require("express-fileupload");

// create our Express app
const app = express();

const settingsCache = new NodeCache({ stdTTL: 100, checkperiod: 120 });

const loadSettings = async () => {
	const allSettings = {};
	const datas = await listAllSettings();
	datas.map(async (data) => {
		allSettings[data.settingKey] = data.settingValue;
	});
	return allSettings;
};

app.use(async (req, res, next) => {
	req.settings = await loadSettings();
	const lang = req.settings.crm_erp_tool_app_language;
	req.translate = useLanguage(lang);
	next();
	const cache = settingsCache.get("crm_erp_tool_app_language");
	if (!cache) {
		const settingsList = await loadSettings();
		settingsCache.mset(settingsList);
		req.settings = settingsCache;
		const lang = settingsCache.get("crm_erp_tool_app_language");
		console.log("🚀 ~ file: app.js:40 ~ lang:", lang);
		req.translate = useLanguage(lang);
		next();
	}
});

app.use(
	cors({
		origin: true,
		credentials: true,
	}),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(compression());

const limiter = rateLimit({
	windowMs: 60 * 1000, //  1 minute
	max: 500, // Limit each IP to 100 requests per windowMs
	message: {
		success: false,
		result: null,
		message: "Too many requests from this IP address, please try again later.",
	},
	statusCode: 429,
	standardHeaders: true,
	headers: true,
	handler: async (req, res) =>
		res.status(429).json({
			success: false,
			result: null,
			message:
				"Too many requests from this IP address, please try again later.",
		}),
});

app.use(limiter);

// default options
app.use(fileUpload());

// Here our API Routes

app.use("/api", coreAuthRouter);
app.use("/api", adminAuth.isValidAuthToken, coreApiRouter);
app.use("/api", adminAuth.isValidAuthToken, erpApiRouter);
app.use("/download", coreDownloadRouter);
app.use("/public", corePublicRouter);

// If that above routes did not work, we return 404 them and forward to error handler
app.use(errorHandlers.notFound);

// production error handler
app.use(errorHandlers.productionErrors);

// done! we export it so we can start the site in start.js
module.exports = app;
