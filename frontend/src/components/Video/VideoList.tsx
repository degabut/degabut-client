import type { IGuildMember, IVideoCompact } from "@api";
import { Link } from "@components";
import { contextMenu } from "@directives";
import { ContextMenuItem } from "@providers";
import { secondsToTime } from "@utils";
import { Component, createMemo } from "solid-js";
import { ChannelThumbnail, ContextMenuButton, VideoThumbnail } from "./components";
import { getVideoContextMenu } from "./utils/videoContextMenu";

contextMenu;

type Props = {
	video: IVideoCompact;
	requestedBy?: IGuildMember;
	variant?: "small" | "normal";
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
	extraContextMenuItems?: ContextMenuItem[];
	extraContainerClass?: string;
};

export const VideoList: Component<Props> = (props) => {
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	const contextMenuProps = createMemo(() => {
		const contextMenu = getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue });

		return {
			items: [...(props.extraContextMenuItems || []), ...contextMenu.items],
			header: contextMenu.header,
		};
	});

	return props.variant === "small" ? (
		<div
			class={`flex flex-row items-center space-x-1.5 lg:space-x-3 w-full hover:bg-white/5 ${props.extraContainerClass}`}
			use:contextMenu={contextMenuProps()}
		>
			<VideoThumbnail video={props.video} variant={props.variant} extraContainerClass="flex-shrink-0" />
			<div class="flex flex-col flex-grow flex-shrink lg:space-y-1 pr-1 py-1 truncate">
				<Link href={youtubeUrl()} target="_blank" class="truncate">
					{props.video.title}
				</Link>
				<div class="flex flex-row space-x-3 text-sm">
					<div class="text-neutral-400">{secondsToTime(props.video.duration)}</div>
					{props.requestedBy && <div>Requested by {props.requestedBy.displayName}</div>}
				</div>
			</div>
			<ContextMenuButton contextMenu={contextMenuProps()} />
		</div>
	) : (
		<div
			class={`flex flex-col sm:flex-row sm:space-x-2 space-y-2 lg:space-y-0 hover:bg-white/5 ${props.extraContainerClass}`}
			use:contextMenu={contextMenuProps()}
		>
			<VideoThumbnail video={props.video} variant={props.variant} />
			<div class="flex flex-col space-y-2 w-full truncate p-2">
				<div class="flex flex-row items-center truncate">
					<Link href={youtubeUrl()} target="_blank" class=" flex-grow font-medium truncate">
						{props.video.title}
					</Link>

					<ContextMenuButton
						contextMenu={getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue })}
					/>
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
