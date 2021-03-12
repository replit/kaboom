// run demo

const www = require("../site/www");
const http = require("http");
const port = process.env.PORT || 8000;
const server = http.createServer(www.serveFs("/", ""));

console.log(`http://localhost:${port}/demo/index.html`);
server.listen(port);

