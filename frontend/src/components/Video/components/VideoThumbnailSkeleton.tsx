import { Component } from "solid-js";

type Props = {
	variant?: "small" | "normal";
};

export const VideoThumbnailSkeleton: Component<Props> = (props) => {
	return (
		<>
			{props.variant === "small" ? (
				<div class="h-12 w-12 md:w-[6rem] md:h-[3.375rem] bg-neutral-900 animate-pulse" />
			) : (
				<div class="w-full sm:h-[10rem] h-[14rem] mx-auto bg-neutral-900 animate-pulse" />
			)}
		</>
	);
};
