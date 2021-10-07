import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { kind } = req.query;
	const dir = path.resolve("./public", kind);
	if (!fs.existsSync(dir)) {
		res.status(404).json([]);
		return;
	}
	const files = fs
		.readdirSync(dir)
		.filter((p) => !p.startsWith("."));
	res
		.status(200)
		.json(files)
		;
}
