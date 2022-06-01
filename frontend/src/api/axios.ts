import axios from "axios";
import { auth } from "./auth";

const client = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
});

client.interceptors.request.use(async (req) => {
	req.headers = client.defaults.headers.common || {};
	if (!req.headers.Authorization) {
		const token = await auth.getAccessToken();
		if (token) {
			req.headers.Authorization = `Bearer ${token}`;
			auth.setAccessToken(token);
		}
	}
	return req;
});

export { client };
