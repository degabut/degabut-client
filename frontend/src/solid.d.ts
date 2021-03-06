import "solid-js";
import { ContextMenuDirectiveParams } from "./providers";

declare module "solid-js" {
	namespace JSX {
		interface Directives {
			sortable: boolean;
			clickOutside: () => void;
			doubleClick: () => void;
			contextMenu: ContextMenuDirectiveParams;
			buttonContextMenu: ContextMenuDirectiveParams;
		}
	}
}
