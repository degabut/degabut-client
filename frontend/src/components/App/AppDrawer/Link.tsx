import { Icon, Icons, RouterLink } from "@components";
import { useMatch } from "solid-app-router";
import { Component } from "solid-js";

type Props = {
	icon: Icons;
	label: string;
	path: string;
	onClick: () => void;
};

export const Link: Component<Props> = (props) => {
	const isActive = useMatch(() => props.path);

	return (
		<RouterLink
			href={props.path}
			class="flex flex-row fill-current items-center space-x-4 cursor-pointer px-6 py-4 transition-colors"
			classList={{
				"text-neutral-400 hover:bg-white/5": !isActive(),
				"text-neutral-100 bg-white/10 font-medium": !!isActive(),
			}}
			onClick={props.onClick}
		>
			<Icon name={props.icon} size="lg" />
			<div>{props.label}</div>
		</RouterLink>
	);
};
