export function get(obj, key) {
	return key
		.split(".")
		.reduce((o, x) => (o === undefined || o === null ? o : o[x]), obj);
}

Object.byString = (obj, path) => {
	const sanitizedPath = path.replace(/\[(\w+)\]/g, ".$1").replace(/^\./, ""); // convert indexes to properties and strip a leading dot
	const keys = sanitizedPath.split(".");

	let result = obj;
	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		if (result !== null && key in result) {
			result = result[key];
		} else {
			return undefined;
		}
	}
	return result;
};

/* 
 To check only if a property exists, without getting its value. It similar get function.
*/
export function has(obj, key) {
	let current = obj;

	return key.split(".").every((x) => {
		if (typeof current !== "object" || current === null || !(x in current)) {
			return false;
		}
		current = current[x];
		return true;
	});
}

/* 
 convert indexes to properties
*/
export function valueByString(obj, string, devider) {
	const delimiter = devider !== undefined ? devider : "|";

	return string
		.split(delimiter)
		.map((key) => get(obj, key))
		.join(" ");
}

/*
 Submit multi-part form using ajax.
*/
export function toFormData(form) {
	const formData = new FormData();
	const elements = form.querySelectorAll("input, select, textarea");
	for (let i = 0; i < elements.length; ++i) {
		const element = elements[i];
		const name = element.name;

		if (name && element.dataset.disabled !== "true") {
			if (element.type === "file") {
				const file = element.files[0];
				formData.append(name, file);
			} else {
				const value = element.value;
				if (value?.trim()) {
					formData.append(name, value);
				}
			}
		}
	}

	return formData;
}

/*
 Format Date to display admin
*/
export function formatDate(param) {
	const date = new Date(param);
	let day = date.getDate().toString();
	let month = (date.getMonth() + 1).toString();
	const year = date.getFullYear();
	if (month.length < 2) month = `0${month}`;
	if (day.length < 2) day = `0${day}`;
	const fullDate = `${day}/${month}/${year}`;
	return fullDate;
}

export const isDate = ({ date, format = "YYYY-MM-DD" }) => {
	if (typeof date === "boolean") return false;
	if (typeof date === "number") return false;
	if (dayjs(date, format).isValid()) return true;
	return false;
};
/*
 Format Datetime to display admin
*/
export function formatDatetime(param) {
	const time = new Date(param).toLocaleTimeString();
	return `${formatDate(param)} ${time}`;
}

/*
  Regex to validate phone number format
*/
export const validatePhoneNumber = /^(?:[+\d()\-\s]+)$/;

/*
 Set object value in html
*/
