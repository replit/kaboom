import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	const { kind } = req.query;
	// "kind" should always be string here, as URL param won't overwrite
	const dir = path.resolve("./public", kind as string);
	const stat = await fs.stat(dir);

	const [ status, files ] = stat.isDirectory()
		? [ 200, (await fs.readdir(dir)).filter((p) => !p.startsWith(".")) ]
		: [ 404, [] ];

	res
		.status(status)
		.json(files);

}
