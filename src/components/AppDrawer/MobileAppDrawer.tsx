import { Component } from "solid-js";
import { MobileLink } from "./MobileLink";

export const MobileAppDrawer: Component = () => {
	return (
		<div class="bg-black w-full h-full">
			<div class="flex flex-row flex-wrap items-center h-full">
				<MobileLink icon="audioPlaylist" label="Queue" path="/app/queue" />
				<MobileLink icon="search" label="Search" path="/app/search" />
				<MobileLink icon="heart" label="For You" path="/app/recommended" />
			</div>
		</div>
	);
};
