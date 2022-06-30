import { client } from "./axios";
import { IQueue } from "./queue";

export async function getQueue(): Promise<IQueue | null> {
	const response = await client.get("/me/queue");
	if (response.status === 404) return null;
	return response.data;
}
