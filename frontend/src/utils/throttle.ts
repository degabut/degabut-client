export const throttle = (cb: CallableFunction, limit: number) => {
	let timeout: NodeJS.Timeout | null;
	return (...args: unknown[]) => {
		if (!timeout) {
			timeout = setTimeout(() => {
				cb(...args);
				timeout = null;
			}, limit);
		}
	};
};
