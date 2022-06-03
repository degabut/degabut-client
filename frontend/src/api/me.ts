import { client } from "./axios";
import { IQueue } from "./queue";
import { IVideoCompact } from "./videos";

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
