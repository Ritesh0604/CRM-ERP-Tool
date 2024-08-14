require("dotenv").config({ path: ".env" });
require("dotenv").config({ path: ".env.local" });
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const OpenAI = require("openai");
const fs = require("node:fs");
const path = require("node:path");

const openai = new OpenAI({
	apiKey: OPENAI_API_KEY,
});

function objectToText(obj) {
	let text = "{\n";
	for (const [key, value] of Object.entries(obj)) {
		text += `${key}: "${value}",\n`;
	}
	text += "}";
	return text;
}

const generateBackendFile = ({ language, newLanguageContent }) => {
	const txt = objectToText(newLanguageContent);
	const fileContent = `module.exports = ${txt}`;
	const filePath = `../backend/src/locale/translation/${language}.js`;

	// Ensure the directory exists
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFile(filePath, fileContent, (err) => {
		if (err) {
			console.error(`Failed to write file at ${filePath}:`, err);
			return;
		}
		console.log(`Backend file written successfully at ${filePath}`);
	});
};

const generateFrontendFile = ({ language, newLanguageContent }) => {
	const txt = objectToText(newLanguageContent);
	const fileContent = `const lang = ${txt}\n export default lang`;
	const filePath = `../frontend/src/locale/translation/${language}.js`;

	// Ensure the directory exists
	const dir = path.dirname(filePath);
	if (!fs.existsSync(dir)) {
		fs.mkdirSync(dir, { recursive: true });
	}

	fs.writeFile(filePath, fileContent, (err) => {
		if (err) {
			console.error(`Failed to write file at ${filePath}:`, err);
			return;
		}
		console.log(`Frontend file written successfully at ${filePath}`);
	});
};
// Creating an instance of OpenAIApi with API key from the environment variables

async function translate(language, langObject) {
	const objText = objectToText(langObject);
	try {
		const response = await openai.chat.completions.create({
			model: "gpt-3.5-turbo-16k",
			messages: [
				{
					role: "system",
					content:
						"You will be provided with text as js object, and your task is to translate all text into requested language , and return result as valid json",
				},
				{
					role: "user",
					content: `translate this into ${language} language : ${objText}`,
				},
			],
			temperature: 0.5,
			max_tokens: 12000,
			top_p: 1,
			frequency_penalty: 0,
			presence_penalty: 0,
		});
		// Log the full response for debugging
		console.log("API Response:", response);

		const list = response.choices[0].message.content;

		// Log the extracted content
		console.log("Extracted Content:", list);
		return list;
	} catch (error) {
		console.error("Error during translation: ", error);
		// throw error;
	}
}

const languages = require("../locale/language");

const missedWords = require("./missedWords");

async function generateTranslation(language) {
	const filePath = `../locale/translation/${language.value}`;
	let currentLang = {};
	if (fs.existsSync(filePath)) {
		currentLang = require(filePath);
	}

	try {
		const result = await translate(language.label, missedWords);
		// Check if result is defined and valid JSON
		if (!result) {
			throw new Error("Translation result is undefined or null");
		}

		let translatedFile;
		try {
			translatedFile = JSON.parse(result);
		} catch (error) {
			throw new Error("Failed to parse translation result as JSON");
		}
		const newLanguageContent = { ...currentLang, ...translatedFile };

		await new Promise((resolve, reject) => {
			generateBackendFile({ language: language.value, newLanguageContent });
			generateFrontendFile({ language: language.value, newLanguageContent });
			resolve();
		});
	} catch (error) {
		console.error(`Error generating translation for ${language.value}:`, error);
	}
}

for (const { label, value } of languages) {
	generateTranslation({ label, value });
}
