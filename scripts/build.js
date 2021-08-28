const fs = require("fs");
const path = require("path");
const esbuild = require("esbuild");
const ts = require("typescript");

const fmts = [
	{ format: "iife", ext: "js",  },
	{ format: "cjs",  ext: "cjs", },
	{ format: "esm",  ext: "mjs", },
];

const srcDir = "src";
const distDir = "dist";

fmts.forEach((fmt) => {

	const srcPath = `${srcDir}/kaboom.ts`;
	const distPath = `${distDir}/kaboom.${fmt.ext}`;

	console.log(`${srcPath} -> ${distPath}`);

	esbuild.buildSync({
		bundle: true,
		sourcemap: true,
		target: "es6",
		minify: true,
		keepNames: true,
		loader: {
			".png": "dataurl",
			".glsl": "text",
			".mp3": "binary",
		},
		entryPoints: [ srcPath ],
		globalName: "kaboom",
		format: fmt.format,
		outfile: distPath,
	});

});

// TODO: haven't figured out how to generate the desired .d.ts with tsc
let dts = fs.readFileSync(`${srcDir}/types.ts`, "utf-8")
	.replace(/type/g, "export type")
	.replace(/interface/g, "export interface")
	.replace(/declare/g, "export default");

const f = ts.createSourceFile(
	"types.ts",
	dts,
	ts.ScriptTarget.Latest,
	true
);

const dups = new Set();
const overwrites = new Set([
	"origin",
	"focus",
]);

// generate global decls for KaboomCtx members
dts += "declare global {\n";

for (const stmt of f.statements) {
	if (stmt.name.escapedText === "KaboomCtx") {
		if (ts.SyntaxKind[stmt.kind] !== "InterfaceDeclaration") {
			throw new Error("KaboomCtx has to be an interface");
		}
		for (const mem of stmt.members) {
			if (!mem.name || dups.has(mem.name.escapedText)) {
				continue;
			}
			const name = mem.name.escapedText;
			if (mem.jsDoc) {
				// TODO: what is jsDoc when it has multiple members?
				dts += `\t/**\n\t * ${mem.jsDoc[0].comment}\n\t */\n`;
			}
			if (overwrites.has(name)) {
				dts += "\t// @ts-ignore\n";
			}
			dts += `\tconst ${name}: KaboomCtx["${name}"];\n`;
			dups.add(name);
		}
	}
}

dts += "}\n";

fs.writeFileSync(`${distDir}/kaboom.d.ts`, dts);
