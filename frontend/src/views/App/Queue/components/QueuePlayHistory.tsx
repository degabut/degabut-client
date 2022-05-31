import { ITrack, IVideoCompact } from "@api";
import { Video } from "@components";
import { Component, For } from "solid-js";

type Props = {
	tracks: ITrack[];
	onRemoveTrack?: (track: ITrack) => void;
	onAddToQueue?: (video: IVideoCompact) => Promise<void>;
};

export const QueuePlayHistory: Component<Props> = (props) => {
	return (
		<div class="space-y-4">
			{!props.tracks.length && <div>Empty</div>}

			<div class="space-y-4">
				<For each={props.tracks}>
					{(track) => <Video.List variant="small" {...track} onAddToQueue={props.onAddToQueue} />}
				</For>
			</div>
		</div>
	);
};