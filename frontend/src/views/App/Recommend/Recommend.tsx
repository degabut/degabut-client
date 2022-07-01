import { Video } from "@components";
import { useQueue, useRecommendation } from "@hooks";
import { useParams } from "solid-app-router";
import { Component, createMemo, For, onCleanup, onMount, Show } from "solid-js";

export const Recommend: Component = () => {
	const params = useParams<{ id: string }>();
	let containerElement!: HTMLDivElement;

	const queue = useQueue();
	const recommendation = useRecommendation({ userId: () => params.id, onLoad: () => attemptLoadNext() });

	const targetUser = createMemo(() => {
		return queue.data()?.voiceChannel.members.find((m) => m.id === params.id);
	});

	const attemptLoadNext = () => {
		if (
			!recommendation.isLoading() &&
			containerElement &&
			window.innerHeight - containerElement.getBoundingClientRect().bottom > -512
		) {
			recommendation.loadNext();
		}
	};

	onMount(() => document.addEventListener("scroll", attemptLoadNext, true));
	onCleanup(() => document.removeEventListener("scroll", attemptLoadNext, true));

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
				<For each={recommendation.videos()}>
					{(video) => (
						<Video.Card
							video={video}
							onAddToQueue={queue.addTrack}
							onAddToQueueAndPlay={queue.addAndPlayTrack}
						/>
					)}
				</For>
				<Show when={recommendation.isLoading()}>
					<For each={Array(10)}>{() => <Video.CardSkeleton />}</For>
				</Show>
			</div>
		</div>
	);
};
