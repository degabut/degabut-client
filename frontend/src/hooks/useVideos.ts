import { getVideoHistory, searchVideos } from "@api";
import { Accessor, createResource } from "solid-js";

type PropsValue =
	| Accessor<string>
	| string
	| {
			userId: string;
			last: number;
	  }
	| {
			userId: string;
			days: number;
			count: number;
	  };

type IUseVideosProps = Accessor<PropsValue> | PropsValue;

export const useVideos = (props: IUseVideosProps) => {
	const resource = createResource(props, (value) => {
		if (typeof value === "string") {
			return searchVideos(value);
		} else if ("userId" in value) {
			if ("last" in value) {
				return getVideoHistory(value.userId, { last: value.last });
			} else {
				return getVideoHistory(value.userId, { count: value.count, days: value.days });
			}
		}
	});

	const [data, { refetch, mutate }] = resource;

	return {
		data,
		refetch,
		mutate,
	};
};
