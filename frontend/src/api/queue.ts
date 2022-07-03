import { client } from "./axios";
import { IVideoCompact } from "./videos";

export enum LoopType {
	DISABLED = "DISABLED",
	SONG = "SONG",
	QUEUE = "QUEUE",
}

export interface IQueue {
	tracks: ITrack[];
	history: ITrack[];
	autoplay: boolean;
	shuffle: boolean;
	loopType: LoopType;
	nowPlaying: ITrack | null;
	voiceChannel: IVoiceChannel;
}

export interface IVoiceChannel {
	id: string;
	name: string;
	members: IMember[];
}

export interface IMember {
	id: string;
	displayName: string;
	nickname: null | string;
	username: string;
	discriminator: string;
	avatar: null | string;
}

export interface ITrack {
	id: string;
	video: IVideoCompact;
	requestedBy: IGuildMember;
	playedAt: string | null;
}

export interface IGuildMember {
	id: string;
	displayName: string;
	nickname: string;
	username: string;
	discriminator: string;
	avatar: string;
}

export const addTrackByVideoId = async (videoId: string): Promise<ITrack> => {
	const response = await client.post("/me/queue/tracks", { videoId });
	return response.data;
};

export const addTrackByKeyword = async (keyword: string): Promise<ITrack> => {
	const response = await client.post("/me/queue/tracks", { keyword });
	return response.data;
};

export const orderTrack = async (trackId: string, to: number): Promise<void> => {
	await client.patch(`/me/queue/tracks/${trackId}/order`, { to });
};

export const skipTrack = async (): Promise<void> => {
	await client.post("/me/queue/skip");
};

export const playTrack = async (trackId: string): Promise<void> => {
	await client.post(`/me/queue/tracks/${trackId}/play`);
};

export const removeTrack = async (trackId: string): Promise<void> => {
	await client.delete(`/me/queue/tracks/${trackId}`);
};

export const clearQueue = async (excludeNowPlaying = false): Promise<void> => {
	await client.delete("/me/queue/tracks", { params: { excludeNowPlaying } });
};

export const changeLoopType = async (loopType: LoopType): Promise<void> => {
	await client.patch("/me/queue/loop-type", { loopType });
};

export const toggleShuffle = async (): Promise<void> => {
	await client.patch("/me/queue/shuffle");
};
