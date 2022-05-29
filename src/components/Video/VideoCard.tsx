import type { IVideoCompact } from "@api";
import { contextMenu } from "@directives/contextMenu";
import { Component, createMemo } from "solid-js";
import { ChannelThumbnail, ContextMenuButton, VideoThumbnail } from "./components";
import { getVideoContextMenu } from "./utils/videoContextMenu";

contextMenu;

type Props = {
	video: IVideoCompact;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const VideoCard: Component<Props> = (props) => {
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	return (
		<div
			class="flex flex-col space-y-3"
			use:contextMenu={getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue })}
		>
			<VideoThumbnail video={props.video} />

			<div class="flex flex-row items-start space-x-2">
				<ChannelThumbnail video={props.video} />

				<div class="flex flex-col flex-grow space-y-2 truncate">
					<a href={youtubeUrl()} target="_blank" class="font-medium truncate" title={props.video.title}>
						{props.video.title}
					</a>
					<div>
						<div class="flex flex-row space-x-2 text-sm items-center">{props.video.channel.name}</div>
						<div class="text-neutral-400 text-sm">{props.video.viewCount?.toLocaleString("id")} views</div>
					</div>
				</div>

				<div class="mt-0.5">
					<ContextMenuButton
						contextMenu={getVideoContextMenu({ video: props.video, onAddToQueue: props.onAddToQueue })}
					/>
				</div>
			</div>
		</div>
	);
};
