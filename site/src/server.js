const Koa = require("koa");
const fs = require("fs");
const path = require("path");
const port = process.env.PORT || 8000;
const doc = require("./doc");
const demos = require("./demos");
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

function files(mnt, dir) {
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
			const entries = fs
				.readdirSync(p)
				.filter(p => !p.startsWith("."));
			ctx.type = "json";
			ctx.body = JSON.stringify(entries);
		} else if (stat.isFile()) {
			ctx.type = path.extname(p);
			ctx.body = fs.readFileSync(p);
		}
	};
}

function html(ctx, content) {
	ctx.type = "html";
	ctx.body = `<!DOCTYPE html>\n${content}`;
}

app.use(get("/", (ctx, next) => html(ctx, doc)));
app.use(get("/demos", (ctx, next) => html(ctx, demos)));

app.use(files("/sprites", "../sprites"));
app.use(files("/sounds", "../sounds"));
app.use(files("/src", "../src"));
app.use(files("/img", "img"));
app.use(files("/css", "src/css"));
app.use(files("/js", "src/js"));
app.use(files("/lib/dev", "../dist"));

app.listen(port);
console.log(`http://localhost:${port}`);
