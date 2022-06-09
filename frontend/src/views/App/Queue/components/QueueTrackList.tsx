import { ITrack, IVideoCompact } from "@api";
import { Icon, RouterLink } from "@components";
import { closestCenter, DragDropProvider, DragDropSensors, SortableProvider } from "@thisbeyond/solid-dnd";
import { Component, For } from "solid-js";
import { SortableVideo } from "./SortableVideo";

type OnDragEnd = Parameters<typeof DragDropProvider>[0]["onDragEnd"];

const EmptyTrack: Component = () => {
	return (
		<div class="flex flex-col space-y-8 justify-center items-center mt-12">
			<Icon name="snooze" extraClass="fill-neutral-400 opacity-10" />
			<div class="text-xl text-center">
				Queue is empty,{" "}
				<RouterLink href="/app/search" class="underline underline-offset-1">
					search for a song
				</RouterLink>
				?
			</div>
		</div>
	);
};

type Props = {
	tracks: ITrack[];
	nowPlaying?: ITrack | null;
	isFreezed: boolean;
	onRemoveTrack?: (track: ITrack) => void;
	onDragTrackStart?: () => void;
	onDragTrackEnd?: () => void;
	onChangeTrackOrder?: (fromIndex: number, toIndex: number, id: string) => void;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const QueueTrackList: Component<Props> = (props) => {
	const ids = () => props.tracks.map((t) => t.id);

	const onDragStart = () => props.onDragTrackStart?.();
	const onDragEnd: OnDragEnd = async ({ draggable, droppable }) => {
		if (draggable && droppable) {
			const currentItems = ids();
			const fromIndex = currentItems.indexOf(draggable.id as string);
			const toIndex = currentItems.indexOf(droppable.id as string);
			if (fromIndex !== toIndex) props.onChangeTrackOrder?.(fromIndex, toIndex, draggable.id as string);
		}
		props.onDragTrackEnd?.();
	};

	return (
		<div class="space-y-4">
			{!props.tracks.length && <EmptyTrack />}

			<div classList={{ "opacity-50 pointer-events-none": props.isFreezed }}>
				<DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
					<DragDropSensors />
					<div class="space-y-4">
						<SortableProvider ids={ids()}>
							<For each={props.tracks}>
								{(track) => (
									<SortableVideo
										isActive={track.id === props.nowPlaying?.id}
										track={track as ITrack}
										onRemove={props.onRemoveTrack}
										onAddToQueue={props.onAddToQueue}
									/>
								)}
							</For>
						</SortableProvider>
					</div>
				</DragDropProvider>
			</div>
		</div>
	);
};
