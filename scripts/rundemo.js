// run demo

const serveFs = require("../site/serveFs");
const http = require("http");
const port = process.env.PORT || 8000;
const server = http.createServer(serveFs("/", ""));

console.log(`http://localhost:${port}/demo/index.html`);
server.listen(port);

