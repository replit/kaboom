import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	const { kind } = req.query;
	// "kind" should always be string here, as URL param won't overwrite
	const dir = path.resolve("./public", kind as string);

	const [ status, files ] = fs.existsSync(dir)
		? [ 200, fs
			.readdirSync(dir)
			.filter((p) => !p.startsWith(".")) ]
		: [ 404, [] ];

	res
		.status(status)
		.json(files);

}
