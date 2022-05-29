import { clickOutside } from "@directives";
import { ParentComponent, Show } from "solid-js";

clickOutside;

type Props = {
	isOpen: boolean;
	onClickOutside?: () => void;
};

export const Modal: ParentComponent<Props> = (props) => {
	return (
		<Show when={props.isOpen}>
			<div class="fixed w-screen h-screen top-0 left-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
				<div
					class={`min-w-[24rem] min-h-[12rem] bg-neutral-900 lg:p-4 p-2`}
					use:clickOutside={props.onClickOutside}
				>
					{props.children}
				</div>
			</div>
		</Show>
	);
};
