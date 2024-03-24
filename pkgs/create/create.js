#!/usr/bin/env node

const VERSION = "2.6.0"

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

const info = (msg) => console.log(c(33, msg))

const optMap = [
	{ long: "help", short: "h", desc: "Print this message" },
	{ long: "typescript", short: "t", desc: "Use TypeScript" },
	{ long: "desktop", short: "d", desc: "Enable packaging for desktop with tauri" },
	{ long: "example", short: "e", value: "name", desc: "Start from a example listed on kaboomjs.com/play" },
	{ long: "spaces", value: "level", desc: "Use spaces instead of tabs for generated files" },
	{ long: "version", short: "v", value: "label", desc: "Use a specific kaboom version (default latest)" },
]

// constructing help msg
const optDisplay = optMap.map((opt) => ({
	usage: `${opt.short ? `-${opt.short},` : "   "} --${opt.long}${opt.value ? ` <${opt.value}>` : ""}`,
	desc: opt.desc,
}))

const usageLen = optDisplay
	.reduce((len, dis) => dis.usage.length > len ? dis.usage.length : len, 0)

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

// TODO: interactive creation
if (!dest) {
	console.log(help)
	process.exit()
}

if (fs.existsSync(dest)) {
	fail(`Directory "${dest}" already exists!`)
}

const stringify = (obj) => JSON.stringify(obj, null, opts["spaces"] ? 4 : "\t")
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

const updateJSONFile = (path, action) => {
	const json = JSON.parse(fs.readFileSync(path, "utf8"))
	fs.writeFileSync(path, stringify(action(json)))
}

let startCode = `
import kaboom from "kaboom"

const k = kaboom()

k.loadSprite("bean", "sprites/bean.png")

k.add([
	k.pos(120, 80),
	k.sprite("bean"),
])

k.onClick(() => k.addKaboom(k.mousePos()))
`.trim()

// TODO: pull assets used by example
if (opts["example"]) {

	info(`- fetching example "${opts["example"]}"`)

	const example = await request({
		hostname: "raw.githubusercontent.com",
		path: `replit/kaboom/master/examples/${opts["example"]}.js`,
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
	...(desktop ? [ "@tauri-apps/cli@latest" ] : []),
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

// generate core files
create(dir(dest, [
	file("package.json", stringify({
		"name": dest,
		"scripts": {
			"build": `esbuild --bundle src/main.${ext} --outfile=www/main.js --minify`,
			"dev": `esbuild --bundle --sourcemap --keep-names src/main.${ext} --outfile=www/main.js --servedir=www`,
			"bundle": "npm run build && mkdir -p dist && zip -r dist/game.zip www -x \"**/.DS_Store\"",
			...(ts ? {
				"check": "tsc",
			} : {}),
			...(desktop ? {
				"dev:desktop": "tauri dev",
				"build:desktop": "tauri build",
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
	<script src="main.js"></script>
</body>
</html>
		`),
		dir("sprites", []),
	]),
	dir("src", [
		file(`main.${ext}`, startCode),
	]),
	file("README.md", ""),
	...(ts ? [
		file("tsconfig.json", stringify({
			compilerOptions: {
				noEmit: true,
				target: "esnext",
				moduleResolution: "node",
			},
			include: [
				"src/**/*.ts",
			],
		})),
	] : []),
	file(".gitignore", `
node_modules/
www/main.js
dist/
${desktop ? "src-tauri/target/" : ""}
	`),
	file("README.md", `
# Folder structure

- \`src\` - source code for your kaboom project
- \`www\` - distribution folder, contains your index.html, built js bundle and static assets
${desktop ? "- `src-tauri` - tauri project folder, contains tauri config file, icons, rust source if you need native code" : ""}

## Development

\`\`\`sh
$ npm run dev
\`\`\`

will start a dev server at http://localhost:8000

## Distribution

\`\`\`sh
$ npm run build
\`\`\`

will build your js files into \`www/main.js\`

\`\`\`sh
$ npm run bundle
\`\`\`

will build your game and package into a .zip file, you can upload to your server or itch.io / newground etc.

${desktop ? `
## Desktop

This project uses tauri for desktop builds, you have to have \`rust\` installed on your system for desktop to work, check out [tauri setup guide](https://tauri.app/v1/guides/getting-started/prerequisites/)

For tauri native APIs look [here](https://tauri.app/v1/api/js/)

\`\`\`sh
$ npm run dev:desktop
\`\`\`

will start the dev server and a native window that servers content from that dev server

\`\`\`sh
$ npm run build:desktop
\`\`\`

will create distributable native app package
` : ""}
	`),
]))

process.chdir(dest)

info("- downloading default sprites")
await download(
	"https://raw.githubusercontent.com/replit/kaboom/master/sprites/bean.png",
	"www/sprites/bean.png",
)

info(`- installing packages ${pkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", ...pkgs ], { stdio: [ "inherit", "ignore", "inherit" ] })
info(`- installing dev packages ${devPkgs.map((pkg) => `"${pkg}"`).join(", ")}`)
await exec("npm", [ "install", "-D", ...devPkgs ], { stdio: [ "inherit", "ignore", "inherit" ] })

if (desktop) {
	info("- starting tauri project for desktop build")
	await exec("npx", [
		"tauri", "init",
		"--app-name", dest,
		"--window-title", dest,
		"--dist-dir", "../www",
		"--dev-path", "http://localhost:8000",
		"--before-dev-command", "npm run dev",
		"--before-build-command", "npm run build",
		"--ci",
	], { stdio: "inherit" })
	await download(
		"https://raw.githubusercontent.com/replit/kaboom/master/sprites/k.png",
		"www/icon.png",
	)
	await exec("npx", ["tauri", "icon", "www/icon.png"], { stdio: "inherit" })
	updateJSONFile("src-tauri/tauri.conf.json", (cfg) => {
		cfg.tauri.bundle.identifier = "com.kaboom.dev"
		return cfg
	})
}

console.log("")
console.log(`
Success! Now

  $ cd ${dest}
  $ npm run dev

and start editing src/main.${ext}!
`.trim())
