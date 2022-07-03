import { Component, createSignal, For, JSX, onMount, Show } from "solid-js";

type LabelProps = {
	isActive: boolean;
};

type Item = {
	id: string;
	label: (props: LabelProps) => JSX.Element;
	element: JSX.Element;
};

type Props = {
	items: Item[];
	extraTabsClass?: string;
	extraContainerClass?: string;
	onChange?: (item: Item) => void;
};

export const Tabs: Component<Props> = (props) => {
	const [activeItem, setActiveItem] = createSignal<Item>();

	onMount(() => {
		setActiveItem(props.items[0]);
	});

	const onChange = (item: Item) => {
		setActiveItem(item);
		props.onChange?.(item);
	};

	return (
		<Show when={activeItem()}>
			{(activeItem) => {
				return (
					<div class="flex flex-col">
						<div
							class={`flex flex-row items-center w-full border-b border-neutral-700 ${props.extraTabsClass}`}
						>
							<For each={props.items}>
								{(item) => (
									<div
										class="flex-grow md:flex-grow-0 cursor-pointer bg-neutral-800"
										onClick={() => onChange(item)}
									>
										<div
											class="px-2 md:px-12 py-3 md:py-2"
											classList={{
												"border-b-neutral-100 border-t-bg-neutral-800 bg-white/10":
													item.id === activeItem.id,
												" hover:bg-white/5": item.id !== activeItem.id,
											}}
										>
											{item.label({ isActive: item.id === activeItem.id })}
										</div>
									</div>
								)}
							</For>
						</div>

						<div class={props.extraContainerClass}>
							<div class="flex-1">{activeItem.element}</div>
						</div>
					</div>
				);
			}}
		</Show>
	);
};
