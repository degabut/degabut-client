import { GetMostPlayedParams, getVideoHistory, IVideoCompact, searchVideos } from "@api";
import { Accessor, createResource, ResourceReturn } from "solid-js";
import { ResourceOptions } from "solid-js/types/reactive/signal";

type IUseVideosProps =
	| {
			keyword: Accessor<string> | string;
	  }
	| {
			last: Accessor<number> | number;
	  }
	| Accessor<GetMostPlayedParams>
	| GetMostPlayedParams;

export const useVideos = (props: IUseVideosProps) => {
	let resource: ResourceReturn<IVideoCompact[] | undefined, ResourceOptions<IVideoCompact[]>>;

	if ("keyword" in props) {
		resource = createResource(props.keyword, (keyword) => searchVideos(keyword));
	} else if ("last" in props) {
		resource = createResource(props.last, (last) => getVideoHistory({ last }));
	} else {
		resource = createResource(props, (params) => getVideoHistory(params));
	}

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
