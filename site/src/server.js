const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const marked = require("marked");
const hljs = require("highlight.js");
const esbuild = require("esbuild");
const port = process.env.PORT || 8000;
const doc = require("./doc");
const demos = require("./demos");
const gstyle = require("./gstyle");
const www = require("./www");
const t = www.tag;
const app = new Koa();

marked.setOptions({
	highlight: (code, lang) => {
		return hljs.highlight(code, {
			language: lang,
		}).value;
	}
});

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
		const p = path.resolve(dir + reqpath);
		if (!fs.existsSync(p)) {
			return next();
		}
		const stat = fs.statSync(p);
		if (stat.isDirectory()) {
			if (ctx.accepts("html")) {
				renderDir(p)(ctx, next);
			} else if (ctx.accepts("json")) {
				const entries = fs
					.readdirSync(p)
					.filter(p => !p.startsWith("."));
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
		ctx.body = `<!DOCTYPE html>\n${content}`;
	};
}

function renderDir(dir) {
	return (ctx, next) => {
		return html(t("html", {}, [
			t("head", {}, [
				t("title", {}, path.basename(dir)),
				t("style", {}, www.css(gstyle)),
				t("style", {}, www.css({
					"body": {
						"padding": "24px",
						"font-size": "32px",
					},
					"a": {
						"display": "table",
						":hover": {
							"background": "#333333",
							"color": "white",
						},
					},
				})),
				t("link", { rel: "icon", href: "/kaboom.png"}),
			]),
			t("body", {}, fs.readdirSync(dir).map((file) => {
				return t("a", { href: `${ctx.path}/${file}`, }, file);
			})),
		]))(ctx, next);
	}
}

function renderMD(p) {
	return html(t("html", {}, [
		t("head", {}, [
			t("title", {}, path.basename(p)),
			t("style", {}, www.css(gstyle)),
			t("style", {}, www.css({
				"#content": {
					"margin": "0 auto",
					"max-width": "640px",
					...www.vspace(24),
				},
			})),
			t("link", { rel: "icon", href: "/kaboom.png"}),
			t("link", { rel: "stylesheet", href: "/css/paraiso.css"}),
		]),
		t("body", {}, [
			t("div", { id: "content", }, marked(fs.readFileSync(p, "utf-8"))),
		]),
	]));
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

app.use(get("/", html(doc)));
app.use(get("/demos", html(demos)));
app.use(files("/sprites", "../sprites"));
app.use(files("/sounds", "../sounds"));
app.use(files("/src", "../src"));
app.use(files("/dist", "../dist"));
app.use(files("/img", "img"));
app.use(files("/fonts", "fonts"));
app.use(files("/css", "src/css"));
app.use(files("/changelog", "../CHANGELOG.md", { md: renderMD, }));
app.use(files("/readme", "../README.md", { md: renderMD, }));
app.use(files("/tut", "../tut", { md: renderMD, }));
app.use(files("/js", "src/js", { js: buildJS, }));
app.use(files("/lib/dev", "../dist"));
app.use(files("/kaboom.png", "kaboom.png"));
app.use(redirect("/twitter", "https://twitter.com/Kaboomjs"));
app.use(redirect("/github", "https://github.com/replit/kaboom"));
app.use(redirect("/forum", "https://github.com/replit/kaboom/discussions"));

app.listen(port);
console.log(`http://localhost:${port}`);
