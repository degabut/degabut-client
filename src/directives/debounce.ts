import { Accessor, onCleanup } from "solid-js";

export const debounce = (el: HTMLInputElement, delay: Accessor<number>) => {
	let timeout: NodeJS.Timeout;
	let ignore = false;

	el.addEventListener("input", (e) => {
		if (ignore) return;
		e.stopImmediatePropagation();
		clearTimeout(timeout);

		timeout = setTimeout(() => {
			ignore = true;
			e.target?.dispatchEvent(e);
			ignore = false;
		}, delay());
	});

	onCleanup(() => clearTimeout(timeout));
};
