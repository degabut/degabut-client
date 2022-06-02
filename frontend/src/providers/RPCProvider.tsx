import { auth } from "@api";
import * as models from "@go/models";
import * as rpc from "@go/rpc/Client";
import { createContext, onCleanup, onMount, ParentComponent } from "solid-js";
import { IS_BROWSER } from "../constants";
import { QueueContextStore } from "./QueueProvider";

export type RPCContextStore = {
	startActivityUpdater: (queue: QueueContextStore) => Promise<void>;
};

export const RPCContext = createContext<RPCContextStore>({
	startActivityUpdater: async () => {},
});

export const RPCProvider: ParentComponent = (props) => {
	if (IS_BROWSER) return props.children;

	let activityUpdaterTimer: NodeJS.Timer;
	let queue: QueueContextStore | undefined;

	onMount(async () => {
		const token = await auth.getAccessToken();
		rpc.Authenticate(token);
	});
	onCleanup(() => {
		clearInterval(activityUpdaterTimer);
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

	const startActivityUpdater = async (q: QueueContextStore) => {
		queue = q;
		activityUpdaterTimer = setInterval(updateListeningActivity, 7500);
		updateListeningActivity();
	};

	const store: RPCContextStore = {
		startActivityUpdater,
	};

	return <RPCContext.Provider value={store}>{props.children}</RPCContext.Provider>;
};
