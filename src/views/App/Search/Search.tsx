import { addTrackByVideoId, type IVideoCompact } from "@api";
import { Input, Video } from "@components";
import { debounce } from "@directives";
import { searchStore } from "@stores";
import { useSearchParams } from "solid-app-router";
import { Component, For, Match, onMount, Switch } from "solid-js";

debounce;

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

	const onInput = (value: string) => {
		setKeyword(value);
		setQuery({ keyword: value });
	};

	return (
		<div class="flex flex-col space-y-4 lg:space-y-6">
			<Input
				type="text"
				placeholder="Never gonna give you up"
				ref={searchInput}
				use:debounce={250}
				value={keyword()}
				onInput={(e) => onInput(e.currentTarget.value)}
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

			<div class="space-y-8 max-w-[86rem]">
				<For each={videos()}>{(video) => <Video.List video={video} onAddToQueue={onAddToQueue} />}</For>
			</div>
		</div>
	);
};
