import * as api from "@api";
import { IQueue, ITrack, IVideoCompact, LoopType } from "@api";
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
	isInitialLoading: Accessor<boolean>;
	isQueueFreezed: Accessor<boolean>;
	isTrackLoading: Accessor<boolean>;
	isTrackFreezed: Accessor<boolean>;
	changeTrackOrder: (trackId: string, toIndex: number) => Promise<void>;
	removeTrack: (track: ITrack) => Promise<void>;
	addTrack: (video: IVideoCompact) => Promise<void>;
	refetch: () => IQueue | Promise<IQueue | null | undefined> | null | undefined;
	toggleShuffle: () => Promise<void>;
	changeLoopType: (loopType: LoopType) => Promise<void>;
};

export const QueueContext = createContext<QueueContextStore>({
	data: () => null,
	isInitialLoading: () => true,
	isLoading: () => false,
	isQueueFreezed: () => false,
	isTrackLoading: () => false,
	isTrackFreezed: () => false,
	changeTrackOrder: async () => {},
	removeTrack: async () => {},
	addTrack: async () => {},
	toggleShuffle: async () => {},
	changeLoopType: async () => {},
	refetch: () => null,
});

export const QueueProvider: ParentComponent = (props) => {
	let queueInterval: NodeJS.Timer;
	const navigate = useNavigate();
	const [isQueueFreezed, setIsQueueFreezed] = createSignal(false);
	const [isTrackLoading, setIsTrackLoading] = createSignal(false);
	const [isTrackFreezed, setIsTrackFreezed] = createSignal(false);
	const [isInitialLoading, setIsInitialLoading] = createSignal(true);

	const [queue, { refetch }] = createResource([], async () => {
		try {
			return await api.getQueue();
		} catch (err) {
			if (err instanceof AxiosError && (err.response?.status === 403 || err.response?.status === 401)) {
				navigate("/login");
			}
		} finally {
			setIsInitialLoading(false);
		}
	});

	const toggleShuffle = () => modifyQueue(() => api.toggleShuffle());
	const changeLoopType = (loopType: LoopType) => modifyQueue(() => api.changeLoopType(loopType));
	const changeTrackOrder = (trackId: string, toIndex: number) => modifyTrack(() => api.orderTrack(trackId, toIndex));
	const removeTrack = (track: ITrack) => modifyTrack(() => api.removeTrack(track.id));
	const addTrack = (video: IVideoCompact) => modifyTrack(() => api.addTrackByVideoId(video.id));

	const modifyTrack = async (fn: () => Promise<unknown>) => {
		setIsTrackLoading(true);
		setIsTrackFreezed(true);
		await fn();
		refetch();
		setIsTrackLoading(false);
	};

	const modifyQueue = async (fn: () => Promise<unknown>) => {
		setIsQueueFreezed(true);
		await fn();
		refetch();
	};

	onMount(() => {
		queueInterval = setInterval(refetch, 3000);
		refetch();
	});
	onCleanup(() => clearInterval(queueInterval));

	createEffect(() => {
		if (queue()) {
			setIsTrackFreezed(false);
			setIsQueueFreezed(false);
		}
	});

	const isLoading = createMemo(() => queue.loading);

	const store: QueueContextStore = {
		data: () => queue() || null,
		isLoading,
		isInitialLoading,
		isQueueFreezed,
		isTrackLoading,
		isTrackFreezed,
		refetch,
		changeTrackOrder,
		removeTrack,
		addTrack,
		toggleShuffle,
		changeLoopType,
	};

	return <QueueContext.Provider value={store}>{props.children}</QueueContext.Provider>;
};
