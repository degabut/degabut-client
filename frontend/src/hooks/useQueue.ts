import { getQueue } from "@api";
import { createResource } from "solid-js";

export const useQueue = () => {
	const [data, { refetch }] = createResource([], getQueue);
	return {
		data,
		refetch,
	};
};
