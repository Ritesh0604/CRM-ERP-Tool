function checkAndCorrectURL(url) {
	// Remove any leading "http://" or "https://"
	const newUrl = url.replace(/^https?:\/\//i, "");

	// Ensure the URL starts with "http://" or "https://"
	const httpType = url.startsWith("https://") ? "https://" : "http://";

	// Add the protocol if missing
	return httpType + newUrl.replace(/\/+$/, "");
}

module.exports = checkAndCorrectURL;
