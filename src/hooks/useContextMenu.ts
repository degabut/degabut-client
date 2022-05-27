import { ContextMenuContext } from "providers";
import { useContext } from "solid-js";

export const useContextMenu = () => useContext(ContextMenuContext);
