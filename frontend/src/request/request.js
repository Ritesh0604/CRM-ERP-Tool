import axios from "axios";
import { API_BASE_URL } from "@/config/serverApiConfig";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

// Add a request interceptor
axios.interceptors.request.use(
	(request) => {
		console.log("Starting Request", request);
		return request;
	},
	(error) => {
		console.error("Request Error", error);
		return Promise.reject(error);
	},
);

// Add a response interceptor
axios.interceptors.response.use(
	(response) => {
		console.log("Response:", response);
		return response;
	},
	(error) => {
		console.error("Response Error", error);
		return Promise.reject(error);
	},
);

// Utility function to build query strings
const buildQuery = (options) => {
	const queryParams = new URLSearchParams();

	for (const [key, value] of Object.entries(options)) {
		if (Array.isArray(value)) {
			for (const v of value) {
				queryParams.append(key, v);
			}
		} else {
			queryParams.append(key, value);
		}
	}

	return `?${queryParams.toString()}`;
};

const defaultHeaders = {
	"Content-Type": "application/json",
};

const request = {
	async create({ entity, jsonData }) {
		try {
			const response = await axios.post(`${entity}/create`, jsonData, {
				headers: { ...defaultHeaders, ...headers },
			});
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async createAndUpload({ entity, jsonData }) {
		try {
			const response = await axios.post(`${entity}/create`, jsonData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async read({ entity, id }) {
		try {
			const response = await axios.get(`${entity}/read/${id}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: true,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async update({ entity, id, jsonData }) {
		try {
			const response = await axios.patch(`${entity}/update/${id}`, jsonData);
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async updateAndUpload({ entity, id, jsonData }) {
		try {
			const response = await axios.patch(`${entity}/update/${id}`, jsonData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async delete({ entity, id }) {
		try {
			const response = await axios.delete(`${entity}/delete/${id}`);
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async filter({ entity, options = {} }) {
		try {
			const query = buildQuery({
				...(options.filter && { filter: options.filter }),
				...(options.equal && { equal: options.equal }),
			});
			const response = await axios.get(`${entity}/filter${query}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: false,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async search({ entity, options = {} }) {
		try {
			const query = buildQuery(options);
			const response = await axios.get(`${entity}/search${query}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: false,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async list({ entity, options = {} }) {
		try {
			const query = buildQuery(options);
			const response = await axios.get(`${entity}/list${query}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: false,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async listAll({ entity, options = {} }) {
		try {
			const query = buildQuery(options);
			const response = await axios.get(`${entity}/listAll${query}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: false,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async post({ entity, jsonData }) {
		try {
			const response = await axios.post(entity, jsonData);
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async get({ entity }) {
		try {
			const response = await axios.get(entity);
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async patch({ entity, jsonData }) {
		try {
			const response = await axios.patch(entity, jsonData);
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async upload({ entity, id, jsonData }) {
		try {
			const response = await axios.patch(`${entity}/upload/${id}`, jsonData, {
				headers: { "Content-Type": "multipart/form-data" },
			});
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	source() {
		const CancelToken = axios.CancelToken;
		const source = CancelToken.source();
		return source;
	},

	async summary({ entity, options = {} }) {
		try {
			const query = buildQuery(options);
			const response = await axios.get(`${entity}/summary${query}`);
			successHandler(response, {
				notifyOnSuccess: false,
				notifyOnFailed: false,
			});
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async mail({ entity, jsonData }) {
		try {
			const response = await axios.post(`${entity}/mail/`, jsonData);
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},

	async convert({ entity, id }) {
		try {
			const response = await axios.get(`${entity}/convert/${id}`);
			successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
			return response.data;
		} catch (error) {
			return errorHandler(error);
		}
	},
};

export default request;
