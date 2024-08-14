import { notification } from "antd";
import codeMessage from "./codeMessage";

/**
 * Handles success and error notifications based on the response.
 *
 * @param {object} response - The response object from the server.
 * @param {object} options - Options to configure notifications.
 * @param {boolean} [options.notifyOnSuccess=false] - Whether to show a success notification.
 * @param {boolean} [options.notifyOnFailed=true] - Whether to show an error notification.
 */
const successHandler = (
	response,
	options = { notifyOnSuccess: false, notifyOnFailed: true },
) => {
	const { data, status } = response;
	const message = data?.message || codeMessage[status];

	if (data?.success === true) {
		if (options.notifyOnSuccess) {
			notification.config({
				duration: 2,
				maxCount: 2,
			});
			notification.success({
				message: "Request Success",
				description: message,
			});
		}
	} else {
		if (options.notifyOnFailed) {
			notification.config({
				duration: 4,
				maxCount: 2,
			});
			notification.error({
				message: `Request Error ${status}`,
				description: message,
			});
		}
	}
};

export default successHandler;
