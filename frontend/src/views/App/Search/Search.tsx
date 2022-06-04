import { addTrackByVideoId, type IVideoCompact } from "@api";
import { Input, Video } from "@components";
import { searchStore } from "@stores";
import { debounce } from "@utils";
import { useSearchParams } from "solid-app-router";
import { Component, For, Match, onMount, Switch } from "solid-js";

export const Search: Component = () => {
	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const { keyword, setKeyword, data: videos } = searchStore;
	let searchInput!: HTMLInputElement;

	onMount(() => {
		setKeyword(query.keyword || "");
		searchInput.focus();
	});

	const onAddToQueue = async (video: IVideoCompact) => {
		await addTrackByVideoId(video.id);
	};

	const onInput = (ev: InputEvent) => {
		const value = (ev.target as HTMLInputElement).value;
		setKeyword(value);
		setQuery({ keyword: value });
	};

	return (
		<div class="flex flex-col space-y-4 md:space-y-6 max-w-7xl">
			<Input
				type="text"
				placeholder="Never gonna give you up"
				ref={searchInput}
				value={keyword()}
				onInput={debounce(onInput, 250)}
			/>

			<div class="text-neutral-100">
				<Switch>
					<Match when={videos.loading}>Loading...</Match>
					<Match when={videos()?.length}>
						Search Result for "<span class="font-medium">{keyword()}</span>"
					</Match>
					<Match when={!keyword()}>Enter keyword</Match>
				</Switch>
			</div>

			<div class="space-y-8">
				<For each={videos()}>{(video) => <Video.List video={video} onAddToQueue={onAddToQueue} />}</For>
			</div>
		</div>
	);
};
