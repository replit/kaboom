import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

const fowardHeaders = [
	"Content-Type",
];

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { url } = req.query;
	const r = await fetch(url as string);
	for (const header of fowardHeaders) {
		const val = r.headers.get(header);
		if (val) {
			res.setHeader(header, val);
		}
	}
	res.send(r.body);
}
