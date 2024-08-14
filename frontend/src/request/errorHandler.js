import { notification } from "antd";
import codeMessage from "./codeMessage";

const errorHandler = (error) => {
	if (!navigator.onLine) {
		notification.config({
			duration: 15,
			maxCount: 1,
		});
		notification.error({
			message: "No internet connection",
			description:
				"Cannot connect to the Internet, Check your internet network",
		});
		return {
			success: false,
			result: null,
			message: "Cannot connect to the server, Check your internet network",
		};
	}

	const { response } = error;

	if (!response) {
		notification.config({
			duration: 20,
			maxCount: 1,
		});
		notification.error({
			message: "Problem connecting to server",
			description: "Cannot connect to the server, Try again later",
		});
		return {
			success: false,
			result: null,
			message:
				"Cannot connect to the server, Contact your Account administrator",
		};
	}

	if (response?.data?.jwtExpired) {
		const authData = window.localStorage.getItem("auth");
		const isLogoutData = window.localStorage.getItem("isLogout");
		const { isLogout } = (isLogoutData && JSON.parse(isLogoutData)) || false;

		window.localStorage.removeItem("auth");
		window.localStorage.removeItem("isLogout");

		if (authData || isLogout) {
			window.location.href = "/logout";
		}
	}

	if (response?.status) {
		const message = response.data?.message;
		const errorText = message || codeMessage[response.status];
		notification.config({
			duration: 20,
			maxCount: 2,
		});
		notification.error({
			message: `Request error ${response.status}`,
			description: errorText,
		});
		return response.data;
	}

	notification.config({
		duration: 15,
		maxCount: 1,
	});
	notification.error({
		message: "Problem connecting to server",
		description: "Cannot connect to the server, Try again later",
	});
	return {
		success: false,
		result: null,
		message: "Cannot connect to the server, Contact your Account administrator",
	};
};

export default errorHandler;
