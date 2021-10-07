const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const port = process.env.PORT || 8000;
const land = require("./land");
const doc = require("./doc");
const demo = require("./demo");
const md = require("./md");
const global = require("./global");
const www = require("./www");
const t = www.tag;
const app = new Koa();

function get(path, cb) {
	return (ctx, next) => {
		if (ctx.method !== "GET") {
			return next();
		}
		if (ctx.path !== path) {
			return next();
		}
		cb(ctx, next);
	};
}

function redirect(from, to) {
	return get(from, (ctx) => ctx.redirect(to));
}

function files(mnt, dir, handler = {}) {
	return (ctx, next) => {
		if (ctx.method !== "GET") {
			return next();
		}
		if (!ctx.path.startsWith(mnt)) {
			return next();
		}
		const reqpath = ctx.path.replace(new RegExp(`^${mnt}`), "");
		const p = path.resolve(__dirname, dir + reqpath);
		if (!fs.existsSync(p)) {
			return next();
		}
		const stat = fs.statSync(p);
		ctx.set("Access-Control-Allow-Origin", "*");
		if (stat.isDirectory()) {
			if (ctx.accepts("html")) {
				renderDir(p)(ctx, next);
			} else if (ctx.accepts("json")) {
				const entries = fs
					.readdirSync(p)
					.filter((p) => !p.startsWith("."));
				ctx.type = "json";
				ctx.body = JSON.stringify(entries);
			}
		} else if (stat.isFile()) {
			const ext = path.extname(p).substring(1);
			if (handler[ext]) {
				handler[ext](p)(ctx, next);
			} else {
				ctx.type = path.extname(p);
				ctx.body = fs.readFileSync(p);
			}
		}
	};
}

function html(content) {
	return (ctx, next) => {
		ctx.type = "html";
		if (typeof content === "function") {
			ctx.body = `<!DOCTYPE html>\n${content()}`;
		} else {
			ctx.body = `<!DOCTYPE html>\n${content}`;
		}
	};
}

function renderDir(dir) {
	return (ctx, next) => {
		return html(t("html", {}, [
			t("head", {}, [
				...global.head,
				t("title", {}, path.basename(dir)),
				t("style", {}, www.css({
					"body": {
						"padding": "24px",
						"font-size": "32px",
					},
					"a": {
						"display": "table",
						"color": "var(--color-fg)",
						"border-radius": "12px",
						"padding": "2px 4px",
						":hover": {
							"background": "var(--color-fg)",
							"color": "var(--color-bg)",
						},
					},
				})),
			]),
			t("body", {}, fs
				.readdirSync(dir)
				.filter((p) => !p.startsWith("."))
				.sort((p1, p2) => path.extname(p1) > path.extname(p2) ? 1 : -1)
				.map((file) => {
					return t("a", { href: `${ctx.path}/${file}`, }, file);
				})),
		]))(ctx, next);
	};
}

function buildJS(p) {
	return (ctx, next) => {
		const res = esbuild.buildSync({
			bundle: true,
			write: false,
			entryPoints: [p],
		});
		const code = res?.outputFiles[0]?.text;
		if (code) {
			ctx.type = "js";
			ctx.body = code;
		} else {
			next();
		}
	};
}

const renderMD = (p) => html(md(p));

app.use(get("/", html(land)));
app.use(get("/doc", html(doc)));
app.use(get("/demo", html(demo)));
app.use(files("/sprites", "../assets/sprites"));
app.use(files("/sounds", "../assets/sounds"));
app.use(files("/fonts", "../assets/fonts"));
app.use(files("/src", "../src"));
app.use(files("/dist", "../dist"));
app.use(files("/site", ".", { js: buildJS, }));
app.use(files("/changelog", "../CHANGELOG.md", { md: renderMD, }));
app.use(files("/readme", "../README.md", { md: renderMD, }));
app.use(files("/doc", "../doc", { md: renderMD, }));
app.use(files("/lib/dev", "../dist"));
app.use(files("/kaboom.png", "kaboom.png"));
app.use(redirect("/twitter", "https://twitter.com/Kaboomjs"));
app.use(redirect("/github", "https://github.com/replit/kaboom"));
app.use(redirect("/forum", "https://github.com/replit/kaboom/discussions"));

// TODO: legacy
app.use(files("/lib", "legacy/lib"));
app.use(files("/pub/legacy", "legacy"));

app.listen(port);
console.log(`http://localhost:${port}`);
