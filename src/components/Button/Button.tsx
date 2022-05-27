import { Component, JSX } from "solid-js";

type Props = JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
	rounded?: boolean;
};

export const Button: Component<Props> = (props) => {
	return (
		<button
			{...props}
			class="flex flex-row items-center space-x-2 border border-neutral-400  max-w-max px-4 py-1"
			classList={{
				"rounded-full": props.rounded,
				...props.classList,
			}}
		>
			{props.children}
		</button>
	);
};
