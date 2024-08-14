import axios from "axios";
import { BASE_URL } from "@/config/serverApiConfig";

export default async function checkImage(path) {
	try {
		const response = await axios.get(path, {
			headers: {
				"Access-Control-Allow-Origin": BASE_URL,
			},
		});
		return response.status === 200;
	} catch (error) {
		return false;
	}
}
