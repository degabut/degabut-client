import { IVideoCompact } from "@api";
import { Video } from "@components";
import { useQueue, useVideo, useVideos } from "@hooks";
import { useParams } from "solid-app-router";
import { Component, createEffect, createMemo, createSignal, For, onCleanup, onMount, Show } from "solid-js";

export const Recommend: Component = () => {
	const params = useParams<{ id: string }>();
	let containerElement!: HTMLDivElement;

	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);
	const [lastPlayedParams, setLastPlayedParams] = createSignal({ userId: params.id, last: 10 });
	const [mostPlayedParams, setMostPlayedParams] = createSignal({ userId: params.id, days: 30, count: 10 });

	const queue = useQueue();
	const video = useVideo({ videoId: () => relatedTargetVideoIds()[0] });
	const lastPlayedVideos = useVideos(lastPlayedParams);
	const mostPlayedVideos = useVideos(mostPlayedParams);

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
		const lastPlayed = lastPlayedVideos.data();
		const mostPlayed = mostPlayedVideos.data();
		if (!lastPlayed || !mostPlayed) return;
		const videoIds = [...mostPlayed, ...lastPlayed].map((v) => v.id);
		setRelatedTargetVideoIds(videoIds);
		setTimeout(trimRelatedTargetVideosIds, 0);
	});

	createEffect(() => {
		if (!params.id) return;

		lastPlayedVideos.mutate([]);
		mostPlayedVideos.mutate([]);
		setRelatedVideos([]);
		setLastPlayedParams((v) => ({ ...v, userId: params.id }));
		setMostPlayedParams((v) => ({ ...v, userId: params.id }));
	});

	const targetUser = createMemo(() => {
		return queue.data()?.voiceChannel.members.find((m) => m.id === params.id);
	});

	const videos = createMemo(() => {
		const mostPlayed = mostPlayedVideos.data() || [];
		const lastPlayed = lastPlayedVideos.data() || [];

		const mostLastPlayed = mostPlayed.filter((v) => lastPlayed.some((l) => l.id === v.id));

		const videos = [...mostLastPlayed, ...mostPlayed, ...lastPlayed, ...relatedVideos()];
		const uniqueVideos = videos.reduce((acc, curr) => {
			if (acc.find((v) => v.id === curr.id)) return acc;
			return [...acc, curr];
		}, [] as IVideoCompact[]);

		return uniqueVideos;
	});

	return (
		<div class="flex flex-col space-y-6">
			<h1 class="text-2xl font-medium">
				<Show when={targetUser()} fallback="Recommended For You">
					{(user) => `${user.displayName}#${user.discriminator} recommendation`}
				</Show>
			</h1>

			<div
				ref={containerElement}
				class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-5 gap-x-6 gap-y-6 md:gap-y-10"
			>
				<For each={videos()}>
					{(video) => (
						<Video.Card
							video={video}
							onAddToQueue={queue.addTrack}
							onAddToQueueAndPlay={queue.addAndPlayTrack}
						/>
					)}
				</For>
				<Show when={lastPlayedVideos.data.loading || mostPlayedVideos.data.loading || video.data.loading}>
					<For each={Array(10)}>{() => <Video.CardSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
};
