// helpers for the world wide web

const http = require("http");
const fs = require("fs");
const path = require("path");

function escapeHTML(unsafe) {
	return unsafe
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

// html builder
function tag(tagname, attrs, children) {

	let html = `<${tagname}`;

	for (const k in attrs) {
		let v = attrs[k];
		switch (typeof(v)) {
			case "boolean":
				if (v === true) {
					html += ` ${k}`;
				}
				break;
			case "string":
				if (typeof(v) === "string") {
					v = `"${v}"`;
				}
			case "number":
				html += ` ${k}=${v}`;
				break;
		}
	}

	html += ">";

	if (typeof(children) === "string") {
		html += children;
	} else if (Array.isArray(children)) {
		for (const child of children) {
			if (!child) {
				continue;
			}
			if (Array.isArray(child)) {
				html += tag("div", {}, child);
			} else {
				html += child;
			}
		}
	}

	if (children !== undefined && children !== null) {
		html += `</${tagname}>`;
	}

	return html;

}

// sass-like css preprocessor
function style(list) {

	let text = "";

	function handleSheet(s) {
		let t = "{";
		for (const k in s) {
			t += k + ":" + s[k] + ";";
		}
		t += "}";
		return t;
	}

	function handleSheetEx(sel, sheet) {
		let t = sel + " {";
		let post = "";
		for (const key in sheet) {
			const val = sheet[key];
			// media
			if (key === "@media") {
				for (const cond in val) {
					post += "@media " + cond + "{" + sel + handleSheet(val[cond]) + "}";
				}
			// pseudo class
			} else if (key[0] === ":") {
				post += handleSheetEx(sel + key, val);
			// self
			} else if (key[0] === "&") {
				post += handleSheetEx(sel + key.substring(1), val);
			// nesting child
			} else if (typeof(val) === "object") {
				post += handleSheetEx(sel + " " + key, val);
			} else {
				t += key + ":" + val + ";";
			}
		}
		t += "}" + post;
		return t;
	}

	for (const sel in list) {
		const sheet = list[sel];
		if (sel === "@keyframes") {
			for (const name in sheet) {
				const map = sheet[name];
				text += "@keyframes " + name + "{";
				for (const time in map) {
					text += time + handleSheet(map[time]);
				}
				text += "}";
			}
		} else {
			text += handleSheetEx(sel, sheet);
		}
	}

	return text;

}

function makeServer() {

	const handlers = [];

	return {

		handle(cb) {
			handlers.push(cb);
		},

		match(pat, cb) {
			this.handle((req, res) => {
				const match = matchUrl(pat, req.url);
				if (match) {
					cb(req, res, match);
				}
			});
		},

		fs(prefix, root) {
			this.handle((req, res) => {
				const url = req.url.split("?")[0];
				if (!url.startsWith(prefix)) {
					return;
				}
				const p = root + "/" + url.replace(new RegExp(`^${prefix}`), "");
				if (!fs.existsSync(p)) {
					return;
				}
				const stat = fs.statSync(p);
				const handler = stat.isDirectory(p) ? serveDir(p, prefix) : serveFile(p);
				handler(req, res);
			});
		},

		serve(port) {
			http.createServer((req, res) => {
				for (const handler of handlers) {
					handler(req, res);
					if (res.finished) {
						return;
					}
				}
			}).listen(port);
		},

	};

}

function matchUrl(pat, url) {

	pat = pat.replace(/\/$/, "");
	url = url.split("?")[0];
	url = url.replace(/\/$/, "");

	if (pat === url) {
		return {};
	}

	const vars = pat.match(/:[^\/]+/g) || [];
	let regStr = pat;

	for (const v of vars) {
		const name = v.substring(1);
		regStr = regStr.replace(v, `(?<${name}>[^\/]+)`);
	}

	regStr = "^" + regStr + "$";

	const reg = new RegExp(regStr);
	const matches = reg.exec(url);

	if (matches) {
		return { ...matches.groups };
	} else {
		return null;
	}

}

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

function serveFile(p) {

	return (req, res) => {

		if (!fs.existsSync(p)) {
			return;
		}

		const ext = path.extname(p).substring(1);
		const mime = mimes[ext];

		if (mime) {
			res.setHeader("Content-Type", mime);
		}

		res.setHeader("Access-Control-Allow-Origin", "*");
		res.writeHead(200);
		res.end(fs.readFileSync(p));

	};

}

function serveDir(p, root) {

	return (req, res) => {

		if (!fs.existsSync(p)) {
			return;
		}

		const entries = fs
			.readdirSync(p)
			.filter(p => !p.startsWith("."));

		const page = entries
			.map(e => `<a href="${req.url}/${e}">${e}</a><br>`)
			.join("");

		res.setHeader("Content-Type", "text/html; charset=utf-8");
		res.writeHead(200);
		res.end(page);

	};

}

module.exports = {
	tag,
	style,
	escapeHTML,
	makeServer,
};
