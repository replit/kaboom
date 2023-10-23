import fs from "fs/promises"
import cp from "child_process"
import path from "path"
import * as esbuild from "esbuild"
import express from "express"
import ts from "typescript"

const srcDir = "src"
const distDir = "dist"
const srcPath = `${srcDir}/kaboom.ts`

const fmts = [
	{
		format: "iife",
		globalName: "kaboom",
		outfile: `${distDir}/kaboom.js`,
		footer: {
			js: "window.kaboom = kaboom.default",
		},
	},
	{ format: "cjs", outfile: `${distDir}/kaboom.cjs` },
	{ format: "esm", outfile: `${distDir}/kaboom.mjs` },
]

const config = {
	bundle: true,
	sourcemap: true,
	minify: true,
	keepNames: true,
	loader: {
		".png": "dataurl",
		".glsl": "text",
		".mp3": "binary",
	},
	entryPoints: [ srcPath ],
}

export async function build() {
	return Promise.all(fmts.map((fmt) => {
		return esbuild.build({
			...config,
			...fmt,
		}).then(() => console.log(`-> ${fmt.outfile}`))
	}))
}

export async function dev() {
	// TODO: use esbuild serve?
	serve()
	const ctx = await esbuild.context({
		...config,
		...fmts[0],
		minify: false,
		plugins: [
			{
				name: "logger",
				setup(b) {
					b.onEnd(() => {
						console.log(`-> ${fmts[0].outfile}`)
					})
				},
			},
		],
	})
	await ctx.watch()
}

async function writeFile(path, content) {
	await fs.writeFile(path, content)
	console.log(`-> ${path}`)
}

export async function genDTS() {

	// generate .d.ts / docs data
	const dts = await fs.readFile(`${srcDir}/types.ts`, "utf-8")

	const f = ts.createSourceFile(
		"ts",
		dts,
		ts.ScriptTarget.Latest,
		true,
	)

	function transform(o, f) {
		for (const k in o) {
			if (o[k] == null) {
				continue
			}
			const v = f(k, o[k])
			if (v != null) {
				o[k] = v
			} else {
				delete o[k]
			}
			if (typeof o[k] === "object") {
				transform(o[k], f)
			}
		}
		return o
	}

	// transform and prune typescript ast to a format more meaningful to us
	const stmts = transform(f.statements, (k, v) => {
		switch (k) {
			case "end":
			case "flags":
			case "parent":
			case "modifiers":
			case "transformFlags":
			case "modifierFlagsCache": return
			case "name":
			case "typeName":
			case "tagName": return v.escapedText
			case "pos": return typeof v === "number" ? undefined : v
			case "kind": return ts.SyntaxKind[v]
			case "questionToken": return true
			case "members": {
				const members = {}
				for (const mem of v) {
					const name = mem.name?.escapedText
					if (!name || name === "toString") {
						continue
					}
					if (!members[name]) {
						members[name] = []
					}
					members[name].push(mem)
				}
				return members
			}
			case "jsDoc": {
				const doc = v[0]
				const taglist = doc.tags ?? []
				const tags = {}
				for (const tag of taglist) {
					const name = tag.tagName.escapedText
					if (!tags[name]) {
						tags[name] = []
					}
					tags[name].push(tag.comment)
				}
				return {
					doc: doc.comment,
					tags: tags,
				}
			}
			default: return v
		}
	})

	// check if global defs are being generated
	let globalGenerated = false

	// generate global decls for KaboomCtx members
	let globalDts = ""

	globalDts += "import { KaboomCtx } from \"./kaboom\"\n"
	globalDts += "declare global {\n"

	for (const stmt of stmts) {
		if (stmt.name === "KaboomCtx") {
			if (stmt.kind !== "InterfaceDeclaration") {
				throw new Error("KaboomCtx must be an interface.")
			}
			for (const name in stmt.members) {
				globalDts += `\tconst ${name}: KaboomCtx["${name}"]\n`
			}
			globalGenerated = true
		}
	}

	globalDts += "}\n"

	if (!globalGenerated) {
		throw new Error("KaboomCtx not found, failed to generate global defs.")
	}

	writeFile(`${distDir}/kaboom.d.ts`, dts)
	writeFile(`${distDir}/global.d.ts`, globalDts)
	writeFile(`${distDir}/global.js`, "")

}

export function serve(opt = {}) {

	const port = opt.port || process.env.PORT || 8000
	const app = express()

	app.use(express.static("assets"))
	app.use("/dist", express.static("dist"))
	app.use("/sprites", express.static("sprites"))
	app.use("/examples", express.static("examples"))

	app.get("/", async (req, res) => {
		const examples = (await fs.readdir("examples"))
			.filter((p) => !p.startsWith(".") && p.endsWith(".js"))
			.map((d) => path.basename(d, ".js"))
		res.setHeader("Content-Type", "text/html")
		res.send(`
<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
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

	app.get("/:name", async (req, res) => {
		const name = req.params.name
		if (!await isFile(`examples/${name}.js`)) {
			res.status(404)
			res.send(`example not found: ${name}`)
			return
		}
		res.setHeader("Content-Type", "text/html")
		res.send(`
<!DOCTYPE html>
<html>
<head>
</head>
<body>
<script src="/dist/kaboom.js"></script>
<script src="/examples/${name}.js"></script>
</body>
</html>
		`)
	})

	return app.listen(port, () => {
		console.log(`server started at http://localhost:${port}`)
	})

}

export const isWindows = /^win/.test(process.platform)
export const c = (n, msg) => `\x1b[${n}m${msg}\x1b[0m`
export const wait = (time) => new Promise((resolve) =>
	setTimeout(() => resolve(), time))
export const exec = async (cmd, args, opts) => new Promise((resolve, reject) => {
	const proc = cp.spawn(isWindows ? cmd + ".cmd" : cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", reject)
})
export const exists = (path) =>
	fs
		.access(path)
		.then(() => true)
		.catch(() => false)
export const isFile = (path) =>
	fs
		.stat(path)
		.then((stat) => stat.isFile())
		.catch(() => false)
export const isDir = (path) =>
	fs
		.stat(path)
		.then((stat) => stat.isDirectory())
		.catch(() => false)
