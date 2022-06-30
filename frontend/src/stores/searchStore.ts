import { useVideos } from "@hooks";
import { createSignal } from "solid-js";

const [keyword, setKeyword] = createSignal("");
const { data, refetch } = useVideos(keyword);

export const searchStore = {
	data,
	refetch,
	keyword,
	setKeyword,
};
