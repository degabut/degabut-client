import { addTrack, ITrack, IVideoCompact, orderTrack, removeTrack } from "@api";
import { Button, Icon, Video } from "@components";
import { queueStore } from "@stores";
import { Link } from "solid-app-router";
import { Component, createEffect, createMemo, createSignal, Show } from "solid-js";
import { createStore } from "solid-js/store";
import { TrackList } from "./components";

export const Queue: Component = () => {
	const { data: queue } = queueStore;

	const [isDragging, setIsDragging] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const [freezeTracks, setFreezeTrack] = createSignal(false);

	const [tracks, setTracks] = createStore(queue()?.tracks.slice(1) || []);
	const nowPlaying = createMemo(() => queue()?.tracks[0]);

	createEffect(() => !isLoading() && queueStore.refetch());
	createEffect(() => queue() && setFreezeTrack(false));

	createEffect(() => {
		if (!isDragging() && !isLoading() && !freezeTracks()) {
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
		setFreezeTrack(true);
		await fn();
		setIsLoading(false);
	};

	return (
		<>
			<h1 class="text-2xl font-medium">Queue</h1>

			{queue() && (
				<>
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
									<Button rounded onClick={() => onRemoveTrack(track)} disabled={freezeTracks()}>
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

					<div class="my-3 lg:my-6 w-full border-b border-neutral-600" />

					<div class="space-y-4">
						<div class="font-normal text-lg">Track List</div>
						{!tracks.length && <div>Empty</div>}

						<div classList={{ "opacity-50 pointer-events-none": isLoading() || freezeTracks() }}>
							<TrackList
								tracks={tracks as ITrack[]}
								onDragTrackStart={() => setIsDragging(true)}
								onDragTrackEnd={() => setIsDragging(false)}
								onChangeTrackOrder={onChangeTrackOrder}
								onRemoveTrack={onRemoveTrack}
								onAddToQueue={onAddToQueue}
							/>
						</div>
					</div>
				</>
			)}
		</>
	);
};
