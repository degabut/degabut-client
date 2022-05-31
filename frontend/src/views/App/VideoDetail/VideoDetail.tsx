import { addTrackByVideoId, IVideo, type IVideoCompact } from "@api";
import { Video } from "@components";
import { useVideo } from "@hooks";
import { useParams } from "solid-app-router";
import { Component, createMemo, For, Show } from "solid-js";

export const VideoDetail: Component = () => {
	const params = useParams<{ id: string }>();
	const videoId = createMemo(() => params.id || "");
	const video = useVideo({ videoId });

	const onAddToQueue = async (video: IVideoCompact) => {
		await addTrackByVideoId(video.id);
	};

	return (
		<Show when={video.data() && !video.data.loading} fallback={"Loading..."}>
			<div class="flex flex-col">
				<Video.List video={video.data() as IVideo} onAddToQueue={onAddToQueue} />

				<div class="my-3 w-full border-b border-neutral-600" />

				<div class="text-lg font-medium my-4">Related Video</div>

				<div class="space-y-8">
					<For each={video.data()?.related || []}>
						{(video) => <Video.List video={video} onAddToQueue={onAddToQueue} />}
					</For>
				</div>
			</div>
		</Show>
	);
};