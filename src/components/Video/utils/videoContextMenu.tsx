import { IVideoCompact } from "@api";
import { useNavigate } from "solid-app-router";

type Props = {
	video: IVideoCompact;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const getVideoContextMenu = (props: Props) => {
	const navigate = useNavigate();

	return {
		items: [
			{
				label: "Add to Queue",
				onClick: () => props.onAddToQueue?.(props.video),
			},
			{
				label: "Related",
				onClick: () => navigate(`/app/video/${props.video.id}`),
			},
		],
		header: (
			<div class="flex flex-col items-center justify-center pt-4 pb-8 space-y-2">
				<div class="w-[16rem] h-[9rem] text-center my-4">
					<img class="w-full h-full" src={props.video.thumbnails[0].url} alt={props.video.title} />
				</div>
				<div class="flex flex-col items-center">
					<div class="font-medium text-center">{props.video.title}</div>
					<div class="flex flex-row space-x-4 text-sm text-neutral-400">
						<div class="">{props.video.channel.name}</div>
						<div class="">{props.video.viewCount} views</div>
					</div>
				</div>
			</div>
		),
	};
};
