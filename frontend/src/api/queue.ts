import { client } from "./axios";

export const addTrackByVideoId = async (videoId: string): Promise<void> => {
	await client.post("/me/queue/tracks", { videoId });
};

export const addTrackByKeyword = async (keyword: string): Promise<void> => {
	await client.post("/me/queue/tracks", { keyword });
};

export const orderTrack = async (trackId: string, to: number): Promise<void> => {
	await client.patch(`/me/queue/tracks/${trackId}/order`, { to });
};

export const removeTrack = async (trackId: string): Promise<void> => {
	await client.delete(`/me/queue/tracks/${trackId}`);
};
