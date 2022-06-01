import { Accessor, onCleanup } from "solid-js";

export const doubleClick = (el: HTMLElement, handler: Accessor<() => void>) => {
	let lastClick = 0;

	const onClick = () => {
		if (Date.now() - lastClick < 500) {
			handler()?.();
		}
		lastClick = Date.now();
	};
	el.addEventListener("click", onClick);

	onCleanup(() => el.removeEventListener("click", onClick));
};
