const fs = require("fs");
fs.writeFileSync("doc.html", require("./page.js"), "utf-8");
