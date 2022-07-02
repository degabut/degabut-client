import { Drawer, Icon } from "@components";
import { useApp, useQueue } from "@hooks";
import { Link as SolidLink } from "solid-app-router";
import { Component, Show } from "solid-js";
import { Link } from "./Link";

const MusicNoteIcon: Component<{ extraClass: string }> = (props) => (
	<Icon name="musicNote" extraClass={`w-24 h-24 fill-white/10 pointer-events-none ${props.extraClass}`} />
);

export const AppDrawer: Component = () => {
	const app = useApp();
	const queue = useQueue();

	const onLinkClick = () => {
		if (window.innerWidth <= 768) app.setIsMenuOpen(false);
	};

	return (
		<Drawer isOpen={app.isMenuOpen()} handleClose={() => app.setIsMenuOpen(false)}>
			<MusicNoteIcon extraClass="absolute top-0 left-2" />

			<div class="px-6 font-brand font-semibold text-3xl truncate py-8">degabut</div>
			<div class="flex-grow text-lg">
				<Link icon="audioPlaylist" label="Queue" path="/app/queue" onClick={onLinkClick} />
				<Link icon="search" label="Search" path="/app/search" onClick={onLinkClick} />
				<Link icon="heart" label="For You" path="/app/u/me/videos" onClick={onLinkClick} />
			</div>

			<div class="hidden md:block">
				<Show when={queue.data()?.nowPlaying}>
					{({ video, requestedBy }) => (
						<SolidLink
							href="/app/queue"
							class=" flex flex-col p-4 space-y-3 cursor-pointer"
							title={video.title}
							onClick={onLinkClick}
						>
							<div class="text-lg font-medium">Now Playing</div>
							<div class="flex flex-row space-x-2">
								<img class="object-cover h-16 w-16" src={video.thumbnails[0].url} alt={video.title} />
								<div class="flex-grow flex flex-col truncate">
									<div class="truncate">{video.title}</div>
									<div class="truncate text-sm text-neutral-400">{video.channel.name}</div>
									<div class="truncate text-sm text-neutral-400">
										Requested By {requestedBy.displayName}
									</div>
								</div>
							</div>
						</SolidLink>
					)}
				</Show>
			</div>

			<MusicNoteIcon extraClass="absolute bottom-2 right-2" />
		</Drawer>
	);
};
