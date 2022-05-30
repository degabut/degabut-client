import { IVideoCompact } from "@api";
import { ContextMenuDirectiveParams } from "@providers";
import { useNavigate } from "solid-app-router";
import { VideoContextMenuItem } from "../components";

type Props = {
	video: IVideoCompact;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const getVideoContextMenu = (props: Props) => {
	const navigate = useNavigate();

	return {
		items: [
			{
				element: () => <VideoContextMenuItem icon="plus" label="Add to Queue" />,
				onClick: () => props.onAddToQueue?.(props.video),
			},
			{
				element: () => <VideoContextMenuItem icon="list" label="Related" />,
				onClick: () => navigate(`/app/video/${props.video.id}`),
			},
		],
		header: (
			<div class="flex flex-col items-center justify-center pt-4 pb-8 space-y-1">
				<div class="w-[16rem] h-[9rem] text-center my-4">
					<img class="w-full h-full" src={props.video.thumbnails[0].url} alt={props.video.title} />
				</div>
				<div class="flex flex-col items-center space-y-2">
					<div class="font-medium text-center">{props.video.title}</div>
					<div class="flex flex-row space-x-4 text-sm text-neutral-400">
						<div class="">{props.video.channel.name}</div>
						<div class="">{props.video.viewCount} views</div>
					</div>
				</div>
			</div>
		),
	} as ContextMenuDirectiveParams;
};
