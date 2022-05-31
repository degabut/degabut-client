import { Icon } from "@components";
import { VideoThumbnail } from "@components/Video/components";
import { queueStore } from "@stores";
import { Link as SolidLink } from "solid-app-router";
import { Component, createMemo, Show } from "solid-js";
import { MobileLink } from "./MobileLink";

export const MobileAppDrawer: Component = () => {
	const nowPlaying = createMemo(() => queueStore.data()?.tracks[0] || null);

	return (
		<div class="flex flex-col w-full h-full">
			<Show when={nowPlaying()}>
				{({ video }) => (
					<div class="bg-neutral-900 w-full p-1.5">
						<SolidLink
							href="/app/queue"
							class="flex flex-row space-x-3 p-2 rounded bg-gray-800 cursor-pointer items-center"
							title={video.title}
						>
							<VideoThumbnail video={video} variant="small" />
							<div class="flex flex-col truncate">
								<div class="truncate">{video.title}</div>
								<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
							</div>

							<Icon name="musicNote" extraClass="absolute right-4 w-12 h-12 fill-white/10" />
						</SolidLink>
					</div>
				)}
			</Show>

			<div class="flex flex-row flex-wrap bg-black items-center h-full">
				<MobileLink icon="audioPlaylist" label="Queue" path="/app/queue" />
				<MobileLink icon="search" label="Search" path="/app/search" />
				<MobileLink icon="heart" label="For You" path="/app/recommended" />
			</div>
		</div>
	);
};
