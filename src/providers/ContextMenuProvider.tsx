import { clickOutside } from "@directives";
import { Component, createContext, createSignal, For, JSX, onMount, ParentProps } from "solid-js";

export type ContextMenuItem = {
	label?: string;
	element?: JSX.Element;
	onClick?: () => void;
};

export type ShowParams = { x: number; y: number; items: ContextMenuItem[]; header?: JSX.Element };
export type ContextMenuDirectiveParams = Omit<ShowParams, "x" | "y">;

type ContextMenuContextStore = {
	show: (params: ShowParams) => void;
};

export const ContextMenuContext = createContext<ContextMenuContextStore>();

export const ContextMenuProvider: Component<ParentProps> = (props) => {
	clickOutside;

	const [isShowContextMenu, setIsShowContextMenu] = createSignal(false);
	const [params, setParams] = createSignal<ShowParams>({ x: 0, y: 0, items: [], header: null });

	const show = (params: ShowParams) => {
		setIsShowContextMenu(true);
		setParams(params);
	};

	onMount(() => {
		window.addEventListener("popstate", () => {
			if (isShowContextMenu()) setIsShowContextMenu(false);
		});
	});

	const onClick = (item: ContextMenuItem) => {
		item.onClick?.();
		setIsShowContextMenu(false);
	};

	return (
		<ContextMenuContext.Provider value={{ show }}>
			{isShowContextMenu() && (
				<div use:clickOutside={() => setIsShowContextMenu(false)}>
					<div
						style={{
							left: params().x + "px",
							top: params().y + "px",
						}}
						class="hidden lg:block absolute bg-black z-50 min-w-[12rem]"
					>
						<For each={params().items}>
							{(item) => (
								<div
									class="cursor-pointer hover:bg-neutral-900 py-2 px-4"
									onClick={() => onClick(item)}
								>
									{item.element || item.label}
								</div>
							)}
						</For>
					</div>

					<div class="block lg:hidden absolute w-screen h-screen top-0 left-0 bg-black bg-opacity-80 z-50">
						<div
							use:clickOutside={() => setIsShowContextMenu(false)}
							class="absolute bottom-0 w-full bg-neutral-900 pb-8 z-50 min-h-[50vh] px-2"
						>
							{params().header}
							<For each={params().items}>
								{(item) => (
									<div
										class="cursor-pointer hover:bg-neutral-900 px-6 py-4"
										onClick={() => onClick(item)}
									>
										{item.element || item.label}
									</div>
								)}
							</For>
						</div>
					</div>
				</div>
			)}
			{props.children}
		</ContextMenuContext.Provider>
	);
};
