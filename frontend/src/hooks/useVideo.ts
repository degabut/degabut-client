import { getVideo } from "@api";
import { Accessor, createResource } from "solid-js";

type IUseVideoProps = {
	videoId?: Accessor<string>;
};

export const useVideo = ({ videoId }: IUseVideoProps) => {
	const [data, { refetch, mutate }] = createResource(videoId, getVideo);

	return {
		data,
		mutate,
		refetch,
	};
};
