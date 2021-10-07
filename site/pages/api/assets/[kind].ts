import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {

	const { kind } = req.query;
	const dir = path.resolve("./public", Array.isArray(kind) ? kind.join("") : kind);

	const [ status, files ] = fs.existsSync(dir)
		? [ 200, fs
			.readdirSync(dir)
			.filter((p) => !p.startsWith(".")) ]
		: [ 404, [] ]
		;

	res
		.status(status)
		.json(files)
		;

}
