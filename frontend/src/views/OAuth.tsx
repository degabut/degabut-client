import { auth } from "@api";
import { useNavigate } from "solid-app-router";
import { Component, onMount } from "solid-js";

export const OAuth: Component = () => {
	const navigate = useNavigate();

	onMount(() => {
		const accessToken = new URLSearchParams(window.location.hash).get("access_token");
		if (accessToken) {
			auth.setAccessToken(accessToken);
			navigate("/");
		} else {
			navigate("/login");
		}
	});

	return <></>;
};
