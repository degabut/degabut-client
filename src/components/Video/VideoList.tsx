import type { IGuildMember, IVideoCompact } from "@api";
import { contextMenu } from "@directives";
import { ContextMenuItem } from "@providers";
import { secondsToTime } from "@utils";
import { Component, createMemo } from "solid-js";
import { ChannelThumbnail, ContextMenuButton, VideoThumbnail } from "./components";
import { getVideoContextMenu } from "./utils/videoContextMenu";

type Props = {
	video: IVideoCompact;
	requestedBy?: IGuildMember;
	variant?: "small" | "normal";
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	extraContextMenuItems?: ContextMenuItem[];
};

export const VideoList: Component<Props> = (props) => {
	contextMenu;
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	const contextMenuProps = createMemo(() => {
		const contextMenu = getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue });

		return {
			items: [...(props.extraContextMenuItems || []), ...contextMenu.items],
			header: contextMenu.header,
		};
	});

	return props.variant === "small" ? (
		<div class="flex flex-row items-center space-x-1.5 lg:space-x-3 w-full" use:contextMenu={contextMenuProps()}>
			<VideoThumbnail video={props.video} variant={props.variant} extraContainerClass="flex-shrink-0" />
			<div class="flex flex-col flex-grow flex-shrink lg:space-y-1 pt-1 pr-1 truncate">
				<a href={youtubeUrl()} target="_blank" class="truncate">
					{props.video.title}
				</a>
				<div class="flex flex-row space-x-3 text-sm">
					<div class="text-neutral-400">{secondsToTime(props.video.duration)}</div>
					{props.requestedBy && <div>Requested by {props.requestedBy.displayName}</div>}
				</div>
			</div>
			<ContextMenuButton contextMenu={contextMenuProps()} />
		</div>
	) : (
		<div
			class="flex flex-col flex-grow sm:flex-row sm:space-x-4 space-y-2 lg:space-y-0"
			use:contextMenu={contextMenuProps()}
		>
			<VideoThumbnail video={props.video} variant={props.variant} />
			<div class="flex flex-col space-y-2 ">
				<div class="flex flex-row">
					<div class="flex flex-grow truncate ">
						<a href={youtubeUrl()} target="_blank" class="font-medium truncate">
							{props.video.title}
						</a>
					</div>

					<div class="block sm:hidden mt-0.5">
						<ContextMenuButton
							contextMenu={getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue })}
						/>
					</div>
				</div>
				<div class="space-y-1">
					<div class="text-neutral-400 text-sm">{props.video.viewCount?.toLocaleString("id")} views</div>
					<div class="flex flex-row space-x-2 text-sm items-center">
						<ChannelThumbnail video={props.video} />
						<div>{props.video.channel.name}</div>
					</div>
				</div>

				{props.requestedBy && <div class="my-auto">Requested by {props.requestedBy.displayName}</div>}
			</div>
		</div>
	);
};
