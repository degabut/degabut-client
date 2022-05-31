import { AppDrawer, MobileAppDrawer, QuickAddModal } from "@components";
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
		<div class="h-full bg-gradient-to-b from-neutral-800 to-neutral-900">
			<div class="flex flex-col lg:flex-row  h-full">
				<div class="lg:block hidden z-30">
					<AppDrawer />
				</div>

				<div class="relative h-full flex-grow flex flex-col overflow-y-auto overflow-x-hidden px-2 lg:px-8 ">
					<div class="absolute top-0 left-0 lg:hidden w-full h-32 bg-gradient-to-b from-gray-800 to-transparent" />

					<Show
						when={queueStore.data()}
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
							<div class="z-10 py-8 lg:pt-4 pb-32">
								<Outlet />
							</div>
						</ContextMenuProvider>
					</Show>
				</div>

				<div class="lg:hidden block w-full z-30">
					<MobileAppDrawer />
				</div>
			</div>

			<QuickAddModal />
		</div>
	);
};
