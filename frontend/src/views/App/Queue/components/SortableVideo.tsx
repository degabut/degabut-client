import { ITrack, IVideoCompact } from "@api";
import { Icon, Video, VideoContextMenuItem } from "@components";
import { createSortable } from "@thisbeyond/solid-dnd";
import { Component, createMemo, createSignal, onMount } from "solid-js";

type Props = {
	initialTrack: ITrack;
	isActive: boolean;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	onAddToQueueAndPlay?: (video: IVideoCompact) => Promise<void>;
	onRemove?: (track: ITrack) => void;
	onPlay?: (track: ITrack) => void;
};

type Pos = {
	x: number;
	y: number;
};

export const SortableVideo: Component<Props> = (props) => {
	const sortable = createSortable(props.initialTrack.id);
	let draggerElement!: HTMLDivElement;
	const [dragPosition, setDragPosition] = createSignal<Pos>({ x: 0, y: 0 });

	onMount(() => {
		const observer = new MutationObserver((mutations) => {
			mutations.forEach(onDragMove);
		});

		observer.observe(draggerElement, { attributes: true, attributeFilter: ["style"] });
	});

	const extraContextMenuItems = createMemo(() => {
		const contextMenu = [
			{
				element: () => <VideoContextMenuItem icon="trashBin" label="Remove from Queue" iconSize="large" />,
				onClick: () => props.onRemove?.(props.initialTrack),
			},
		];

		if (!props.isActive) {
			contextMenu.unshift({
				element: () => <VideoContextMenuItem icon="play" label="Play" iconSize="large" />,
				onClick: () => props.onPlay?.(props.initialTrack),
			});
		}

		return contextMenu;
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
					{...props.initialTrack}
					extraContextMenuItems={extraContextMenuItems()}
					extraTitleClass={props.isActive ? "text-brand-600" : undefined}
					onAddToQueue={(v) => props.onAddToQueue?.(v)}
					onAddToQueueAndPlay={(v) => props.onAddToQueueAndPlay?.(v)}
					variant="small"
				/>
			</div>
		</div>
	);
};
