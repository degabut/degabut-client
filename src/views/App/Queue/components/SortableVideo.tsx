import { ITrack } from "@api";
import { Icon, Video, VideoContextMenuItem } from "@components";
import { createSortable } from "@thisbeyond/solid-dnd";
import { Component } from "solid-js";

type Props = {
	track: ITrack;
	onRemove?: (track: ITrack) => void;
};

export const SortableVideo: Component<Props> = (props) => {
	const sortable = createSortable(props.track.id);

	return (
		<div
			class="flex flex-row-reverse justify-end items-center"
			classList={{ "opacity-75": sortable.isActiveDraggable }}
		>
			{/* Hacky way to make only part of the element clickable for sort */}
			<div class="ml-2 truncate flex-grow" use:sortable onMouseDown={(e) => e.stopPropagation()}>
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
					variant="small"
				/>
			</div>
			<div use:sortable>
				<Icon name="sortArrows" extraClass="fill-neutral-500 w-4 h-4" />
			</div>
		</div>
	);
};
