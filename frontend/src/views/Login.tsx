import { Component, onMount } from "solid-js";

export const Login: Component = () => {
	onMount(() => {
		auth.resetAccessToken();
	});

	return (
		<div class="h-full flex flex-row items-center justify-center bg-gradient-to-b from-neutral-800 to-neutral-900">
			<a
				href={import.meta.env.VITE_OAUTH_URL}
				class="border border-neutral-100 px-8 py-4 rounded-lg text-2xl hover:bg-white hover:bg-opacity-10 transition-colors"
			>
				Login with Discord
			</a>
		</div>
	);
};
