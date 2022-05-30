import { Icon } from "@components/Icon";
import { buttonContextMenu } from "@directives";
import { ContextMenuDirectiveParams } from "@providers";
import { Component } from "solid-js";

buttonContextMenu;

type Props = {
	contextMenu: ContextMenuDirectiveParams;
};

export const ContextMenuButton: Component<Props> = (props) => {
	return (
		<div
			use:buttonContextMenu={props.contextMenu}
			class="flex flex-row items-center cursor-pointer text-neutral-400 fill-current pr-1 pl-2"
		>
			<Icon name="ellipsis" extraClass="w-4 h-4" />
		</div>
	);
};
