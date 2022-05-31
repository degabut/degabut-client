import { GetAccessToken, SetAccessToken } from "../../wailsjs/go/main/App";
import { IS_BROWSER } from "../constants";
import { client } from "./axios";

export const auth = {
	setAccessToken: async (accessToken: string): Promise<void> => {
		if (!IS_BROWSER) SetAccessToken(accessToken);
		localStorage.setItem("access_token", accessToken);

		client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
	},

	getAccessToken: async (): Promise<string> => {
		if (IS_BROWSER) {
			return localStorage.getItem("access_token") || "";
		} else {
			return GetAccessToken() || localStorage.getItem("access_token") || "";
		}
	},

	resetAccessToken: async (): Promise<void> => {
		if (IS_BROWSER) {
			localStorage.removeItem("access_token");
		} else {
			SetAccessToken("");
		}
	},
};
