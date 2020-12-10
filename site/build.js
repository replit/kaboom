// build as static html

const fs = require("fs");
const path = require("path");

const pages = [
	"main",
	"guide",
];

for (const page of pages) {
	const out = `${__dirname}/build/${page}.html`;
	fs.writeFileSync(out, require(`./${page}.js`), "utf-8");
	console.log(path.relative(process.cwd(), out));
}

