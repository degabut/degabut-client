import { Drawer } from "@components";
import { contextMenu } from "@directives";
import { useApp, useQueue } from "@hooks";
import { useNavigate } from "solid-app-router";
import { Component, For } from "solid-js";

contextMenu;

export const MemberListDrawer: Component = () => {
	const app = useApp();
	const queue = useQueue();
	const navigate = useNavigate();

	return (
		<Drawer
			isOpen={app.isMemberOpen()}
			handleClose={() => app.setIsMemberOpen(false)}
			extraContainerClass="right-0"
		>
			<div class="text-xl font-bold truncate px-4 py-6">{queue.data()?.voiceChannel.name}</div>
			<div class="overflow-y-auto overflow-x-hidden">
				<For each={queue.data()?.voiceChannel.members || []}>
					{(member) => (
						<div
							class="flex flex-row items-center space-x-2 px-4 py-2 cursor-pointer hover:bg-white/5"
							use:contextMenu={{
								extraContainerClass: "bg-neutral-900",
								items: [
									{
										label: "Recommendation",
										onClick: () => navigate(`/app/u/${member.id}/videos`),
									},
								],
								openWithClick: true,
							}}
						>
							<img src={member.avatar || undefined} class="w-8 h-8 rounded-full" />
							<div class="truncate">
								{member.displayName}#{member.discriminator}
							</div>
						</div>
					)}
				</For>
			</div>
		</Drawer>
	);
};
