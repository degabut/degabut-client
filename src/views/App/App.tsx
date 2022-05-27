import { AppDrawer } from "@components/AppDrawer";
import { MobileAppDrawer } from "@components/AppDrawer/MobileAppDrawer";
import { ContextMenuProvider } from "@providers";
import { queueStore } from "@stores";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, onCleanup, onMount, Show } from "solid-js";

export const App: Component = () => {
	let interval: NodeJS.Timer;

	const navigate = useNavigate();
	const location = useLocation();

	onMount(async () => {
		if (location.pathname === "/app") navigate("/app/queue");
		interval = setInterval(queueStore.refetch, 3000);
		await queueStore.refetch();
	});

	onCleanup(() => clearInterval(interval));

	return (
		<div class="w-screen h-[calc(100vh-4rem)] lg:h-screen">
			<div class="flex flex-row h-full">
				<div class="lg:block hidden">
					<AppDrawer />
				</div>

				<div class="h-full flex-grow flex flex-col overflow-y-auto p-3 lg:p-8 pb-48 lg:pb-8 bg-gradient-to-b from-neutral-800 to-neutral-900">
					<Show
						when={!queueStore.data()}
						fallback={
							<div class="flex flex-col flex-grow items-center justify-center w-full h-full space-y-4">
								{queueStore.data.loading ? (
									<div class="text-4xl">Loading Queue...</div>
								) : (
									<>
										<div class="text-4xl">No Queue Found :(</div>
										<div class="text-xl">Join to voice channel where Degabut is</div>
									</>
								)}
							</div>
						}
					>
						<ContextMenuProvider>
							<Outlet />
						</ContextMenuProvider>
					</Show>
				</div>
			</div>

			<div class="lg:hidden block sticky bottom-0 w-full z-10 h-16">
				<MobileAppDrawer />
			</div>
		</div>
	);
};
