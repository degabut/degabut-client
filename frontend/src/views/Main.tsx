import { AppMenuBar } from "@components";
import { Landing, Login, OAuth } from "@views";
import { App } from "@views/App";
import { Queue } from "@views/App/Queue";
import { Recommend } from "@views/App/Recommend";
import { Search } from "@views/App/Search";
import { VideoDetail } from "@views/App/VideoDetail";
import { Route, Routes } from "solid-app-router";
import { Component, onMount } from "solid-js";
import { IS_DESKTOP } from "../constants";

export const Main: Component = () => {
	onMount(() => {
		if (IS_DESKTOP && import.meta.env.PROD) document.addEventListener("contextmenu", (e) => e.preventDefault());
	});

	return (
		<div class="flex flex-col h-full">
			{IS_DESKTOP && <AppMenuBar />}
			<div class="flex-grow overflow-x-auto overflow-y-auto w-full">
				<Routes>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/oauth" element={<OAuth />} />
					<Route path="/app" element={<App />}>
						<Route path="/" element={<Queue />} />
						<Route path="/queue" element={<Queue />} />
						<Route path="/video/:id" element={<VideoDetail />} />
						<Route path="/recommended" element={<Recommend />} />
						<Route path="/search" element={<Search />} />
					</Route>
				</Routes>
			</div>
		</div>
	);
};
