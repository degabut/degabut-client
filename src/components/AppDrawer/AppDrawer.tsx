import { Icon } from "@components/Icon";
import { queueStore } from "@stores";
import { Link as SolidLink } from "solid-app-router";
import { Component, createMemo, Show } from "solid-js";
import { Link } from "./Link";

export const AppDrawer: Component = () => {
	const nowPlaying = createMemo(() => queueStore.data()?.tracks[0] || null);

	return (
		<div class="flex flex-col h-full w-[16rem] bg-black overflow-y-auto overflow-x-hidden">
			<div class="px-6 font-semibold text-2xl truncate py-8" title="Regular Voice">
				Degabut
			</div>
			<div class="flex-grow text-lg">
				<Link icon="audioPlaylist" label="Queue" path="/app/queue" />
				<Link icon="search" label="Search" path="/app/search" />
				<Link icon="heart" label="For You" path="/app/recommended" />
			</div>

			<Show when={nowPlaying()}>
				{({ video, requestedBy }) => (
					<SolidLink
						href="/app/queue"
						class="relative flex flex-col space-y-3 px-2 py-4 cursor-pointer"
						title={video.title}
					>
						<div class="text-lg font-medium">Now Playing</div>
						<div class="flex flex-row space-x-2">
							<img class="object-cover h-16 w-16" src={video.thumbnails[0].url} alt={video.title} />
							<div class="flex-grow flex flex-col truncate">
								<div class="truncate">{video.title}</div>
								<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
								<div class="truncate text-sm text-neutral-400">
									Requested By {requestedBy.displayName}
								</div>
							</div>
						</div>

						<Icon name="musicNote" extraClass="absolute bottom-2 right-2 w-24 h-24 fill-white opacity-10" />
					</SolidLink>
				)}
			</Show>
		</div>
	);
};
