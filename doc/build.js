// build as static html

const fs = require("fs");
const path = require("path");
const out = `${__dirname}/doc.html`;

fs.writeFileSync(out, require("./page.js"), "utf-8");
console.log(path.relative(process.cwd(), out));

