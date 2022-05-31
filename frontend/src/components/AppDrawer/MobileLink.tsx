import { Link as SolidLink, useMatch } from "solid-app-router";
import { Component } from "solid-js";
import { Icon, Icons } from "../Icon";

type Props = {
	icon: Icons;
	label: string;
	path: string;
};

export const MobileLink: Component<Props> = ({ icon, label, path }) => {
	const isActive = useMatch(() => path);

	return (
		<SolidLink
			href={path}
			class="flex flex-col flex-grow h-full space-y-1 py-2 fill-current items-center justify-center text-center cursor-pointer transition-colors "
			classList={{
				"text-neutral-400 hover:bg-white/5": !isActive(),
				"text-neutral-100 bg-white/10 font-medium": !!isActive(),
			}}
		>
			<div class="pt-1">
				<Icon name={icon} size="md" />
			</div>
			<div>{label}</div>
		</SolidLink>
	);
};
