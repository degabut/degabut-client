export const debounce = <T extends CallableFunction>(cb: T, wait: number) => {
	let timeout: NodeJS.Timeout;
	const callable = (...args: unknown[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => cb(...args), wait);
	};
	return callable as unknown as T;
};
