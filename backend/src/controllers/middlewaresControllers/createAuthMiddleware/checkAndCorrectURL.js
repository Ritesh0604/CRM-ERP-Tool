function checkAndCorrectURL(url) {
	// detect if it has http or https:
	const hasHttps = url.startsWith("https://");

	// Remove "http://" or "https://" if present
	let newUrl = url.replace(/^https?:\/\//i, "");

	// Remove trailing slashes
	newUrl = url.replace(/\/+$/, "");

	const httpType = hasHttps ? "https://" : "http://";
	return httpType + newUrl;
}

module.exports = checkAndCorrectURL;
