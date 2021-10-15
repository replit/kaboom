const fs = require("fs");
const path = require("path");
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

const static = (route, p) => app.use(route, express.static(path.resolve(__dirname, p)));

const page = (route, name) => {
	app.get(route, (req, res) => {
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
	<script src="/site/page/${name}.js"></script>
</body>
</html>
		`);
	});
}

page("/", "index");
page("/play", "play");
static("/sprites", "../assets/sprites");
static("/sounds", "../assets/sounds");
static("/fonts", "../assets/fonts");
static("/site", "public");

app.listen(port, () => console.log(`site running at http://localhost:${port}`));
