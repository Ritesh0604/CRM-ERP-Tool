const path = require("node:path");
const { readBySettingKey } = require("@/middlewares/settings");

async function getCurrentLanguage() {
	const { settingValue } = await readBySettingKey({ settingKey: "language" });
	return settingValue;
}

const getLable = (lang, key) => {
	try {
		const lowerCaseKey = key
			.toLowerCase()
			.replace(/[^a-zA-Z0-9]/g, "_")
			.replace(/ /g, "_");

		if (lang[lowerCaseKey]) return lang[lowerCaseKey];

		const remove_underscore_fromKey = lowerCaseKey
			.replace(/_/g, " ")
			.split(" ");

		const conversionOfAllFirstCharacterOfEachWord =
			remove_underscore_fromKey.map(
				(word) => word[0].toUpperCase() + word.substring(1),
			);

		const lable = conversionOfAllFirstCharacterOfEachWord.join(" ");

		return lable;
	} catch (error) {
		return "No translate found";
	}
};

const useSelector = (lang = "en_us") => {
	try {
		const filePath = path.resolve(__dirname, `./translation/${lang}`);
		return require(filePath);
	} catch (error) {
		console.warn(
			`Language file for "${lang}" not found. Falling back to default language.`,
		);
		const defaultFilePath = path.resolve(__dirname, "./translation/en_us");
		return require(defaultFilePath);
	}
};

const useLanguage = ({ selectedLang = "en_us" } = {}) => {
	const lang = useSelector(selectedLang);

	const translate = (value) => {
		const text = getLable(lang, value);
		return text;
	};

	return translate;
};

module.exports = useLanguage;
