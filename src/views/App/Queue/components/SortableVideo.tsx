import { ITrack, IVideoCompact } from "@api";
import { Icon, Video, VideoContextMenuItem } from "@components";
import { createSortable } from "@thisbeyond/solid-dnd";
import { Component } from "solid-js";

type Props = {
	track: ITrack;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	onRemove?: (track: ITrack) => void;
};

export const SortableVideo: Component<Props> = (props) => {
	const sortable = createSortable(props.track.id);

	return (
		<div
			use:sortable
			class="flex flex-row-reverse justify-end items-center touch-none"
			classList={{ "opacity-75": sortable.isActiveDraggable }}
		>
			<div class="ml-2 truncate flex-grow" onMouseDown={(e) => e.stopPropagation()}>
				<Video.List
					{...props.track}
					extraContextMenuItems={[
						{
							element: () => (
								<VideoContextMenuItem icon="trashBin" label="Remove from Queue" iconSize="large" />
							),
							onClick: () => props.onRemove?.(props.track),
						},
					]}
					onAddToQueue={props.onAddToQueue}
					variant="small"
				/>
			</div>
			<Icon name="sortArrows" extraClass="fill-neutral-500 w-4 h-4 cursor-pointer" />
		</div>
	);
};
