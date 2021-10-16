import fs from "fs";
import path from "path";
import express from "express";
import ReactDOMServer from "react-dom/server";
import Home from "pages/home";
import Play from "pages/play";
const app = express();
const port = process.env.PORT || 8000;

const files = (route: string, p: string) =>
	app.use(route, express.static(path.resolve(__dirname, p)));

const page = (route: string, el: () => React.ReactElement) => {
	app.get(route, (req, res) => {
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
${ReactDOMServer.renderToString(el())}
<script>
</script>
</body>
</html>
		`);
	});
};

page("/", () => <Home />);
page("/play", () => <Play />);
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
