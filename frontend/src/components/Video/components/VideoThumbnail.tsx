import { IVideoCompact } from "@api";
import { Link } from "@components";
import { secondsToTime } from "@utils";
import { Component, createMemo } from "solid-js";

type Props = {
	video: IVideoCompact;
	variant?: "small" | "normal";
	extraClass?: string;
	extraContainerClass?: string;
};

export const VideoThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() =>
		props.variant === "small" ? props.video.thumbnails[0] : props.video.thumbnails.at(-1)
	);
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	return props.variant === "small" ? (
		<Link href={youtubeUrl()} target="_blank" class={`relative bg-black ${props.extraContainerClass}`}>
			<img
				src={thumbnail()?.url}
				alt={props.video.title}
				class={`h-12 w-12 md:w-[6rem] md:h-[3.375rem] object-cover ${props.extraClass}`}
			/>
		</Link>
	) : (
		<Link class={`relative flex bg-black ${props.extraContainerClass}`} href={youtubeUrl()} target="_blank">
			<div class="flex justify-center mx-auto sm:w-[16rem] sm:h-[10rem]">
				<img src={thumbnail()?.url} alt={props.video.title} class={`h-full object-cover ${props.extraClass}`} />
			</div>
			<div class="absolute bottom-0 right-0 text-sm bg-black/90 py-1 px-2">
				{secondsToTime(props.video.duration)}
			</div>
		</Link>
	);
};
