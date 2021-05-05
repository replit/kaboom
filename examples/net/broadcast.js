const ws = require("ws");
const port = process.env.PORT || 7000;
const sss = new ws.Server({
	port: port,
});

sss.on("connection", (conn) => {
	conn.on("message", (data) => {
		sss.clients.forEach((client) => {
			if (client !== conn && client.readyState === ws.OPEN) {
				client.send(data);
			}
		});
	});
});

console.log(`ws://localhost:${port}`);
