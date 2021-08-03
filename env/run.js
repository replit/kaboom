const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const port = process.env.PORT || 8000;

const mimes = {
	"html": "text/html",
	"css": "text/css",
	"js": "text/javascript",
	"mjs": "text/javascript",
	"cjs": "text/javascript",
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

http.createServer((req, res) => {

	const requrl = url.parse(req.url, true);
	const p = requrl.pathname.substring(1);

	if (p === "") {

		const template = fs.readFileSync("template.html", "utf-8");
		const conf = JSON.parse(fs.readFileSync("conf.json", "utf-8"));
		let code = "";

		code += "<script>\n";

		code += `
kaboom({
	...${JSON.stringify(conf)},
	global: true,
});\n`;

		fs.readdirSync("sprites").forEach((file) => {
			const ext = path.extname(file);
			const name = JSON.stringify(path.basename(file, ext));
			const pp = JSON.stringify(`/sprites/${file}`);
			if (ext === ".pedit") {
				code += `loadPedit(${name}, ${pp});\n`;
			} else {
				code += `loadSprite(${name}, ${pp});\n`;
			}
		});

		fs.readdirSync("sounds").forEach((file) => {
			const name = JSON.stringify(path.basename(file, path.extname(file)));
			const pp = JSON.stringify(`/sounds/${file}`);
			code += `loadSound(${name}, ${pp});\n`;
		});

		code += "</script>\n";

		fs.readdirSync("code").forEach((file) => {
			code += `<script src="/code/${file}"></script>\n`;
		});

		res.setHeader("Content-Type", "text/html");
		res.writeHead(200);
		res.end(template.replace("{{kaboom}}", code));

		return;

	}

	if (p === "error") {
		let body = "";
		req.on("data", chunk => {
			body += chunk.toString();
		});
		req.on("end", () => {
			const err = JSON.parse(body);
			console.log(err.stack);
			res.writeHead(200);
			res.end();
		});
		return;
	}

	// serve static
	if (!fs.existsSync(p)) {
		return;
	}

	const stat = fs.statSync(p);

	if (stat.isFile()) {
		const ext = path.extname(p).substring(1);
		const mime = mimes[ext];
		if (mime) {
			res.setHeader("Content-Type", mime);
		}
		res.writeHead(200);
		res.end(fs.readFileSync(p));
		return;
	}

}).listen(port);
