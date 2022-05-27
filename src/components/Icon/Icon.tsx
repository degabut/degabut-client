import { Component } from "solid-js";
import * as icons from "./icons";

export type Icons = keyof typeof icons;
export type IconSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

type Props = {
	name: Icons;
	size?: IconSize;
	extraClass?: string;
};

export const Icon: Component<Props> = ({ name, size, extraClass }) => {
	return (
		<svg
			class={extraClass}
			classList={{
				"w-2 h-2": size === "xs",
				"w-3 h-3": size === "sm",
				"w-4 h-4": size === "md",
				"w-5 h-5": size === "lg",
				"w-6 h-6": size === "xl",
				"w-8 h-8": size === "2xl",
				"w-10 h-10": size === "3xl",
			}}
			innerHTML={icons[name]}
		/>
	);
};
