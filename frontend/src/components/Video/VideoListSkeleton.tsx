import { Component } from "solid-js";
import { ChannelThumbnailSkeleton } from "./components/ChannelThumbnailSkeleton";
import { VideoThumbnailSkeleton } from "./components/VideoThumbnailSkeleton";

type Props = {
	variant?: "small" | "normal";
};

export const VideoListSkeleton: Component<Props> = (props) => {
	return props.variant === "small" ? (
		<div class="flex flex-row items-center space-x-1.5 md:space-x-3 w-full md:pr-2">
			<div class="h-12 w-12 md:w-[6rem] md:h-[3.375rem] ">
				<VideoThumbnailSkeleton variant="small" />
			</div>
			<div class="flex flex-col flex-grow flex-shrink md:space-y-1 py-1">
				<div class="max-w-[32rem] h-4 rounded-full bg-neutral-900 animate-pulse" />
				<div class="max-w-[8rem] h-4 rounded-full bg-neutral-900 animate-pulse" />
			</div>
		</div>
	) : (
		<div class="flex flex-col sm:flex-row sm:space-x-2 space-y-2 md:space-y-0">
			<div class="sm:w-[20rem] w-full">
				<VideoThumbnailSkeleton />
			</div>
			<div class="flex flex-col space-y-4 w-full px-2 py-3">
				<div class="max-w-[32rem] h-5 rounded-full bg-neutral-900 animate-pulse" />
				<div class="flex flex-col space-y-1">
					<div class="max-w-[8rem] h-4 rounded-full bg-neutral-900 animate-pulse" />
					<div class="flex flex-row space-x-2 text-sm items-center">
						<ChannelThumbnailSkeleton />
						<div class="w-full max-w-[8rem] h-4 rounded-full bg-neutral-900 animate-pulse" />
					</div>
				</div>
			</div>
		</div>
	);
};
