import { Component, JSX } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
};

export const Button: Component<Props> = (props) => {
	return (
		<button
			{...props}
			class="flex flex-row items-center space-x-2 border border-neutral-400 max-w-max px-4 py-1 "
			classList={{
				"bg-white bg-opacity-5 text-neutral-400 border-neutral-400": props.disabled,
				"hover:bg-white hover:bg-opacity-10": !props.disabled,
				"rounded-full": props.rounded,
				...props.classList,
			}}
		>
			{props.children}
		</button>
	);
};
