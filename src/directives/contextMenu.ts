import { ContextMenuContext, ContextMenuDirectiveParams } from "@providers";
import { useNavigate } from "solid-app-router";
import { Accessor, onCleanup, useContext } from "solid-js";

export const contextMenu = (el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) => {
	const contextMenu = useContext(ContextMenuContext);
	if (contextMenu) {
		const params = accessor();

		const onContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			contextMenu.show({
				x: e.clientX,
				y: e.clientY,
				...params,
			});
		};

		el.addEventListener("contextmenu", onContextMenu);
		onCleanup(() => document.removeEventListener("contextmenu", onContextMenu));
	}
};

export const buttonContextMenu = (el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) => {
	const contextMenu = useContext(ContextMenuContext);
	if (contextMenu) {
		const navigate = useNavigate();

		const params = accessor();

		const onClick = (e: MouseEvent) => {
			e.stopPropagation();
			navigate("#");
			contextMenu.show({
				x: e.clientX,
				y: e.clientY,
				...params,
			});
		};

		el.addEventListener("click", onClick);
		onCleanup(() => document.removeEventListener("click", onClick));
	}
};
