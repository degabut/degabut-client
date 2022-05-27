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
			class="flex flex-col flex-grow h-full space-y-1 fill-current items-center justify-center text-center cursor-pointer"
			classList={{
				"text-neutral-400 hover:bg-white hover:bg-opacity-5": !isActive(),
				"text-neutral-50 bg-white bg-opacity-5 font-medium": !!isActive(),
			}}
		>
			<div class="pt-1">
				<Icon name={icon} size="md" />
			</div>
			<div>{label}</div>
		</SolidLink>
	);
};
