import { IVideoCompact } from "@api";
import { secondsToTime } from "@utils";
import { Component, createMemo } from "solid-js";

type Props = {
	video: IVideoCompact;
	variant?: "small" | "normal";
	extraContainerClass?: string;
};

export const VideoThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() =>
		props.variant === "small" ? props.video.thumbnails[0] : props.video.thumbnails.at(-1)
	);
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	return props.variant === "small" ? (
		<a href={youtubeUrl()} target="_blank" class={`relative bg-black ${props.extraContainerClass}`}>
			<img
				src={thumbnail()?.url}
				alt={props.video.title}
				class="h-12 w-12 lg:w-[6rem] lg:h-[3.375rem] object-cover"
			/>
		</a>
	) : (
		<a class={`relative flex bg-black ${props.extraContainerClass}`} href={youtubeUrl()} target="_blank">
			<div class="sm:w-[16rem] sm:h-[10rem] mx-auto">
				<img src={thumbnail()?.url} alt={props.video.title} class="h-full object-cover " />
			</div>
			<div class="absolute bottom-0 right-0 text-sm bg-black/90 py-1 px-2">
				{secondsToTime(props.video.duration)}
			</div>
		</a>
	);
};
