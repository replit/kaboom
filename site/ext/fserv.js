// simple static file server

const www = require("./www");
const server = www.makeServer();
const port = process.env.PORT || 8000;
server.fs("/", "");
console.log(`http://localhost:${port}`);
server.serve(port);
