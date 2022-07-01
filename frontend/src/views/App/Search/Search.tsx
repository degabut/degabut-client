import { Input, Video } from "@components";
import { useApp, useQueue } from "@hooks";
import { searchStore } from "@stores";
import { debounce } from "@utils";
import { useSearchParams } from "solid-app-router";
import { Component, For, onMount, Show } from "solid-js";

const SearchResultSkeleton: Component = () => {
	return <For each={Array(5)}>{() => <Video.ListSkeleton />}</For>;
};

export const Search: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const [query, setQuery] = useSearchParams<{ keyword: string }>();
	const { keyword, setKeyword, data: videos } = searchStore;

	onMount(() => {
		app.setTitle("Search");
		setKeyword(query.keyword || "");
	});

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
				focusOnMount
				value={keyword()}
				onInput={debounce(onInput, 250)}
			/>

			<div class="space-y-8">
				<Show when={!videos.loading} fallback={<SearchResultSkeleton />}>
					<For each={videos()}>
						{(video) => (
							<Video.List
								video={video}
								onAddToQueue={queue.addTrack}
								onAddToQueueAndPlay={queue.addAndPlayTrack}
							/>
						)}
					</For>
				</Show>
			</div>
		</div>
	);
};
