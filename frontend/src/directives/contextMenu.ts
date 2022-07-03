import { ContextMenuContext, ContextMenuDirectiveParams } from "@providers";
import { useNavigate } from "solid-app-router";
import { Accessor, onCleanup, useContext } from "solid-js";

export const contextMenu = (el: HTMLElement, accessor: Accessor<ContextMenuDirectiveParams>) => {
	const contextMenu = useContext(ContextMenuContext);
	if (contextMenu) {
		const params = accessor();

		const onContextMenu = (e: MouseEvent) => {
			e.preventDefault();
			setTimeout(() => {
				contextMenu.show({
					x: e.pageX,
					y: e.pageY,
					...params,
				});
			}, 0);
		};

		el.addEventListener("contextmenu", onContextMenu);
		if (params.openWithClick) el.addEventListener("click", onContextMenu);

		onCleanup(() => {
			el.removeEventListener("contextmenu", onContextMenu);
			if (params.openWithClick) el.removeEventListener("click", onContextMenu);
		});
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
				x: e.pageX,
				y: e.pageY,
				...params,
			});
		};

		el.addEventListener("click", onClick);
		onCleanup(() => document.removeEventListener("click", onClick));
	}
};
