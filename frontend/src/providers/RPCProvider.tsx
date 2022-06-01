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

	let activityUpdaterTimeout: NodeJS.Timeout;

	onMount(async () => {
		const token = await auth.getAccessToken();
		rpc.Authenticate(token);
	});
	onCleanup(() => {
		clearTimeout(activityUpdaterTimeout);
	});

	const setListeningActivity = async (title: string, channelName: string) => {
		await rpc.SetActivity({
			details: title,
			state: channelName,
			assets: {
				large_image: "degabut",
				large_text: "Degabut",
			},
		} as models.rpc.Activity);
	};

	const startActivityUpdater = async (queue: QueueContextStore) => {
		activityUpdaterTimeout = setTimeout(() => {
			const nowPlaying = queue.data()?.nowPlaying;
			if (!nowPlaying) return;
			setListeningActivity(nowPlaying.video.title, nowPlaying.video.channel.name);
		}, 15000);
	};

	const store: RPCContextStore = {
		startActivityUpdater,
	};

	return <RPCContext.Provider value={store}>{props.children}</RPCContext.Provider>;
};
