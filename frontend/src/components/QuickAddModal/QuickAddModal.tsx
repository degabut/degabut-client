import { addTrackByKeyword, addTrackByVideoId, IVideoCompact } from "@api";
import { Button, Modal, Select } from "@components";
import { VideoThumbnail } from "@components/Video/components";
import { useQueue, useVideos } from "@hooks";
import { debounce, secondsToTime } from "@utils";
import { Component, createMemo, createSignal, onMount } from "solid-js";

type VideoOptionProps = {
	video: IVideoCompact;
	isSelected: boolean;
};

const VideoOption: Component<VideoOptionProps> = (props) => {
	return (
		<div
			class="flex flex-row space-x-2 cursor-pointer items-center p-1.5"
			classList={{ "bg-white bg-opacity-10": props.isSelected }}
		>
			<VideoThumbnail
				video={props.video}
				variant="small"
				extraContainerClass="flex-shrink-0"
				extraClass="!w-10 !h-10"
			/>
			<div class="flex flex-col truncate">
				<div class="truncate">{props.video.title}</div>
				<div class="flex flex-row space-x-2">
					<div class="text-sm">{secondsToTime(props.video.duration)}</div>
					<div class="truncate text-sm text-neutral-400">{props.video.channel.name}</div>
				</div>
			</div>
		</div>
	);
};

export const QuickAddModal: Component = () => {
	const queue = useQueue();
	const [isModalOpen, setIsModalOpen] = createSignal(false);
	const [isLoading, setIsLoading] = createSignal(false);
	const [keyword, setKeyword] = createSignal("");
	const [videosKeyword, setVideosKeyword] = createSignal("");
	const videos = useVideos({ keyword: videosKeyword });

	onMount(() => {
		document.addEventListener("keydown", onKeyDown);
	});

	const onKeyDown = (e: KeyboardEvent) => {
		const target = e.target as Element | null;
		const tagName = target?.tagName.toUpperCase();

		if (e.key === "Escape" && isModalOpen()) {
			e.preventDefault();
			setIsModalOpen(false);
		}

		if (tagName !== "INPUT" && tagName !== "TEXTAREA" && queue.data() && !isModalOpen() && e.key === "p") {
			e.preventDefault();
			setIsModalOpen(true);
		}
	};

	const debouncedSetVideosKeyword = debounce((v: string) => {
		setVideosKeyword(v);
		videos.mutate([]);
	}, 250);

	const onInput = (e: InputEvent) => {
		const value = (e.target as HTMLInputElement).value;
		setKeyword(value);
		debouncedSetVideosKeyword(value);
	};

	const onClickSubmit = (e: MouseEvent) => {
		e.preventDefault();
		addVideo();
	};

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		if (!keyword() || videos.data()?.length) return;
		addVideo();
	};

	const addVideo = async (id?: string) => {
		if ((!id && !keyword()) || isLoading()) return;
		setIsLoading(true);

		if (id) await addTrackByVideoId(id);
		else await addTrackByKeyword(keyword());

		setIsLoading(false);
		setIsModalOpen(false);
		setKeyword("");
		setVideosKeyword("");
	};

	const videoOptions = createMemo(() => {
		if (videos.data()?.length && !videos.data.loading && videosKeyword() === keyword() && !isLoading())
			return videos.data() || [];
		return [];
	});

	return (
		<Modal isOpen={isModalOpen()} onClickOutside={() => setIsModalOpen(false)}>
			<form onSubmit={onSubmit} class="flex flex-col space-y-6 items-center">
				<div class="text-xl font-medium">Quick Add Song</div>

				<Select<IVideoCompact>
					inputProps={{
						disabled: isLoading(),
						onInput: onInput,
						placeholder: "Never gonna give you up",
						focusOnMount: true,
					}}
					options={videoOptions()}
					onSelect={(v) => addVideo(v.id)}
				>
					{(i, isSelected) => <VideoOption video={i} isSelected={isSelected} />}
				</Select>

				<div class="flex flex-row justify-between space-x-8">
					<Button type="button" class="border-0 hover:bg-transparent" onClick={() => setIsModalOpen(false)}>
						<div class="underline">Cancel</div>
					</Button>

					<Button rounded type="submit" class="px-8" disabled={isLoading()} onClick={onClickSubmit}>
						Add Song
					</Button>
				</div>
			</form>
		</Modal>
	);
};
