import { client } from "./axios";

export type IThumbnail = {
	url: string;
	width: number;
	height: number;
};

export interface IVideo {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	viewCount: number;
	channel: IChannel;
	related?: IVideoCompact[];
}

export type IVideoCompact = {
	id: string;
	title: string;
	duration: number;
	thumbnails: IThumbnail[];
	viewCount: number | null;
	channel: IChannel;
};

export type IChannel = {
	id: string;
	name: string;
	thumbnails: IThumbnail[];
};

export async function searchVideos(keyword: string): Promise<IVideoCompact[]> {
	if (!keyword) return [];

	const response = await client.get("/videos", {
		params: { keyword },
	});
	if (response.status === 200) return response.data;
	else return [];
}

export async function getVideo(id: string): Promise<IVideo> {
	const response = await client.get("/videos/" + id);
	if (response.status === 401) throw new Error("Unauthorized");
	if (response.status !== 200) throw new Error(response.data.message);
	return response.data;
}
