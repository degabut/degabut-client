import { IVideoCompact } from "@api";
import { Accessor, createEffect, createMemo, createSignal } from "solid-js";
import { useVideo } from "./useVideo";
import { useVideos } from "./useVideos";

type UseRecommendationParams = {
	userId: Accessor<string>;
	onLoad: () => void;
};

export const useRecommendation = (params: UseRecommendationParams) => {
	const [relatedTargetVideoIds, setRelatedTargetVideoIds] = createSignal<string[]>([]);
	const [relatedVideos, setRelatedVideos] = createSignal<IVideoCompact[]>([]);
	const [lastPlayedParams, setLastPlayedParams] = createSignal({ userId: params.userId(), last: 5 });
	const [mostPlayedParams, setMostPlayedParams] = createSignal({ userId: params.userId(), days: 30, count: 10 });
	const [recentMostPlayedParams, setRecentMostPlayedParams] = createSignal({
		userId: params.userId(),
		days: 7,
		count: 5,
	});
	const currentRelatedVideoId = createMemo(() => relatedTargetVideoIds()[0]);

	const video = useVideo({ videoId: currentRelatedVideoId });
	const lastPlayedVideos = useVideos(lastPlayedParams);
	const mostPlayedVideos = useVideos(mostPlayedParams);
	const recentMostPlayedVideos = useVideos(recentMostPlayedParams);

	createEffect(() => {
		const videos = video.data()?.related;
		if (videos) {
			setRelatedVideos((c) => [...c, ...videos]);
			setTimeout(params.onLoad, 0);
		}
	});

	createEffect(() => {
		const lastPlayed = lastPlayedVideos.data();
		const mostPlayed = mostPlayedVideos.data();
		if (!lastPlayed || !mostPlayed) return;
		const videoIds = [...mostPlayed, ...lastPlayed].map((v) => v.id);
		setRelatedTargetVideoIds(videoIds);
		setTimeout(params.onLoad, 0);
	});

	createEffect(() => {
		const userId = params.userId();

		if (!userId) return;
		if (userId === lastPlayedParams().userId && userId === mostPlayedParams().userId) return;

		lastPlayedVideos.mutate([]);
		mostPlayedVideos.mutate([]);
		recentMostPlayedVideos.mutate([]);
		setRelatedVideos([]);
		setLastPlayedParams((v) => ({ ...v, userId }));
		setMostPlayedParams((v) => ({ ...v, userId }));
		setRecentMostPlayedParams((v) => ({ ...v, userId }));
	});

	const videos = createMemo(() => {
		if (mostPlayedVideos.data.loading || lastPlayedVideos.data.loading || recentMostPlayedVideos.data.loading) {
			return [];
		}

		const mostPlayed = mostPlayedVideos.data() || [];
		const lastPlayed = lastPlayedVideos.data() || [];
		const recentMostPlayed = recentMostPlayedVideos.data() || [];
		const mostLastPlayed = mostPlayed.filter((v) => lastPlayed.some((l) => l.id === v.id));

		const videos = [...recentMostPlayed, ...mostLastPlayed, ...lastPlayed, ...mostPlayed, ...relatedVideos()];

		const uniqueVideos = videos.reduce((acc, curr) => {
			if (acc.find((v) => v.id === curr.id)) return acc;
			return [...acc, curr];
		}, [] as IVideoCompact[]);
		return uniqueVideos;
	});

	const isLoading = createMemo(() => {
		return video.data.loading || lastPlayedVideos.data.loading || mostPlayedVideos.data.loading;
	});

	const loadNext = () => {
		setRelatedTargetVideoIds((c) => c.slice(1));
	};

	return {
		videos,
		isLoading,
		loadNext,
	};
};
