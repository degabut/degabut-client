import { ITrack, IVideoCompact } from "@api";
import { closestCenter, DragDropProvider, DragDropSensors, SortableProvider } from "@thisbeyond/solid-dnd";
import { Component, For } from "solid-js";
import { SortableVideo } from "./SortableVideo";

type OnDragEnd = Parameters<typeof DragDropProvider>[0]["onDragEnd"];

type Props = {
	tracks: ITrack[];
	onRemoveTrack?: (track: ITrack) => void;
	onDragTrackStart?: () => void;
	onDragTrackEnd?: () => void;
	onChangeTrackOrder?: (fromIndex: number, toIndex: number, id: string) => void;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const TrackList: Component<Props> = (props) => {
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
		<DragDropProvider onDragStart={onDragStart} onDragEnd={onDragEnd} collisionDetector={closestCenter}>
			<DragDropSensors />
			<div class="space-y-4">
				<SortableProvider ids={ids()}>
					<For each={props.tracks}>
						{(track) => (
							<SortableVideo
								track={track as ITrack}
								onRemove={props.onRemoveTrack}
								onAddToQueue={props.onAddToQueue}
							/>
						)}
					</For>
				</SortableProvider>
			</div>
		</DragDropProvider>
	);
};
