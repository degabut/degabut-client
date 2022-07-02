import { Button, Modal } from "@components";
import * as runtime from "@runtime";
import { Component, createSignal, onMount, Show } from "solid-js";
import { IS_DESKTOP } from "../../../constants";

export const UpdateModal: Component = () => {
	const [isShowUpdateModal, setIsShowUpdateModal] = createSignal(false);

	onMount(() => {
		if (IS_DESKTOP) {
			runtime.EventsOn("update", () => {
				setIsShowUpdateModal(true);
			});
		}
	});

	return (
		<Show when={IS_DESKTOP}>
			{/* Update Modal */}
			<Modal isOpen={isShowUpdateModal()} onClickOutside={() => setIsShowUpdateModal(false)}>
				<div class="flex flex-col items-center space-y-8">
					<div class="text-center text-2xl font-medium">New Update Found</div>
					<div class="text-center mt-8">Restart Degabut to apply update</div>

					<Button rounded class="px-8" onClick={() => setIsShowUpdateModal(false)}>
						OK
					</Button>
				</div>
			</Modal>
		</Show>
	);
};
