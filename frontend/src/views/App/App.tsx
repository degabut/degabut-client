import { AppDrawer, CatJam, Icon, MobileAppDrawer, QuickAddModal, UserListDrawer } from "@components";
import { useQueue } from "@hooks";
import { ContextMenuProvider, QueueProvider, RPCProvider } from "@providers";
import { Outlet, useLocation, useNavigate } from "solid-app-router";
import { Component, onMount, Show } from "solid-js";

export const App: Component = () => {
	return (
		<QueueProvider>
			<RPCProvider>
				<ContextMenuProvider>
					<ProvidedApp />
				</ContextMenuProvider>
			</RPCProvider>
		</QueueProvider>
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

	onMount(async () => {
		if (location.pathname === "/app") navigate("/app/queue");
	});

	return (
		<>
			<div class="flex flex-col md:flex-row h-full">
				<div class="md:block hidden z-30">
					<AppDrawer />
				</div>

				<div class="relative h-full flex-grow flex flex-col overflow-y-auto overflow-x-hidden">
					<div class="absolute top-0 left-0 md:hidden w-full h-48 bg-gradient-to-b from-gray-800 to-transparent" />

					<Show when={queue.data() || queue.isInitialLoading()} fallback={<NoQueue />}>
						<div class="z-10 py-8 px-2 md:px-8 pb-32">
							<Outlet />
						</div>
					</Show>
				</div>

				<div class="lg:block hidden z-30">
					<UserListDrawer />
				</div>

				<div class="md:hidden block w-full z-30">
					<MobileAppDrawer />
				</div>
			</div>

			<CatJam />
			<QuickAddModal />
		</>
	);
};
