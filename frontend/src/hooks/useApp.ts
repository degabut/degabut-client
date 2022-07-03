import { AppContext } from "@providers";
import { useContext } from "solid-js";

export const useApp = () => useContext(AppContext);
