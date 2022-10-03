#!/usr/bin/env node

// TODO: itch.io / newgrounds packaging
// TODO: interactive setup if no args
// TODO: create README.md with guide
// TODO: .gitignore
// TODO: deal with www/main.js and www/neutralino.js

const VERSION = "2.1.2"

import fs from "fs"
import cp from "child_process"
import https from "https"

const cwd = process.cwd()
const c = (n, msg) => `\x1b[${n}m${msg}\x1b[0m`
const isWindows = /^win/.test(process.platform)

const fail = (msg, ifHelp) => {
	console.error(c(31, msg))
	if (ifHelp) console.error("\n" + help)
	process.exit(1)
}

const info = (msg) => {
	console.log(`\x1b[33m${msg}\x1b[0m`)
}

const optMap = [
	{ long: "help", short: "h", desc: "Print this message" },
	{ long: "typescript", short: "t", desc: "Use TypeScript" },
	{ long: "desktop", short: "d", desc: "Enable packaging for desktop release" },
	{ long: "example", short: "e", value: "name", desc: "Start from a example listed on kaboomjs.com/play" },
	{ long: "spaces", value: "level", desc: "Use spaces instead of tabs for generated files" },
	{ long: "version", short: "v", value: "label", desc: "Use a specific kaboom version (default latest)" },
]

// constructing help msg
const optDisplay = optMap.map((opt) => ({
	usage: `${opt.short ? `-${opt.short},` : "   "} --${opt.long}${opt.value ? ` <${opt.value}>` : ""}`,
	desc: opt.desc,
}))

const usageLen = optDisplay.reduce((len, dis) => dis.usage.length > len ? dis.usage.length : len, 0)

const help = `
create-kaboom v${VERSION}

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
  $ npm init kaboom -- --typescript --example burp mygame

  ${c(30, "# if installed locally you don't need to use -- when passing options")}
  $ create-kaboom -t -s -d burp mygame
`.trim()

const opts = {}
const args = []

// process opts and args
iterargs: for (let i = 2; i < process.argv.length; i++) {
	const arg = process.argv[i]
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

const stringify = (obj) => JSON.stringify(obj, null, "\t")
const ts = opts["typescript"]
const desktop = opts["desktop"]
const ext = ts ? "ts" : "js"

const download = async (url, to) => new Promise((resolve) => {
	const file = fs.createWriteStream(to)
	https.get(url, (res) => {
		res.pipe(file)
		file.on("finish", () => {
			file.close()
			resolve()
		})
	})
})

const request = async (opt) => new Promise((resolve) => {
	const req = https.request(opt, (res) => {
		res.on("data", resolve)
	})
	req.on("error", fail)
	req.end()
})

const exec = async (cmd, args, opts) => new Promise((resolve) => {
	const proc = cp.spawn(isWindows ? cmd + ".cmd" : cmd, args, opts)
	proc.on("exit", resolve)
	proc.on("error", fail)
})

let startCode = `
import kaboom from "kaboom"${ts ? "\nimport \"kaboom/global\"" : ""}

kaboom()

loadBean()

add([
	pos(120, 80),
	sprite("bean"),
])

onClick(() => addKaboom(mousePos()))
`.trim()

// TODO: support pulling assets used by example
if (opts["example"]) {

	info(`- fetching example "${opts["example"]}"`)

	const example = await request({
		hostname: "raw.githubusercontent.com",
		path: `replit/kaboom/master/example/${opts["example"]}.js`,
		method: "GET",
	})

	startCode = "import kaboom from \"kaboom\"\n\n" + example.toString().trim()

}

const pkgs = [
	`kaboom@${opts["version"] ?? "latest"}`,
]

const devPkgs = [
	"esbuild@latest",
	...(ts ? [ "typescript@latest" ] : []),
	...(desktop ? [ "@neutralinojs/neu@latest" ] : []),
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

const create = (item) => {
	if (item.type === "dir") {
		fs.mkdirSync(item.name)
		process.chdir(item.name)
		item.items.forEach(create)
		process.chdir("..")
	} else if (item.type === "file") {
		const content = opts["spaces"]
			? item.content.replaceAll("\t", " ".repeat(opts["spaces"]))
			: item.content
		const dir = process.cwd().replace(new RegExp(`^${cwd}/`), "")
		info(`- creating ${dir}/${item.name}`)
		fs.writeFileSync(item.name, content)
	}
}

const toAlphaNumeric = (text) => text.toLowerCase().replace(/[^a-z0-9]/g, "")

// generate core files
create(dir(dest, [
	file("package.json", stringify({
		"name": dest,
		"scripts": {
			"watch": "esbuild --bundle src/game.ts --outfile=www/main.js --watch",
			"build": "esbuild --bundle src/game.ts --outfile=www/main.js",
			"dev": "esbuild --bundle src/game.ts --outfile=www/main.js --servedir=www",
			...(ts ? {
				"check": "tsc --noEmit src/game.ts",
			} : {}),
			...(desktop ? {
				"run:desktop": "neu run",
				"build:desktop": "neu build --release",
			} : {}),
		},
	})),
	dir("www", [
		file("index.html", `
<!DOCTYPE html>
<html>
<head>
	<title>${dest}</title>
</head>
<body>
	<script src="/main.js"></script>
</body>
</html>
		`),
	]),
	dir("src", [
		file(`game.${ext}`, startCode),
	]),
	...(desktop ? [
		file("neutralino.config.json", stringify({
			"applicationId": `com.kaboomjs.${toAlphaNumeric(dest)}`,
			"version": "1.0.0",
			"defaultMode": "window",
			"documentRoot": "/www/",
			"url": "/",
			"enableServer": true,
			"enableNativeAPI": true,
			"modes": {
				"window": {
					"title": dest,
					"icon": "/www/icon.png",
					"width": 640,
					"height": 480,
				},
			},
			"cli": {
				"binaryName": dest,
				"resourcesPath": "/www/",
				"extensionsPath": "/extensions/",
				"clientLibrary": "/www/neutralino.js",
				"binaryVersion": "4.7.0",
				"clientVersion": "3.6.0",
			},
		})),
	] : []),
]))

process.chdir(dest)

info(`- installing packages ${pkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", ...pkgs ], { stdio: [ "inherit", "ignore", "inherit" ] })
info(`- installing dev packages ${devPkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", "-D", ...devPkgs ], { stdio: [ "inherit", "ignore", "inherit" ] })

if (desktop) {
	info("- downloading neutralino files")
	await exec("npx", [ "neu", "update" ], { stdio: "inherit" })
	info("- downloading icon")
	await download(
		"https://raw.githubusercontent.com/replit/kaboom/master/sprites/k.png",
		"www/icon.png",
	)
}

console.log("")
console.log(`
Success! Now

  $ cd ${dest}
  $ npm run dev

and start editing src/game.${ext}!
`.trim())
