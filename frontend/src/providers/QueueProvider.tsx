import * as api from "@api";
import { IQueue, ITrack, IVideoCompact } from "@api";
import { AxiosError } from "axios";
import { useNavigate } from "solid-app-router";
import {
	Accessor,
	createContext,
	createEffect,
	createMemo,
	createResource,
	createSignal,
	onCleanup,
	onMount,
	ParentComponent,
} from "solid-js";

export type QueueContextStore = {
	data: Accessor<IQueue | null>;
	isLoading: Accessor<boolean>;
	isTrackLoading: Accessor<boolean>;
	isTrackFreezed: Accessor<boolean>;
	changeTrackOrder: (trackId: string, toIndex: number) => Promise<void>;
	removeTrack: (track: ITrack) => Promise<void>;
	addTrack: (video: IVideoCompact) => Promise<void>;
	refetch: () => IQueue | Promise<IQueue | null | undefined> | null | undefined;
};

export const QueueContext = createContext<QueueContextStore>({
	data: () => null,
	isLoading: () => false,
	isTrackLoading: () => false,
	isTrackFreezed: () => false,
	changeTrackOrder: async () => {},
	removeTrack: async () => {},
	addTrack: async () => {},
	refetch: () => null,
});

export const QueueProvider: ParentComponent = (props) => {
	let queueInterval: NodeJS.Timer;
	const navigate = useNavigate();
	const [isTrackLoading, setIsTrackLoading] = createSignal(false);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(false);

	const [queue, { refetch }] = createResource([], async () => {
		try {
			return await api.getQueue();
		} catch (err) {
			if (err instanceof AxiosError && (err.response?.status === 403 || err.response?.status === 401)) {
				navigate("/login");
			}
		}
	});

	const changeTrackOrder = async (trackId: string, toIndex: number) => {
		await modifyTrack(() => api.orderTrack(trackId, toIndex));
	};

	const removeTrack = async (track: ITrack) => {
		await modifyTrack(() => api.removeTrack(track.id));
	};

	const addTrack = async (video: IVideoCompact) => {
		await modifyTrack(() => api.addTrackByVideoId(video.id));
	};

	const modifyTrack = async (fn: () => Promise<unknown>) => {
		setIsTrackLoading(true);
		setIsTrackFreezed(true);
		await fn();
		setIsTrackLoading(false);
	};

	onMount(() => {
		queueInterval = setInterval(refetch, 3000);
		refetch();
	});
	onCleanup(() => clearInterval(queueInterval));

	createEffect(() => queue() && setIsTrackFreezed(false));

	const isLoading = createMemo(() => queue.loading);

	const store: QueueContextStore = {
		data: () => queue() || null,
		isLoading,
		isTrackLoading,
		isTrackFreezed,
		refetch,
		changeTrackOrder,
		removeTrack,
		addTrack,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
