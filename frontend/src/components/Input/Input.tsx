import { Component, JSX } from "solid-js";

export type InputProps = JSX.InputHTMLAttributes<HTMLInputElement> & {
	rounded?: boolean;
};

export const Input: Component<InputProps> = (props) => {
	return (
		<input
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
