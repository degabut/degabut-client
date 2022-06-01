import { auth } from "@api";
import * as models from "@go/models";
import * as rpc from "@go/rpc/Client";
import { createContext, onMount, ParentComponent } from "solid-js";

export type RPCContextStore = {
	setListeningActivity: (title: string, channelName: string) => Promise<void>;
};

export const RPCContext = createContext<RPCContextStore>({
	setListeningActivity: async () => {},
});

export const RPCProvider: ParentComponent = (props) => {
	onMount(async () => {
		const token = await auth.getAccessToken();
		rpc.Authenticate(token);
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

	const store = {
		setListeningActivity,
	};

	return <RPCContext.Provider value={store}>{props.children}</RPCContext.Provider>;
};
