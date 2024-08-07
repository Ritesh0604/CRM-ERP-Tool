const pug = require("pug");
const fs = require("node:fs");
const moment = require("moment");
const pdf = require("html-pdf");
const { listAllSettings, loadSettings } = require("@/middlewares/settings");
const { getData } = require("@/middlewares/serverData");
const useLanguage = require("@/locale/useLanguage");
const { useMoney, useDate } = require("@/settings");

const pugFiles = ["invoice", "offer", "quote", "payment"];

require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });

exports.generatePdf = async (
	modelName,
	info,
	// info = { filename: 'pdf_file', format: 'A5', targetLocation: '' },
	result,
	callback,
) => {
	try {
		const { targetLocation } = info;

		if (!targetLocation) {
			throw new Error("Target location is required");
		}

		// if PDF already exists, then delete it and create a new PDF
		if (fs.existsSync(targetLocation)) {
			fs.unlinkSync(targetLocation);
		}

		//render pdf html
		if (pugFiles.includes(modelName.toLowerCase())) {
			// Compile Pug template

			const loadCurrency = async () => {
				const datas = await getData({
					model: "Currency",
				});
				return datas;
			};

			const settings = await loadSettings();
			const selectedLang = settings.crm_erp_tool_app_language;
			const transLate = useLanguage({ selectedLang });
			const currencyList = await loadCurrency();
			const currentCurrency = currencyList.find(
				(currency) =>
					currency.currency_code.toLowerCase() ===
					result.currency.toLowerCase(),
			);

			const {
				currency_symbol,
				currency_position,
				decimal_sep,
				thousand_sep,
				cent_precision,
				zero_format,
			} = settings;

			const { moneyFormatter } = useMoney({
				settings: {
					currency_symbol,
					currency_position,
					decimal_sep,
					thousand_sep,
					cent_precision,
					zero_format,
				},
			});

			const { dateFormat } = useDate({ settings });

			settings.public_server_file = process.env.PUBLIC_SERVER_FILE;

			const htmlContent = pug.renderFile(`src/pdf/${modelName}.pug`, {
				model: result,
				settings,
				translate,
				dateFormat,
				moneyFormatter,
				moment: moment,
			});

			pdf
				.create(htmlContent, {
					format: info.format,
					orientation: "portrait",
					border: "10mm",
				})
				.toFile(targetLocation, (error) => {
					if (error) throw new Error(error);
					if (callback) callback();
				});
		} else {
			throw new Error(`Model name "${modelName}" is not recognized.`);
		}
	} catch (error) {
		throw new Error(error);
	}
};
