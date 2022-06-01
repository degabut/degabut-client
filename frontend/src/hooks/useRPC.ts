import { RPCContext } from "@providers";
import { useContext } from "solid-js";

export const useRPC = () => useContext(RPCContext);
