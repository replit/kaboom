import fs from "fs";
import { resolve, basename } from "path";
import express from "express";
import esbuild from "esbuild";
import ReactDOMServer from "react-dom/server";
import Home from "pages/home";
import Play from "pages/play";
import Doc from "pages/doc";

const app = express();
const port = process.env.PORT || 8000;

const path = (p: string) => resolve(__dirname, p);
const files = (route: string | RegExp, p: string) =>
	app.use(route, express.static(path(p)));

const page = (route: string | RegExp, handle: (req) => React.ReactElement | undefined) => {
	app.get(route, (req, res, next) => {
		const el = handle(req);
		if (!el) return next();
		const stream = ReactDOMServer.renderToNodeStream(el);
		res.write(`
<!DOCTYPE html>
<html>
<head>
<script>
window.PROPS = ${JSON.stringify(el.props).replaceAll("</script>", "<\\/script>")};
</script>
</head>
<body>
		`);
		stream.pipe(res, { end: false });
		stream.on("end", () =>{
			res.write(`
</body>
</html>
			`);
			res.end();
		});
	});
};

page("/", () => <Home />);

page("/play", () => {
	const demos = fs
		.readdirSync(path("../demo"))
		.filter((p) => !p.startsWith("."))
		.reduce<Record<string, string>>((table, file) => {
			table[basename(file, ".js")] = fs.readFileSync(path(`../demo/${file}`), "utf8");
			return table;
		}, {});
	return <Play demos={demos} />;
});

page("/doc/:name", (req) => {
	const src = fs.readFileSync(path(`../doc/${req.params.name}.md`), "utf8");
	return <Doc src={src} />
});

files("/sprites", "../assets/sprites");
files("/sounds", "../assets/sounds");
files("/fonts", "../assets/fonts");
files("/site", "public");
files("/site/demo", "../demo");
files("/site/doc", "../doc");
files("/lib", "../dist");

export default app.listen(port, () =>
	console.log(`site running at http://localhost:${port}`)
);
