import { VideoListSkeleton } from "@components/Video/VideoListSkeleton";
import { Component, For } from "solid-js";

export const QueueTrackListSkeleton: Component = () => {
	return (
		<div class="space-y-4">
			<For each={Array(5)}>{() => <VideoListSkeleton variant="small" />}</For>
		</div>
	);
};
