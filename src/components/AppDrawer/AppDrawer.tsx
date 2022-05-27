import { Component } from "solid-js";
import { Link } from "./Link";

export const AppDrawer: Component = () => {
	return (
		<div class="flex-shrink-0 h-full w-[16rem] bg-black py-8">
			<div class="px-6 font-semibold text-2xl truncate py-1" title="Regular Voice">
				Degabut
			</div>
			<div class="text-lg mt-6">
				<Link icon="audioPlaylist" label="Queue" path="/app/queue" />
				<Link icon="search" label="Search" path="/app/search" />
				<Link icon="heart" label="For You" path="/app/recommended" />
			</div>
		</div>
	);
};
