import { Icon } from "@components";
import { useApp } from "@hooks";
import { Component } from "solid-js";

export const AppHeader: Component = () => {
	const app = useApp();

	return (
		<div class="flex flex-row items-center bg-neutral-900 h-14 px-2 md:px-4 py-2 space-x-2">
			<div class="md:hidden cursor-pointer p-2" onClick={() => app.setIsMenuOpen((v) => !v)}>
				<Icon name="list" size="md" extraClass="fill-white m-2" />
			</div>
			<div class="flex-grow text-lg md:text-xl font-medium truncate px-2">{app?.title()}</div>
			<div class="cursor-pointer p-2" onClick={() => app.setIsMemberOpen((v) => !v)}>
				<Icon name="people" extraClass="fill-white w-5 h-5" />
			</div>
		</div>
	);
};
