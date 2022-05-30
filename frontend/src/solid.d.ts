import "solid-js";
import { ContextMenuDirectiveParams } from "./providers";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			debounce: number;
			sortable: boolean;
			clickOutside: () => void;
			contextMenu: ContextMenuDirectiveParams;
			buttonContextMenu: ContextMenuDirectiveParams;
		}
	}
}
