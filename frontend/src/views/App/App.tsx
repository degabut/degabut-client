import { App, Icon } from "@components";
import { useQueue } from "@hooks";
import { ContextMenuProvider, QueueProvider, RPCProvider } from "@providers";
import { AppProvider } from "@providers/AppProvider";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, onMount, Show } from "solid-js";

export const RootApp: Component = () => {
	return (
		<AppProvider>
			<QueueProvider>
				<RPCProvider>
					<ContextMenuProvider>
						<ProvidedApp />
					</ContextMenuProvider>
				</RPCProvider>
			</QueueProvider>
		</AppProvider>
	);
};

const NoQueue: Component = () => {
	return (
		<div class="flex flex-col flex-grow items-center justify-center w-full h-full space-y-4">
			<Icon name="musicOff" extraClass="fill-neutral-400 opacity-10" />
			<div class="text-4xl">No Queue Found</div>
		</div>
	);
};

const ProvidedApp: Component = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const queue = useQueue();

	onMount(() => {
		if (location.pathname === "/app") navigate("/app/queue");
	});

	return (
		<>
			<div class="flex flex-col md:flex-row h-full">
				<App.Drawer />

				<div class="relative h-full flex-grow flex flex-col overflow-x-hidden">
					<div class="flex-shrink-0">
						<App.Header />
					</div>

					<div class="h-full overflow-y-auto">
						<Show when={queue.data() || queue.isInitialLoading()} fallback={<NoQueue />}>
							<div class="z-10 py-8 px-2 md:px-8 pb-32">
								<Outlet />
							</div>
						</Show>
					</div>
				</div>

				<App.UserListDrawer />

				<div class="md:hidden block w-full z-30">
					<App.MobileDrawer />
				</div>
			</div>

			<App.CatJam />
			<App.QuickAddModal />
		</>
	);
};
