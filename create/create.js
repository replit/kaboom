#!/usr/bin/env node

import fs from "fs";
import cp from "child_process"
import https from "https"

const c = (n, msg) => `\x1b[${n}m${msg}\x1b[0m`

const fail = (msg, ifHelp) => {
	console.error(c(31, msg))
	if (ifHelp) console.error("\n" + help)
	process.exit(1)
}

const info = (msg) => {
	console.log(`\x1b[33m${msg}\x1b[0m`)
}

const optMap = [
	{ long: "help", short: "h", desc: "Print this message", },
	{ long: "typescript", short: "t", desc: "Use TypeScript", },
	{ long: "start", short: "s", desc: "Start the dev server right away", },
	{ long: "no-hmr", desc: "Don't use vite hmr / hot reload", },
	{ long: "demo", short: "d", value: "name", desc: "Start from a demo listed on kaboomjs.com/play", },
	{ long: "spaces", value: "num", desc: "Use spaces instead of tabs for generated files", },
	{ long: "version", short: "v", value: "label", desc: "Use a specific kaboom version (default latest)", },
]

// constructing help msg
const optDisplay = optMap.map((opt) => ({
	usage: `${opt.short ? `-${opt.short},` : "   "} --${opt.long}${opt.value ? ` <${opt.value}>` : ""}`,
	desc: opt.desc,
}));

const usageLen = optDisplay.reduce((len, dis) => dis.usage.length > len ? dis.usage.length : len, 0)

const help = `
create-kaboom v1.2.0

${c(33, "USAGE")}

  $ create-kaboom [OPTIONS] <dir>

    or

  $ npm init kaboom -- [OPTIONS] <dir>

${c(33, "OPTIONS")}

  ${optDisplay.map((opt) => `${c(32, opt.usage)} ${" ".repeat(usageLen - opt.usage.length)} ${opt.desc}`).join("\n  ")}

${c(33, "EXAMPLE")}

  ${c(30, "# quick start with default config")}
  $ npm init kaboom mygame

  ${c(30, "# need to put all args after -- if using with npm init")}
  $ npm init kaboom -- --typescript --demo burp mygame

  ${c(30, "# if installed locally you don't need to use -- when passing options")}
  $ create-kaboom -t -s -d burp mygame
`.trim()

const opts = {}
const args = []

// process opts and args
iterargs: for (let i = 2; i < process.argv.length; i++) {
	const arg = process.argv[i];
	if (arg.startsWith("-")) {
		for (const opt of optMap) {
			if (arg === `--${opt.long}` || arg === `-${opt.short}`) {
				if (opt.value) {
					const val = process.argv[++i]
					if (!val) {
						fail(`Expected value after ${arg}`)
					}
					opts[opt.long] = val
				} else {
					opts[opt.long] = true
				}
				continue iterargs
			}
		}
		fail(`Unknown option "${arg}"`, true)
	} else {
		args.push(arg)
	}
}

if (opts["help"]) {
	console.log(help)
	process.exit()
}

const dest = args[0]

if (!dest) {
	console.log(help)
	process.exit()
}

if (fs.existsSync(dest)) {
	fail(`Directory "${dest}" already exists!`)
}

const ts = opts["typescript"]

const fetch = async (opt) => new Promise((resolve) => {

	const req = https.request(opt, (res) => {
		res.on("data", resolve)
	})

	req.on("error", fail)
	req.end()

})

const exec = async (cmd, args, opts) => new Promise((resolve) => {
	const proc = cp.spawn(cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", fail)
})

let startCode = `
import kaboom from "kaboom"

kaboom()

loadBean()

add([
	pos(120, 80),
	sprite("bean"),
])

onClick(() => addKaboom(mousePos()))
`.trim()

// TODO: support pulling assets used by demo
if (opts["demo"]) {

	info(`- fetching demo "${opts["demo"]}"`)

	const demo = await fetch({
		hostname: "raw.githubusercontent.com",
		path: `replit/kaboom/master/demo/${opts["demo"]}.js`,
		method: "GET",
	})

	startCode = `import kaboom from "kaboom"\n\n` + demo.toString().trim()

}

const pkgs = [
	`kaboom@${opts["version"] ?? "latest"}`,
]

const devPkgs = [
	"vite@latest",
	...(ts ? [ "typescript@latest" ] : []),
]

const file = (name, content) => ({
	type: "file",
	name,
	content: content.trim(),
})

const dir = (name, items) => ({
	type: "dir",
	name,
	items,
})

const stringify = (obj) => JSON.stringify(obj, null, "\t")
const ext = ts ? "ts" : "js";

// describe files to generate
const template = dir(dest, [
	file("package.json", stringify({
		"name": dest,
		"scripts": {
			"dev": "vite",
			"build": "vite build",
			"preview": "vite preview",
			...(ts ? {
				"check": "tsc --noEmit src/game.ts",
			} : {}),
		},
	})),
	file("index.html", `
<!DOCTYPE html>

<html>

<head>
	<title>${dest}</title>
</head>

<body>
	<script type="module" src="/src/game.${ext}"></script>
</body>

</html>
	`),
	file(`vite.config.${ext}`, `
import { defineConfig } from "vite"

export default defineConfig(${stringify(opts["no-hmr"] ? {
	server: {
		hmr: false,
	},
} : {})})
	`),
	dir("src", [
		file(`game.${ext}`, startCode),
	]),
])

let curDir = []

const create = (dir) => {
	fs.mkdirSync(dir.name)
	process.chdir(dir.name)
	curDir.push(dir.name)
	for (const item of dir.items) {
		if (item.type === "dir") {
			create(item)
		} else if (item.type === "file") {
			const content = opts["spaces"]
				? item.content.replaceAll("\t", " ".repeat(opts["spaces"]))
				: item.content
			info(`- creating ${curDir.join("/")}/${item.name}`)
			fs.writeFileSync(item.name, content)
		}
	}
	process.chdir("..")
	curDir.pop()
}

create(template)
process.chdir(dest)

info(`- installing packages ${pkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", ...pkgs, ], { stdio: [ "inherit", "ignore", "inherit" ], })
info(`- installing dev packages ${devPkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", "-D", ...devPkgs, ], { stdio: [ "inherit", "ignore", "inherit" ], })

if (opts["start"]) {
	info(`- starting dev server`)
	await exec("npm", [ "run", "dev", ], { stdio: "inherit", })
} else {
	console.log("")
	console.log(`
Success! Now

  $ cd ${dest}
  $ npm run dev

and start editing src/game.${ext}!
	`.trim())
}
