import fs from "fs";
import path from "path";
import express from "express";
import esbuild from "esbuild";
import ReactDOMServer from "react-dom/server";
import Home from "pages/home";
import Play from "pages/play";
import Doc from "pages/doc";

const app = express();
const port = process.env.PORT || 8000;

const files = (route: string | RegExp, p: string) =>
	app.use(route, express.static(path.resolve(__dirname, p)));

const page = (route: string | RegExp, handle: (req) => React.ReactElement | undefined) => {
	app.get(route, (req, res, next) => {
		const el = handle(req);
		if (!el) {
			return next();
		}
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
${ReactDOMServer.renderToString(el)}
</body>
</html>
		`);
	});
};

page("/", () => <Home />);
page("/play", () => <Play />);
page("/doc/:name", (req) => {
	const src = fs.readFileSync(path.resolve(__dirname, `../doc/${req.params.name}.md`), "utf8");
	return <Doc src={src} />
});
files("/sprites", "../assets/sprites");
files("/sounds", "../assets/sounds");
files("/fonts", "../assets/fonts");
files("/site", "public");
files("/site/demo", "../demo");
files("/site/doc", "../doc");
files("/lib", "../dist");

const server = app.listen(port, () =>
	console.log(`site running at http://localhost:${port}`)
);

export default server;
