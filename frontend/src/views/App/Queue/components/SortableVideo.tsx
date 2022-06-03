import { ITrack, IVideoCompact } from "@api";
import { Icon, Video, VideoContextMenuItem } from "@components";
import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, createSignal, onMount } from "solid-js";

type Props = {
	track: ITrack;
	isActive: boolean;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	onRemove?: (track: ITrack) => void;
};

type Pos = {
	x: number;
	y: number;
};

export const SortableVideo: Component<Props> = (props) => {
	const sortable = createSortable(props.track.id);
	let draggerElement!: HTMLDivElement;
	const [dragPosition, setDragPosition] = createSignal<Pos>({ x: 0, y: 0 });

	onMount(() => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(onDragMove);
		});

		observer.observe(draggerElement, { attributes: true, attributeFilter: ["style"] });
	});

	const onDragMove = () => {
		const position = draggerElement.style.transform.split("(")[1]?.split(",", 2);
		if (position) {
			const [x, y] = position.map((p) => +p.replace(/[^0-9-]/g, ""));
			setDragPosition({ x: +x, y: +y });
		} else {
			setDragPosition({ x: 0, y: 0 });
		}
	};

	return (
		<div class="flex justify-end items-stretch" classList={{ "opacity-50": sortable.isActiveDraggable }}>
			<div ref={draggerElement} use:sortable class="touch-none flex items-center cursor-pointer">
				<div class="mx-2 md:ml-0">
					<Icon name="sortArrows" extraClass="fill-neutral-500 w-4 h-4" />
				</div>
			</div>

			<div
				class="truncate flex-grow"
				style={{ transform: `translate3d(${dragPosition().x}px, ${dragPosition().y}px, 0px)` }}
			>
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
					extraTitleClass={props.isActive ? "text-brand-600" : undefined}
					onAddToQueue={props.onAddToQueue}
					variant="small"
				/>
			</div>
		</div>
	);
};
