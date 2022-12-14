import express from "express"
import fs from "fs"
import path from "path"

export default (opt = {}) => {

	const port = opt.port || process.env.PORT || 8000
	const app = express()

	app.use(express.static("assets"))
	app.use("/dist", express.static("dist"))
	app.use("/sprites", express.static("sprites"))
	app.use("/examples", express.static("examples"))

	app.get("/", (req, res) => {
		const examples = (fs.readdirSync("examples"))
			.filter((p) => !p.startsWith(".") && p.endsWith(".js"))
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
${examples.map((example) => `<li><a href="/${example}">${example}</a></li>`).join("")}
</body>
</html>
		`)
	})

	app.get("/:name", (req, res) => {
		res.setHeader("Content-Type", "text/html")
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<script src="/dist/kaboom.js"></script>
<script src="/examples/${req.params.name}.js"></script>
</body>
</html>
		`)
	})

	return app.listen(port, () => {
		console.log(`server started at localhost:${port}`)
	})

}
