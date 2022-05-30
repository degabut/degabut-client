import { client } from "./axios";
import { IVideoCompact } from "./videos";

export interface IQueue {
	tracks: ITrack[];
	history: ITrack[];
	autoplay: boolean;
	loopType: string;
}

export interface ITrack {
	id: string;
	video: IVideoCompact;
	requestedBy: IGuildMember;
}

export interface IGuildMember {
	id: string;
	displayName: string;
	nickname: string;
	username: string;
	discriminator: string;
	avatar: string;
}

type GetRecommendationsResult = {
	mostPlayed: IVideoCompact[];
	lastPlayed: IVideoCompact[];
};

export async function getRecommendations(): Promise<GetRecommendationsResult> {
	const response = await client.get("/me/videos/recommendations");
	if (response.status === 200) return response.data;
	throw new Error();
}

export async function getQueue(): Promise<IQueue | null> {
	const response = await client.get("/me/queue");
	if (response.status === 404) return null;
	return response.data;
}
