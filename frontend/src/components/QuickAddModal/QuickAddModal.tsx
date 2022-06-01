import { addTrackByKeyword } from "@api";
import { Button, Input } from "@components";
import { Modal } from "@components/Modal";
import { useQueue } from "@hooks";
import { Component, createSignal, onMount } from "solid-js";

export const QuickAddModal: Component = () => {
	const queue = useQueue();
	const [isModalOpen, setIsModalOpen] = createSignal(false);
	const [keyword, setKeyword] = createSignal("");
	const [isLoading, setIsLoading] = createSignal(false);

	let input!: HTMLInputElement;

	onMount(() => {
		document.addEventListener("keydown", (e) => {
			const target = e.target as Element | null;
			const tagName = target?.tagName.toUpperCase();

			if (e.key === "Escape" && isModalOpen()) {
				e.preventDefault();
				setIsModalOpen(false);
			}

			if (tagName !== "INPUT" && tagName !== "TEXTAREA" && queue.data() && !isModalOpen() && e.key === "p") {
				e.preventDefault();
				openModal();
			}
		});
	});

	const openModal = () => {
		setIsModalOpen(true);
		input.focus();
	};

	const onSubmit = async (e: Event) => {
		e.preventDefault();
		if (!keyword()) return;

		setIsLoading(true);
		await addTrackByKeyword(keyword());
		setIsLoading(false);
		setIsModalOpen(false);
	};

	return (
		<Modal isOpen={isModalOpen()} onClickOutside={() => setIsModalOpen(false)}>
			<form onSubmit={onSubmit} class="flex flex-col space-y-6 items-center">
				<div class="text-xl font-medium">Quick Add Song</div>

				<Input
					ref={input}
					disabled={isLoading()}
					onChange={(e) => setKeyword(e.currentTarget.value)}
					placeholder="Never gonna give you up"
				/>

				<div class="flex flex-row justify-between space-x-8">
					<Button type="button" class="border-0 hover:bg-transparent" onClick={() => setIsModalOpen(false)}>
						<div class="underline">Cancel</div>
					</Button>

					<Button rounded type="submit" class="px-8" disabled={isLoading()}>
						Add Song
					</Button>
				</div>
			</form>
		</Modal>
	);
};
