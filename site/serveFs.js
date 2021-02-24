// serve static

const fs = require("fs");
const path = require("path");

const mimes = {
	"html": "text/html",
	"css": "text/css",
	"js": "text/javascript",
	"json": "application/json",
	"png": "image/png",
	"jpg": "image/jpeg",
	"jpeg": "image/jpeg",
	"gif": "image/gif",
	"svg": "image/svg+xml",
	"mp4": "video/mp4",
	"ogg": "audio/ogg",
	"wav": "audio/wav",
	"mp3": "audio/mpeg",
	"aac": "audio/aac",
	"otf": "font/otf",
	"ttf": "font/ttf",
	"woff": "text/woff",
	"woff2": "text/woff2",
	"txt": "text/plain",
	"zip": "application/zip",
	"pdf": "application/pdf",
};

function serveFs(urlPrefix, dirPrefix) {

	const pat = new RegExp(`^${urlPrefix}`);

	return (req, res) => {

		if (!req.url.match(pat)) {
			return;
		}

		const p = (dirPrefix + req.url.replace(pat, "")) || ".";

		if (!fs.existsSync(p)) {
			return;
		}

		const stat = fs.statSync(p);

		if (stat.isDirectory(p)) {

			const entries = fs
				.readdirSync(p)
				.filter(p => !p.startsWith("."));

			const page = entries
				.map(e => `<a href="/${p}/${e}">${e}</a><br>`)
				.join("");

			res.setHeader("Content-Type", "text/html; charset=utf-8");
			res.writeHead(200);
			res.end(page);

		} else {

			const ext = path.extname(p).substring(1);
			const mime = mimes[ext];

			if (mime) {
				res.setHeader("Content-Type", mime);
			}

			res.writeHead(200);
			res.end(fs.readFileSync(p));

		}

	};

}

module.exports = serveFs;

