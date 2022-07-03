import { IVideo } from "@api";
import { Video } from "@components";
import { useApp, useQueue, useVideo } from "@hooks";
import { useParams } from "solid-app-router";
import { Component, createMemo, For, onMount, Show } from "solid-js";

export const VideoDetail: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const params = useParams<{ id: string }>();
	const videoId = createMemo(() => params.id || "");
	const video = useVideo({ videoId });

	onMount(() => {
		app.setTitle("Related Video");
	});

	return (
		<Show when={video.data() && !video.data.loading} fallback={"Loading..."}>
			<div class="flex flex-col max-w-7xl">
				<Video.List
					video={video.data() as IVideo}
					onAddToQueue={queue.addTrack}
					onAddToQueueAndPlay={queue.addAndPlayTrack}
				/>

				<div class="my-6 w-full border-b border-neutral-600" />

				<div class="space-y-8">
					<For each={video.data()?.related || []}>
						{(video) => (
							<Video.List
								video={video}
								onAddToQueue={queue.addTrack}
								onAddToQueueAndPlay={queue.addAndPlayTrack}
							/>
						)}
					</For>
				</div>
			</div>
		</Show>
	);
};
