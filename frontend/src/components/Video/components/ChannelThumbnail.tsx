import { IVideoCompact } from "@api";
import { Component, createMemo } from "solid-js";

type Props = {
	video: IVideoCompact;
};

export const ChannelThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() => props.video.channel.thumbnails[0]?.url);

	return thumbnail() && <img src={thumbnail()} class="w-8 h-8 rounded-full" alt={props.video.channel.name} />;
};
