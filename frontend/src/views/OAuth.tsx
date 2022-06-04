import { auth } from "@api";
import axios from "axios";
import { useLocation, useNavigate } from "solid-app-router";
import { Component, onMount } from "solid-js";

export const OAuth: Component = () => {
	const navigate = useNavigate();
	const location = useLocation();

	onMount(() => {
		const accessToken = new URLSearchParams(location.hash).get("access_token");
		const isTargetDesktop = location.query["target"] === "desktop";

		if (accessToken) {
			if (isTargetDesktop) {
				axios.post("http://localhost:39821/oauth", accessToken);
			} else {
				auth.setAccessToken(accessToken);
				navigate("/");
			}
		} else {
			navigate("/login");
		}
	});

	return (
		<div class="flex flex-row items-center justify-center h-full">
			<div class="text-xl">You can close this tab now :)</div>
		</div>
	);
};
