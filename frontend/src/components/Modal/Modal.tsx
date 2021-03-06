import { clickOutside } from "@directives";
import { ParentComponent, Show } from "solid-js";

clickOutside;

type Props = {
	isOpen: boolean;
	extraContainerClass?: string;
	onClickOutside?: () => void;
};

export const Modal: ParentComponent<Props> = (props) => {
	return (
		<Show when={props.isOpen}>
			<div class="fixed w-screen h-screen top-0 left-0 flex items-center justify-center bg-black/75 z-50">
				<div
					class={`max-w-[24rem] max-h-[100vh] w-full m-2 bg-neutral-900 md:p-8 p-4 ${props.extraContainerClass}`}
					use:clickOutside={props.onClickOutside}
				>
					{props.children}
				</div>
			</div>
		</Show>
	);
};
