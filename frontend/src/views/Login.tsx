import { auth } from "@api";
import { Link } from "@components";
import * as runtime from "@runtime";
import { useNavigate } from "solid-app-router";
import { Component, onCleanup, onMount } from "solid-js";
import { IS_DESKTOP } from "../constants";

export const Login: Component = () => {
	const navigate = useNavigate();

	onMount(() => {
		auth.resetAccessToken();

		if (IS_DESKTOP) {
			runtime.EventsOnce("oauth", (token: string) => {
				auth.setAccessToken(token);
				navigate("/app/queue");
			});
		}
	});

	onCleanup(() => {
		if (IS_DESKTOP) runtime.EventsOff("oauth");
	});

	return (
		<div class="flex flex-row items-center justify-center h-full">
			<Link
				href={import.meta.env.VITE_OAUTH_URL}
				class="border border-neutral-100 px-8 py-4 rounded-lg text-2xl text-center hover:bg-white/10 transition-colors"
			>
				Login with Discord
			</Link>
		</div>
	);
};
