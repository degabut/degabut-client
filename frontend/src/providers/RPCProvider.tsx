import { auth, IQueue } from "@api";
import * as models from "@go/models";
import * as rpc from "@go/rpc/Client";
import { useQueue } from "@hooks";
import { createContext, createEffect, onMount, ParentComponent } from "solid-js";
import { IS_BROWSER } from "../constants";

export const RPCContext = createContext();

export const RPCProvider: ParentComponent = (props) => {
	if (IS_BROWSER) return props.children;
	const queue = useQueue();
	let previousQueue: IQueue | undefined;

	onMount(async () => {
		const token = await auth.getAccessToken();
		rpc.Authenticate(token);
	});

	createEffect(() => {
		const queueData = queue.data();
		if (!queueData) return;

		if (
			queueData.nowPlaying?.id !== previousQueue?.nowPlaying?.id ||
			queueData.voiceChannel.members.length !== previousQueue?.voiceChannel.members.length
		) {
			previousQueue = queueData;
			updateListeningActivity();
		}
	});

	const updateListeningActivity = async () => {
		if (!queue) throw new Error("Queue not found");
		const queueData = queue.data();

		if (!queueData?.nowPlaying) {
			await rpc.SetActivity({
				details: "Not listening to anything",
				state: "💤",
				assets: {
					large_image: "degabut",
					large_text: "Degabut",
				},
			} as models.rpc.Activity);
		} else {
			const { nowPlaying, voiceChannel } = queueData;

			const title = nowPlaying.video.title;
			const channelName = nowPlaying.video.channel.name;
			const otherMemberCount = voiceChannel.members.length - 2;
			const smallImage = otherMemberCount > 0 ? "multi_user" : "single_user";
			const smallText =
				otherMemberCount <= 0
					? "Listening alone"
					: `Listening along with ${otherMemberCount} ${otherMemberCount === 1 ? "person" : "people"}`;
			const start = nowPlaying.playedAt ? Math.floor(new Date(nowPlaying.playedAt).getTime() / 1000) : null;

			await rpc.SetActivity({
				details: title,
				state: channelName,
				assets: {
					large_image: "degabut",
					large_text: "Degabut",
					small_image: smallImage,
					small_text: smallText,
				},
				timestamps: start ? { start } : undefined,
			} as models.rpc.Activity);
		}
	};

	return <RPCContext.Provider value={{}}>{props.children}</RPCContext.Provider>;
};
