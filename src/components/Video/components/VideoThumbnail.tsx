import { IVideoCompact } from "@api";
import { secondsToTime } from "@utils";
import { Component, createMemo } from "solid-js";

type Props = {
	video: IVideoCompact;
	variant?: "small" | "normal";
};

export const VideoThumbnail: Component<Props> = (props) => {
	const thumbnail = createMemo(() =>
		props.variant === "small" ? props.video.thumbnails[0] : props.video.thumbnails.at(-1)
	);
	const youtubeUrl = createMemo(() => `https://youtu.be/${props.video.id}`);

	return props.variant === "small" ? (
		<a class="hidden lg:block" href={youtubeUrl()} target="_blank">
			<div class="relative w-[6rem] h-[3.375rem]">
				<img src={thumbnail()?.url} alt={props.video.title} class="pt-0.5" />
			</div>
		</a>
	) : (
		<div class="bg-black flex text-center">
			<a class="mx-auto" href={youtubeUrl()} target="_blank">
				<div class="relative sm:w-[16rem] sm:h-[9rem]">
					<img src={thumbnail()?.url} alt={props.video.title} />
					<div class="absolute bottom-0 right-0 text-sm bg-black bg-opacity-90 py-1 px-2">
						{secondsToTime(props.video.duration)}
					</div>
				</div>
			</a>
		</div>
	);
};
