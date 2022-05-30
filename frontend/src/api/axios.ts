import axios from "axios";

const client = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	validateStatus: () => true,
});

client.interceptors.request.use((req) => {
	if (!req.headers) req.headers = {};
	if (localStorage.getItem("access_token")) {
		req.headers.Authorization = `Bearer ${localStorage.getItem("access_token")}`;
	}
	return req;
});

client.interceptors.response.use((res) => {
	if (res.status === 403 || res.status === 401) {
		if (window.location.pathname !== "/login") window.location.href = "/login";
	}
	return res;
});

export { client };
