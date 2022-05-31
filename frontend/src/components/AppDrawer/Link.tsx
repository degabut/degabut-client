import { Link as SolidLink, useMatch } from "solid-app-router";
import { Component } from "solid-js";
import { Icon, Icons } from "../Icon";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

export const Link: Component<Props> = ({ icon, label, path }) => {
	const isActive = useMatch(() => path);

	return (
		<SolidLink
			href={path}
			class="flex flex-row fill-current items-center space-x-4 cursor-pointer px-6 py-3 transition-colors"
			classList={{
				"text-neutral-400 hover:bg-white/5": !isActive(),
				"text-neutral-100 bg-white/10 font-medium": !!isActive(),
			}}
		>
			<Icon name={icon} size="lg" />
			<div>{label}</div>
		</SolidLink>
	);
};
