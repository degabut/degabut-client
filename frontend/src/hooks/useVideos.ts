import { searchVideos } from "@api";
import { Accessor, createResource } from "solid-js";

type IUseVideosProps = {
	keyword: Accessor<string>;
};

export const useVideos = ({ keyword }: IUseVideosProps) => {
	const [data, { refetch, mutate }] = createResource(keyword, searchVideos);

	return {
		data,
		refetch,
		mutate,
	};
};
