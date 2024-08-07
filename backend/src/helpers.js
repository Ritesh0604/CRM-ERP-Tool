/*
    This is a file of data and helper functions that we can expose and use in our templating function
*/

const fs = require("node:fs");
const currency = require("currency.js");

// moment.js is a handy library for displaying dates. We need this in our templates to display things like "Posted 5 minutes ago"
exports.moment = require("moment");

// inserting an SVG
exports.icon = (name) => {
	try {
		return fs.readFileSync(`./public/images/icons/${name}.svg`);
	} catch (error) {
		return null;
	}
};

exports.image = (name) => fs.readFileSync(`./public/images/photos/${name}.jpg`);

// Some details about the site
exports.siteName = "Express.js / MongoBD / Rest Api";

exports.timeRange = (start, end, format = "HH:mm", interval = 60) => {
	const validInterval = interval > 0 ? interval : 60;
	const range = [];
	let current = moment(start);

	while (current.isBefore(moment(end))) {
		range.push(current.format(format));
		current = current.add(validInterval, "minutes");
	}

	return range;
};

exports.calculate = {
	add: (firstValue, secondValue) => {
		return currency(firstValue).add(secondValue).value;
	},
	sub: (firstValue, secondValue) => {
		return currency(firstValue).subtract(secondValue).value;
	},
	multiply: (firstValue, secondValue) => {
		return currency(firstValue).multiply(secondValue).value;
	},
	divide: (firstValue, secondValue) => {
		return currency(firstValue).divide(secondValue).value;
	},
};
