import { Icon, Icons } from "@components/Icon";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	iconSize?: "normal" | "large";
	label: string;
};

export const VideoContextMenuItem: Component<Props> = (props) => {
	return (
		<div class="flex flex-row space-x-6 items-center">
			<Icon
				name={props.icon}
				extraClass="fill-current text-neutral-400"
				extraClassList={{
					"h-4 w-4": props.iconSize !== "large",
					"h-5 w-4": props.iconSize === "large",
				}}
			/>
			<div>{props.label}</div>
		</div>
	);
};
