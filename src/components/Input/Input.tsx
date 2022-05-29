import { Component, JSX } from "solid-js";

type Props = JSX.InputHTMLAttributes<HTMLInputElement> & {
	rounded?: boolean;
};

export const Input: Component<Props> = (props) => {
	return (
		<input
			{...props}
			class="w-full lg:max-w-[32rem] bg-white rounded-full py-2 px-4 outline-0 text-black"
			classList={{
				"rounded-full": !!props.rounded,
				"bg-neutral-300 text-neutral-500": !!props.disabled,
				...props.classList,
			}}
		/>
	);
};
