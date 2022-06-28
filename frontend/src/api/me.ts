import { client } from "./axios";
import { IQueue } from "./queue";
import { IVideoCompact } from "./videos";

export type GetLastPlayedParams = {
	last: number;
};

export type GetMostPlayedParams = {
	days: number;
	count: number;
};

export async function getVideoHistory(params: GetLastPlayedParams | GetMostPlayedParams): Promise<IVideoCompact[]> {
	const response = await client.get("/me/videos", { params });
	if (response.status === 200) return response.data;
	throw new Error();
}

export async function getQueue(): Promise<IQueue | null> {
	const response = await client.get("/me/queue");
	if (response.status === 404) return null;
	return response.data;
}
