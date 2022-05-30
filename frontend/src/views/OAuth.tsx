import { Component, onMount } from "solid-js";
import { client } from "@api";
import { useNavigate } from "solid-app-router";

export const OAuth: Component = () => {
	const navigate = useNavigate();

	onMount(() => {
		const accessToken = new URLSearchParams(window.location.hash).get("access_token");
		if (accessToken) {
			localStorage.setItem("access_token", accessToken);
			client.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
			navigate("/");
		} else {
			navigate("/login");
		}
	});

	return <></>;
};
