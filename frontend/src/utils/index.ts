export * from "./debounce";
export * from "./throttle";

export const secondsToTime = (totalSeconds: number) => {
	const hours = Math.floor(totalSeconds / 3600);
	totalSeconds %= 3600;
	const minutes = Math.floor(totalSeconds / 60);
	const seconds = totalSeconds % 60;

	return [hours, minutes, seconds]
		.map((v) => (v < 10 ? "0" + v : v))
		.filter((v, i) => v !== "00" || i > 0)
		.join(":");
};
