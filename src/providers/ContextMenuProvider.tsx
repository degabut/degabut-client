import { clickOutside } from "@directives";
import { Component, createContext, createEffect, createSignal, For, JSX, onMount, ParentProps } from "solid-js";

clickOutside;

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
	let contextMenuElement!: HTMLDivElement;
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

	createEffect(() => {
		if (params() && contextMenuElement) {
			const rect = contextMenuElement.getBoundingClientRect();
			if (rect.x + rect.width > window.innerWidth) {
				setParams({
					...params(),
					x: window.innerWidth - rect.width,
				});
			}

			if (rect.y + rect.height > window.innerHeight) {
				setParams({
					...params(),
					y: window.innerHeight - rect.height,
				});
			}
		}
	});

	return (
		<ContextMenuContext.Provider value={{ show }}>
			{isShowContextMenu() && (
				<div use:clickOutside={() => setIsShowContextMenu(false)} class="">
					<div
						ref={contextMenuElement}
						style={{
							left: params().x + "px",
							top: params().y + "px",
						}}
						class="hidden lg:block fixed bg-black z-50 min-w-[12rem] w-max"
					>
						<For each={params().items}>
							{(item) => (
								<div
									class="cursor-pointer hover:bg-white hover:bg-opacity-10 py-2 px-4"
									onClick={() => onClick(item)}
								>
									{item.element || item.label}
								</div>
							)}
						</For>
					</div>

					<div class="block lg:hidden fixed w-screen h-screen top-0 left-0 bg-black bg-opacity-80 z-50">
						<div
							use:clickOutside={() => setIsShowContextMenu(false)}
							class="absolute bottom-0 w-full bg-neutral-900 pb-8 z-50 min-h-[50vh] max-h-full overflow-y-auto"
						>
							<div class="px-2">{params().header}</div>
							<For each={params().items}>
								{(item) => (
									<div
										class="cursor-pointer hover:bg-white hover:bg-opacity-10 px-8 py-4"
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
