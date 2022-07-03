import { IMember } from "@api";
import { Drawer, Icon, Icons } from "@components";
import { contextMenu } from "@directives";
import { useApp, useQueue } from "@hooks";
import { useNavigate } from "solid-app-router";
import { Component, For } from "solid-js";

contextMenu;

type HeaderProps = {
	member: IMember;
};

const Header: Component<HeaderProps> = (props) => {
	return (
		<div class="flex flex-row items-center py-4  px-6 space-x-4">
			{props.member.avatar && <img src={props.member.avatar || ""} class="w-12 h-12 rounded-full" />}

			<div class="font-semibold">{props.member.displayName}</div>
		</div>
	);
};

type ItemProps = {
	icon: Icons;
	iconSize?: "md" | "lg";
	label: string;
};

const Item: Component<ItemProps> = (props) => {
	return (
		<div class="flex flex-row space-x-6 items-center">
			<Icon name={props.icon} size={props.iconSize} extraClass="fill-current text-neutral-400" />
			<div>{props.label}</div>
		</div>
	);
};

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
								header: () => <Header member={member} />,
								extraContainerClass: "bg-neutral-900",
								items: [
									{
										element: () => <Item icon="heart" iconSize="lg" label="Recommendation" />,
										onClick: () => navigate(`/app/u/${member.id}/videos`),
									},
								],
								openWithClick: true,
							}}
						>
							<img src={member.avatar || undefined} class="w-8 h-8 rounded-full" />
							<div class="truncate">{member.displayName}</div>
						</div>
					)}
				</For>
			</div>
		</Drawer>
	);
};
