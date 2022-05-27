import { getRecommendations } from "@api";
import { createResource } from "solid-js";

export const useRecommendations = () => {
	const [data, { refetch }] = createResource(getRecommendations);

	return {
		data,
		refetch,
	};
};
