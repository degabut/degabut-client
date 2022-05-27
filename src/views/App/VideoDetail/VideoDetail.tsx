import { addTrack, type IVideoCompact } from "@api";
import { Video } from "@components";
import { useVideo } from "@hooks";
import { useParams } from "solid-app-router";
import { Component, createMemo, For, Show } from "solid-js";

export const VideoDetail: Component = () => {
	const params = useParams<{ id: string }>();
	const videoId = createMemo(() => params.id || "");
	const video = useVideo({ videoId });

	const onAddToQueue = async (video: IVideoCompact) => {
		await addTrack(video.id);
	};

	return (
		<Show when={video.data()}>
			{(video) => (
				<div class="flex flex-col">
					<Video.List video={video} />

					<div class="my-3 w-full border-b border-neutral-600" />

					<div class="text-lg font-medium my-4">Related Video</div>

					<div class="space-y-8">
						<For each={video.related || []}>
							{(video) => <Video.List video={video} onAddToQueue={onAddToQueue} />}
						</For>
					</div>
				</div>
			)}
		</Show>
	);
};
