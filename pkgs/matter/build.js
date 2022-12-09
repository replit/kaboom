import esbuild from "esbuild"

const dev = process.env.NODE_ENV === "development"
const srcDir = "src"
const distDir = "dist"

const fmts = [
	{
		format: "iife",
		ext: "js",
		config: {
			footer: {
				js: "window.kmatter = kmatter.default;",
			},
		},
	},
	...(dev ? [] : [
		{ format: "cjs",  ext: "cjs" },
		{ format: "esm",  ext: "mjs" },
	]),
]

fmts.forEach((fmt) => {

	const srcPath = `${srcDir}/kmatter.ts`
	const distPath = `${distDir}/kmatter.${fmt.ext}`
	const log = () => console.log(`-> ${distPath}`)

	esbuild.build({
		bundle: true,
		sourcemap: true,
		minify: !dev,
		keepNames: true,
		watch: dev ? { onRebuild: log } : false,
		entryPoints: [ srcPath ],
		globalName: "kmatter",
		format: fmt.format,
		outfile: distPath,
		...(fmt.config ?? {}),
	}).then(log)

})
