import { client } from "./axios";
import { IVideoCompact } from "./videos";

export type GetLastPlayedParams = {
	last: number;
};

export type GetMostPlayedParams = {
	days: number;
	count: number;
};

export async function getVideoHistory(
	id: string,
	params: GetLastPlayedParams | GetMostPlayedParams
): Promise<IVideoCompact[]> {
	const response = await client.get(`/users/${id}/videos`, { params });
	if (response.status === 200) return response.data;
	throw new Error();
}
