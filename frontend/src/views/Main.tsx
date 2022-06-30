import { Button, Modal } from "@components";
import * as runtime from "@runtime";
import { Landing, Login, OAuth } from "@views";
import { App } from "@views/App";
import { Queue } from "@views/App/Queue";
import { Recommend } from "@views/App/Recommend";
import { Search } from "@views/App/Search";
import { VideoDetail } from "@views/App/VideoDetail";
import { Route, Routes } from "solid-app-router";
import { Component, createSignal, onMount, Show } from "solid-js";
import { IS_DESKTOP } from "../constants";

export const Main: Component = () => {
	const [isShowUpdateModal, setIsShowUpdateModal] = createSignal(false);

	onMount(() => {
		if (IS_DESKTOP) {
			runtime.EventsOn("update", () => {
				setIsShowUpdateModal(true);
			});
			if (import.meta.env.PROD) {
				document.addEventListener("contextmenu", (e) => e.preventDefault());
			}
		}
	});

	return (
		<>
			<div class="flex flex-col h-full">
				{/* {IS_DESKTOP && <AppMenuBar />} */}
				<div class="flex-grow overflow-x-auto overflow-y-auto w-full">
					<Routes>
						<Route path="/" element={<Landing />} />
						<Route path="/login" element={<Login />} />
						<Route path="/oauth" element={<OAuth />} />
						<Route path="/app" element={<App />}>
							<Route path="/" element={<Queue />} />
							<Route path="/queue" element={<Queue />} />
							<Route path="/video/:id" element={<VideoDetail />} />
							<Route path="/u/:id/videos" element={<Recommend />} />
							<Route path="/search" element={<Search />} />
						</Route>
					</Routes>
				</div>
			</div>

			<Show when={IS_DESKTOP}>
				{/* Update Modal */}
				<Modal isOpen={isShowUpdateModal()} onClickOutside={() => setIsShowUpdateModal(false)}>
					<div class="flex flex-col items-center space-y-8">
						<div class="text-center text-2xl font-medium">New Update Found</div>
						<div class="text-center mt-8">Restart Degabut to apply update</div>

						<Button rounded class="px-8" onClick={() => setIsShowUpdateModal(false)}>
							OK
						</Button>
					</div>
				</Modal>
			</Show>
		</>
	);
};
