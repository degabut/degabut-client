import { ITrack, LoopType } from "@api";
import { Tabs, Video } from "@components";
import { TabLabel } from "@components/Tabs/TabLabel";
import { useApp, useQueue } from "@hooks";
import { Component, createEffect, createSignal, onMount, Show } from "solid-js";
import { createStore } from "solid-js/store";
import {
	LoopToggleButton,
	QueuePlayHistory,
	QueueTrackList,
	QueueTrackListSkeleton,
	ShuffleToggleButton,
	SkipButton,
} from "./components";

export const Queue: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const [isDragging, setIsDragging] = createSignal(false);

	const [tracks, setTracks] = createStore(queue.data()?.tracks || []);

	onMount(() => app.setTitle("Queue"));

	createEffect(() => !queue.isTrackLoading() && queue.refetch());

	createEffect(() => {
		if (!isDragging() && !queue.isTrackLoading() && !queue.isTrackFreezed()) {
			const newTracks = queue.data()?.tracks || [];

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

		await queue.changeTrackOrder(trackId, toIndex);
	};

	return (
		<div class="max-w-7xl">
			<div class="flex flex-col space-y-6">
				<div class="flex flex-col space-y-3">
					<Show when={queue.data()?.nowPlaying} fallback={<div />}>
						{(track) => (
							<div class="space-y-4">
								<div class="text-xl font-normal">Now Playing</div>
								<Video.List
									{...track}
									onAddToQueue={queue.addTrack}
									onAddToQueueAndPlay={queue.addAndPlayTrack}
									extraContainerClass="!bg-transparent"
								/>
							</div>
						)}
					</Show>

					<div class="flex flex-row items-center justify-evenly md:justify-start space-x-4">
						<Show when={queue.data()?.nowPlaying}>
							{() => <SkipButton onClick={() => queue.skipTrack()} disabled={queue.isTrackFreezed()} />}
						</Show>
						<ShuffleToggleButton
							defaultValue={!!queue.data()?.shuffle}
							onChange={() => queue.toggleShuffle()}
							disabled={queue.isQueueFreezed()}
						/>
						<LoopToggleButton
							defaultValue={queue.data()?.loopType || LoopType.DISABLED}
							onChange={(t) => queue.changeLoopType(t)}
							disabled={queue.isQueueFreezed()}
						/>
					</div>
				</div>

				<Tabs
					extraContainerClass="pt-4 md:pt-8"
					extraTabsClass="w-full sticky top-0 z-30"
					items={[
						{
							id: "trackList",
							label: (props) => (
								<TabLabel icon="audioPlaylist" label="Track List" isActive={props.isActive} />
							),
							element: (
								<>
									{queue.isInitialLoading() ? (
										<QueueTrackListSkeleton />
									) : (
										<QueueTrackList
											tracks={tracks as ITrack[]}
											nowPlaying={queue.data()?.nowPlaying || null}
											isFreezed={queue.isTrackLoading() || queue.isTrackFreezed()}
											onDragTrackStart={() => setIsDragging(true)}
											onDragTrackEnd={() => setIsDragging(false)}
											onChangeTrackOrder={onChangeTrackOrder}
											onPlayTrack={queue.playTrack}
											onRemoveTrack={queue.removeTrack}
											onAddToQueue={queue.addTrack}
											onAddToQueueAndPlay={queue.addAndPlayTrack}
										/>
									)}
								</>
							),
						},
						{
							id: "queueHistory",
							label: (props) => <TabLabel icon="history" label="History" isActive={props.isActive} />,
							element: (
								<>
									{queue.isInitialLoading() ? (
										<QueueTrackListSkeleton />
									) : (
										<QueuePlayHistory
											tracks={queue.data()?.history.slice(1) || []}
											onAddToQueue={queue.addTrack}
											onAddToQueueAndPlay={queue.addAndPlayTrack}
										/>
									)}
								</>
							),
						},
					]}
				/>
			</div>
		</div>
	);
};
