import { Component, JSX } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
};

export const Button: Component<Props> = (props) => {
	return (
		<button
			{...props}
			class={`flex flex-row items-center space-x-2 border border-neutral-400 max-w-max px-4 py-1 ${props.class}`}
			classList={{
				"bg-white/5 text-neutral-400 border-neutral-400": props.disabled,
				"hover:bg-white/10": !props.disabled,
				"rounded-full": props.rounded,
				...props.classList,
			}}
		>
			{props.children}
		</button>
	);
};
