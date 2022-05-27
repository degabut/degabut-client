import { addTrack, type IVideoCompact } from "@api";
import { Video } from "@components/Video";
import { debounce } from "@directives";
import { searchStore } from "@stores";
import { useSearchParams } from "solid-app-router";
import { Component, For, Match, onMount, Switch } from "solid-js";

export const Search: Component = () => {
	debounce;

	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const { keyword, setKeyword, data: videos } = searchStore;
	let searchInput!: HTMLInputElement;

	onMount(() => {
		setKeyword(query.keyword || "");
		searchInput.focus();
	});

	const onAddToQueue = async (video: IVideoCompact) => {
		await addTrack(video.id);
	};

	const onInput = (value: string) => {
		setKeyword(value);
		setQuery({ keyword: value });
	};

	return (
		<div class="flex flex-col space-y-4 lg:space-y-6">
			<input
				type="text"
				class="w-full lg:max-w-[32rem] bg-white rounded-full py-2 px-4 outline-0 text-black"
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

			<div class="space-y-8">
				<For each={videos()}>{(video) => <Video.List video={video} onAddToQueue={onAddToQueue} />}</For>
			</div>
		</div>
	);
};
