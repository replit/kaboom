import express from "express"
import fs from "fs"
import path from "path"

export default (opt = {}) => {

	const port = opt.port || process.env.PORT || 8000
	const app = express()

	app.use(express.static("assets"))
	app.use("/dist", express.static("dist"))
	app.use("/demo", express.static("demo"))

	app.get("/", (req, res) => {
		const demos = (fs.readdirSync("demo"))
			.filter((p) => !p.startsWith("."))
			.map((d) => path.basename(d, ".js"))
		res.setHeader("Content-Type", "text/html")
		res.send(`
	<!DOCTYPE html>
	<html>
	<head>
	<style>
	* {
		margin: 0;
		padding: 0;
	}
	body {
		padding: 16px;
		font-size: 16px;
		font-family: Monospace;
	}
	li {
		list-style: none;
	}
	a {
		color: blue;
		text-decoration: none;
	}
	a:hover {
		background: blue;
		color: white;
	}
	</style>
	</head>
	<body>
		${demos.map((demo) => `<li><a href="/demo/${demo}">${demo}</a></li>`).join("\n")}
	</body>
	</html>
		`)
	})

	app.get("/demo/:name", (req, res) => {
		res.setHeader("Content-Type", "text/html")
		res.send(`
	<!DOCTYPE html>
	<html>
	<head>
	</head>
	<body>
	<script src="/dist/kaboom.js"></script>
	<script src="/demo/${req.params.name}.js"></script>
	</body>
	</html>
		`)
	})

	return app.listen(port, () => {
		console.log(`server started at localhost:${port}`)
	})

}
