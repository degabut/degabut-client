import { Component, JSX, onCleanup, onMount } from "solid-js";

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
	rounded?: boolean;
	focusOnMount?: boolean;
};

export const Input: Component<InputProps> = (props) => {
	let input!: HTMLInputElement;

	onMount(() => {
		if (props.focusOnMount) input.focus();
		input.addEventListener("keydown", onKeyDown);
	});

	onCleanup(() => {
		input.removeEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === "Escape") input.blur();
	};

	return (
		<input
			ref={input}
			{...props}
			class="w-full md:max-w-[32rem] bg-white rounded-full py-2 px-4 outline-0 text-black"
			classList={{
				"rounded-full": !!props.rounded,
				"bg-neutral-300 text-neutral-500": !!props.disabled,
				...props.classList,
			}}
		/>
	);
};
