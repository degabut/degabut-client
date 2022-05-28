import { Component, createSignal, For, JSX, Show } from "solid-js";

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
	const [activeItem, setActiveItem] = createSignal<Item>(props.items[0]);

	const onChange = (item: Item) => {
		setActiveItem(item);
		props.onChange?.(item);
	};

	return (
		<div class="flex flex-col">
			<div class={`flex flex-row items-center w-full ${props.extraTabsClass}`}>
				<For each={props.items}>
					{(item) => (
						<div
							class="flex-grow lg:flex-grow-0 text-center cursor-pointer px-2 lg:px-12 py-2 min-w-max rounded-t-lg"
							classList={{
								"border-b border-neutral-100 bg-white bg-opacity-10": item.id === activeItem().id,
								"bg-neutral-800 hover:bg-white hover:bg-opacity-5 ": item.id !== activeItem().id,
							}}
							onClick={() => onChange(item)}
						>
							{item.label({ isActive: item.id === activeItem().id })}
						</div>
					)}
				</For>
			</div>

			<div class={props.extraContainerClass}>
				<Show when={activeItem()}>
					{(activeItem) => {
						return <div class="flex-1">{activeItem.element}</div>;
					}}
				</Show>
			</div>
		</div>
	);
};
