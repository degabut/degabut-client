import { addTrack, ITrack, IVideoCompact, orderTrack, removeTrack } from "@api";
import { Button, Icon, Tabs, Video } from "@components";
import { TabLabel } from "@components/Tabs/TabLabel";
import { queueStore } from "@stores";
import { Link } from "solid-app-router";
import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { QueuePlayHistory, QueueTrackList } from "./components";

export const Queue: Component = () => {
	const { data: queue } = queueStore;

	const [isDragging, setIsDragging] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(false);

	const [tracks, setTracks] = createStore(queue()?.tracks.slice(1) || []);
	const nowPlaying = createMemo(() => queue()?.tracks[0]);

	createEffect(() => !isLoading() && queueStore.refetch());
	createEffect(() => queue() && setIsTrackFreezed(false));

	createEffect(() => {
		if (!isDragging() && !isLoading() && !isTrackFreezed()) {
			const newTracks = queue()?.tracks.slice(1) || [];

			const newTrackIds = newTracks.map((t) => t.id).join(",");
			const oldTrackIds = tracks.map((t) => t.id).join(",");
			if (newTrackIds === oldTrackIds) return;

			setTracks([]);
			setTimeout(() => setTracks(newTracks), 0);
		}
	});

	const onChangeTrackOrder = async (fromIndex: number, toIndex: number, trackId: string) => {
		const updatedItems = tracks.slice();
		updatedItems.splice(toIndex, 0, ...updatedItems.splice(fromIndex, 1));
		setTracks(updatedItems);

		await modifyTrack(() => orderTrack(trackId, toIndex + 1));
	};

	const onRemoveTrack = async (track: ITrack) => {
		await modifyTrack(() => removeTrack(track.id));
	};

	const onAddToQueue = async (video: IVideoCompact) => {
		await modifyTrack(() => addTrack(video.id));
	};

	const modifyTrack = async (fn: () => Promise<unknown>) => {
		setIsLoading(true);
		setIsTrackFreezed(true);
		await fn();
		setIsLoading(false);
	};

	return (
		<>
			<h1 class="text-2xl font-medium">Queue</h1>

			{queue() && (
				<div class="flex flex-col space-y-8">
					<Show
						when={nowPlaying()}
						fallback={
							<div class="my-4">
								Nothing is playing,{" "}
								<a href="/app/search" class="underline underline-offset-1">
									search for a song
								</a>
							</div>
						}
					>
						{(track) => (
							<div class="mt-4 lg:mt-8 space-y-4">
								<div class="text-xl font-normal">Now Playing</div>
								<Video.List {...track} onAddToQueue={onAddToQueue} />
								<div class="flex flex-row space-x-4">
									<Button rounded onClick={() => onRemoveTrack(track)} disabled={isTrackFreezed()}>
										<Icon name="forward" extraClass="w-4 h-4 fill-current" />
										<div>Skip</div>
									</Button>
									<Link href={`/app/video/${track.video.id}`}>
										<Button rounded>
											<Icon name="list" extraClass="w-4 h-4 fill-current" />
											<div>Related</div>
										</Button>
									</Link>
								</div>
							</div>
						)}
					</Show>

					<Tabs
						extraContainerClass="pt-4 lg:pt-8"
						extraTabsClass="border-b border-neutral-700 w-full space-x-1"
						items={[
							{
								id: "trackList",
								label: ({ isActive }) => (
									<TabLabel icon="audioPlaylist" label="Track List" isActive={isActive} />
								),
								element: (
									<QueueTrackList
										tracks={tracks as ITrack[]}
										isFreezed={isLoading() || isTrackFreezed()}
										onDragTrackStart={() => setIsDragging(true)}
										onDragTrackEnd={() => setIsDragging(false)}
										onChangeTrackOrder={onChangeTrackOrder}
										onRemoveTrack={onRemoveTrack}
										onAddToQueue={onAddToQueue}
									/>
								),
							},
							{
								id: "queueHistory",
								label: ({ isActive }) => (
									<TabLabel icon="history" label="History" isActive={isActive} />
								),
								element: (
									<QueuePlayHistory
										tracks={queue()?.history.slice(1) || []}
										onAddToQueue={onAddToQueue}
									/>
								),
							},
						]}
					/>
				</div>
			)}
		</>
	);
};
