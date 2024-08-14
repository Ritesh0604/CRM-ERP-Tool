const codeMessage = {
	200: "The server successfully returned the requested data.",
	201: "Data was created or modified successfully.",
	202: "The request has been accepted and is being processed in the background.",
	204: "Data was deleted successfully.",
	400: "There was an error in the request, and the server did not create or modify any data.",
	401: "The user is not authorized; please try logging in again.",
	403: "The user is authorized but access is forbidden.",
	404: "The requested record does not exist, and the server is not operating.",
	406: "The requested format is not available.",
	410: "The requested resource has been permanently deleted and is no longer available.",
	422: "A validation error occurred while creating an object.",
	500: "An internal server error occurred; please check the server.",
	502: "Bad gateway error.",
	503: "The service is unavailable; the server is temporarily overloaded or under maintenance.",
	504: "The gateway timed out.",
};

export default codeMessage;
