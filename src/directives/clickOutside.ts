import { Accessor, onCleanup } from "solid-js";

export const clickOutside = (el: HTMLElement, handler: Accessor<() => void>) => {
	const onClick = (e: MouseEvent) => {
		if (!el.contains(e.target as Node)) handler()?.();
	};
	document.body.addEventListener("click", onClick);

	onCleanup(() => document.body.removeEventListener("click", onClick));
};
