import { AppDrawer, CatJam, MobileAppDrawer, QuickAddModal } from "@components";
import { useQueue, useRPC } from "@hooks";
import { ContextMenuProvider, QueueProvider, RPCProvider } from "@providers";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, onMount, Show } from "solid-js";
import { IS_DESKTOP } from "../../constants";

export const App: Component = () => {
	return (
		<QueueProvider>
			<RPCProvider>
				<ProvidedApp />
			</RPCProvider>
		</QueueProvider>
	);
};

const ProvidedApp: Component = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queue = useQueue();
	const rpc = useRPC();

	onMount(async () => {
		if (location.pathname === "/app") navigate("/app/queue");
		if (IS_DESKTOP) rpc.startActivityUpdater(queue);
	});

	return (
		<div class="h-full bg-gradient-to-b from-neutral-800 to-neutral-900">
			<div class="flex flex-col md:flex-row  h-full">
				<div class="md:block hidden z-30">
					<AppDrawer />
				</div>

				<div class="relative h-full flex-grow flex flex-col overflow-y-auto overflow-x-hidden">
					<div class="absolute top-0 left-0 md:hidden w-full h-32 bg-gradient-to-b from-gray-800 to-transparent" />

					<Show
						when={queue.data()}
						fallback={
							<div class="flex flex-col flex-grow items-center justify-center w-full h-full space-y-4">
								{queue.isLoading() ? (
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
							<div class="z-10 py-8 px-2 md:px-8 pb-32">
								<Outlet />
							</div>
						</ContextMenuProvider>
					</Show>
				</div>

				<div class="md:hidden block w-full z-30">
					<MobileAppDrawer />
				</div>
			</div>

			<CatJam />
			<QuickAddModal />
		</div>
	);
};
