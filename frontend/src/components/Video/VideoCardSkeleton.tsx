import { Component } from "solid-js";
import { ChannelThumbnailSkeleton } from "./components/ChannelThumbnailSkeleton";
import { VideoThumbnailSkeleton } from "./components/VideoThumbnailSkeleton";

export const VideoCardSkeleton: Component = () => {
	return (
		<div class="flex flex-col space-y-3">
			<VideoThumbnailSkeleton />
			<div class="flex flex-row items-start space-x-2">
				<ChannelThumbnailSkeleton />
				<div class="flex flex-col flex-grow space-y-2 truncate">
					<div class="w-full h-4 rounded-full bg-neutral-900 animate-pulse" />
					<div class="w-1/2 h-4 rounded-full bg-neutral-900 animate-pulse" />
					<div class="w-1/2 h-4 rounded-full bg-neutral-900 animate-pulse" />
				</div>
			</div>
		</div>
	);
};
