import { Input, InputProps } from "@components";
import { createEffect, createSignal, For, JSX, onMount, Show } from "solid-js";

type Props<Item = unknown> = {
	inputProps: InputProps;
	options: Item[];
	focusOnMount?: boolean;
	children: (item: Item, isSelected: boolean) => JSX.Element;
	onSelect: (item: Item, index: number) => void;
};

export function Select<Item = unknown>(props: Props<Item>) {
	const [selectedIndex, setSelectedIndex] = createSignal(0);
	let input!: HTMLInputElement;
	let optionList!: HTMLDivElement;

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
		if (props.focusOnMount) input.focus();
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (!props.options.length) return;

		if (e.key === "ArrowUp" || e.key === "ArrowDown") {
			e.preventDefault();
			const newIndex = e.key === "ArrowUp" ? selectedIndex() - 1 + props.options.length : selectedIndex() + 1;
			setSelectedIndex(newIndex % props.options.length);
		} else if (e.key === "Enter") {
			e.preventDefault();
			props.onSelect(props.options[selectedIndex()], selectedIndex());
		}
	};

	createEffect(() => {
		if (!props.options.length) return;
		setSelectedIndex(0);
	});

	createEffect(() => {
		const index = selectedIndex();
		const element = optionList?.children.item(index) as HTMLDivElement | null;
		if (!element) return;

		const { bottom, top } = element.getBoundingClientRect();
		const containerRect = optionList.getBoundingClientRect();

		const isInViewport =
			top <= containerRect.top ? containerRect.top - top <= 0 : bottom - containerRect.bottom <= 0;

		if (isInViewport) return;

		const isOnTop = top - containerRect.top <= 0;
		if (isOnTop) optionList.scrollTop = element.offsetTop;
		else optionList.scrollTop += bottom - containerRect.bottom;
	});

	return (
		<div class="relative w-full space-y-4">
			<Input {...props.inputProps} ref={input} />

			<Show when={props.options.length}>
				<div ref={optionList} class="absolute w-full h-64 bg-neutral-800 overflow-y-scroll">
					<For each={props.options}>
						{(item, index) => (
							<div onClick={() => props.onSelect(item, index())}>
								{props.children(item, selectedIndex() === index())}
							</div>
						)}
					</For>
				</div>
			</Show>
		</div>
	);
}
