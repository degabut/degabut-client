import { IVideoCompact } from "@api";
import { Video } from "@components";
import { useQueue, useVideo } from "@hooks";
import { useRecommendations } from "@hooks/useRecommendations";
import { Component, createEffect, createMemo, createSignal, For, Show } from "solid-js";

export const Recommend: Component = () => {
	const queue = useQueue();

	const [randomMostPlayedVideoId, setRandomMostPlayedVideoId] = createSignal<string>("");
	const [randomLastPlayedVideoId, setRandomLastPlayedVideoId] = createSignal<string>("");

	const randomMostPlayedVideo = useVideo({ videoId: randomMostPlayedVideoId });
	const randomLastPlayedVideo = useVideo({ videoId: randomLastPlayedVideoId });
	const recommendations = useRecommendations();

	createEffect(() => {
		const mostPlayed = recommendations.data()?.mostPlayed || [];
		const lastPlayed = recommendations.data()?.lastPlayed || [];

		setRandomMostPlayedVideoId(mostPlayed[Math.floor(Math.random() * mostPlayed.length)]?.id);
		setRandomLastPlayedVideoId(lastPlayed[Math.floor(Math.random() * Math.min(mostPlayed.length, 3))]?.id);
	});

	const videos = createMemo(() => {
		const lastPlayed = recommendations.data()?.lastPlayed || [];
		const mostPlayed = recommendations.data()?.mostPlayed || [];
		const randomRelatedMostPlayed = randomMostPlayedVideo.data()?.related || [];
		const randomRelatedLastPlayed = randomLastPlayedVideo.data()?.related || [];

		const videos = [
			...mostPlayed,
			...lastPlayed.slice(0, 3),
			...randomRelatedMostPlayed,
			...randomRelatedLastPlayed.slice(0, 3),
		];

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
				<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-x-6 gap-y-6 lg:gap-y-10">
					<For each={videos()}>{(video) => <Video.Card video={video} onAddToQueue={queue.addTrack} />}</For>
				</div>
			</Show>
		</div>
	);
};
