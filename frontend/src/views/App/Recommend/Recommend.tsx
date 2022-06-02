import { IVideoCompact } from "@api";
import { Video } from "@components";
import { useQueue, useVideo } from "@hooks";
import { useRecommendations } from "@hooks/useRecommendations";
import { Component, createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";

export const Recommend: Component = () => {
	let containerElement!: HTMLDivElement;

	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);

	const queue = useQueue();
	const video = useVideo({ videoId: () => relatedTargetVideoIds()[0] });
	const recommendations = useRecommendations();

	onMount(() => document.addEventListener("scroll", trimRelatedTargetVideosIds, true));
	onCleanup(() => document.removeEventListener("scroll", trimRelatedTargetVideosIds, true));

	const trimRelatedTargetVideosIds = () => {
		if (
			!video.data.loading &&
			containerElement &&
			window.innerHeight - containerElement.getBoundingClientRect().bottom > -512
		) {
			setRelatedTargetVideoIds((c) => c.slice(1));
		}
	};

	createEffect(() => {
		const videos = video.data()?.related;
		if (videos) {
			setRelatedVideos((c) => [...c, ...videos]);
			setTimeout(trimRelatedTargetVideosIds, 0);
		}
	});

	createEffect(() => {
		const data = recommendations.data();
		if (!data) return;
		const videoIds = [...data.mostPlayed, ...data.lastPlayed].map((v) => v.id);
		setRelatedTargetVideoIds(videoIds);
		setTimeout(trimRelatedTargetVideosIds, 0);
	});

	const videos = createMemo(() => {
		const mostPlayed = recommendations.data()?.mostPlayed || [];
		const lastPlayed = recommendations.data()?.lastPlayed || [];

		const videos = [...mostPlayed, ...lastPlayed.slice(0, 3), ...relatedVideos()];
		const uniqueVideos = videos.reduce((acc, curr) => {
			if (acc.find((v) => v.id === curr.id)) return acc;
			return [...acc, curr];
		}, [] as IVideoCompact[]);

		return uniqueVideos;
	});

	return (
		<div class="flex flex-col space-y-6">
			<h1 class="text-2xl font-medium">Recommended For You</h1>

			<Show when={!recommendations.data.loading} fallback={<div>Loading...</div>}>
				<div
					ref={containerElement}
					class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-x-6 gap-y-6 lg:gap-y-10"
				>
					<For each={videos()}>{(video) => <Video.Card video={video} onAddToQueue={queue.addTrack} />}</For>
				</div>
			</Show>
		</div>
	);
};
