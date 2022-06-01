import { QueueContext } from "@providers";
import { useContext } from "solid-js";

export const useQueue = () => useContext(QueueContext);
