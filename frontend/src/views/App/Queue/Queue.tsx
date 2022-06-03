import { ITrack } from "@api";
import { Button, Icon, Link, RouterLink, Tabs, Video } from "@components";
import { TabLabel } from "@components/Tabs/TabLabel";
import { useQueue } from "@hooks";
import { Component, createEffect, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { QueuePlayHistory, QueueTrackList } from "./components";

export const Queue: Component = () => {
	const queue = useQueue();

	const [isDragging, setIsDragging] = createSignal(false);

	const [tracks, setTracks] = createStore(queue.data()?.tracks.slice(1) || []);

	createEffect(() => !queue.isTrackLoading() && queue.refetch());

	createEffect(() => {
		if (!isDragging() && !queue.isTrackLoading() && !queue.isTrackFreezed()) {
			const newTracks = queue.data()?.tracks.slice(1) || [];

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
		<>
			<h1 class="text-2xl font-medium">Queue</h1>

			{queue.data() && (
				<div class="flex flex-col space-y-8">
					<Show
						when={queue.data()?.nowPlaying}
						fallback={
							<div class="my-4">
								Nothing is playing,{" "}
								<Link href="/app/search" class="underline underline-offset-1">
									search for a song
								</Link>
							</div>
						}
					>
						{(track) => (
							<div class="mt-4 md:mt-8 space-y-4">
								<div class="text-xl font-normal">Now Playing</div>
								<Video.List
									{...track}
									onAddToQueue={queue.addTrack}
									extraContainerClass="!bg-transparent"
								/>
								<div class="flex flex-row space-x-4">
									<Button
										rounded
										onClick={() => queue.removeTrack(track)}
										disabled={queue.isTrackFreezed()}
									>
										<Icon name="forward" extraClass="w-4 h-4 fill-current" />
										<div>Skip</div>
									</Button>
									<RouterLink href={`/app/video/${track.video.id}`}>
										<Button rounded>
											<Icon name="list" extraClass="w-4 h-4 fill-current" />
											<div>Related</div>
										</Button>
									</RouterLink>
								</div>
							</div>
						)}
					</Show>

					<Tabs
						extraContainerClass="pt-4 md:pt-8"
						extraTabsClass="w-full sticky top-0 z-30"
						items={[
							{
								id: "trackList",
								label: ({ isActive }) => (
									<TabLabel icon="audioPlaylist" label="Track List" isActive={isActive} />
								),
								element: (
									<QueueTrackList
										tracks={tracks as ITrack[]}
										isFreezed={queue.isTrackLoading() || queue.isTrackFreezed()}
										onDragTrackStart={() => setIsDragging(true)}
										onDragTrackEnd={() => setIsDragging(false)}
										onChangeTrackOrder={onChangeTrackOrder}
										onRemoveTrack={queue.removeTrack}
										onAddToQueue={queue.addTrack}
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
										tracks={queue.data()?.history.slice(1) || []}
										onAddToQueue={queue.addTrack}
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
