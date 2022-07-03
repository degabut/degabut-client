import { Icon } from "@components";
import { Component } from "solid-js";

type Props = {
	onClick: () => void;
	disabled: boolean;
};

export const SkipButton: Component<Props> = (props) => {
	return (
		<button onClick={() => props.onClick()} class="p-2" title="Skip" disabled={props.disabled}>
			<Icon name="forward" extraClass="w-5 h-5 fill-neutral-300 hover:fill-white" />
		</button>
	);
};
