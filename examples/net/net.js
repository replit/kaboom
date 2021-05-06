const ws = require("ws");
const port = process.env.PORT || 7000;

const server = new ws.Server({
	port: port,
});

let lastID = 0;
const players = {};

server.on("connection", (conn) => {

	const id = lastID++;

	function broadcast(data) {
		server.clients.forEach((client) => {
			if (client !== conn && client.readyState === ws.OPEN) {
				client.send(JSON.stringify({
					type: data.type,
					data: data.data,
					id: id,
				}));
			}
		});
	}

	for (const id in players) {
		conn.send(JSON.stringify({
			type: "ADD_PLAYER",
			data: players[id],
			id: id,
		}));
	}

	conn.on("message", (data) => {
		const msg = JSON.parse(data);
		switch (msg.type) {
			case "ADD_PLAYER":
				players[id] = msg.data;
				broadcast(msg);
				break;
			case "UPDATE_PLAYER":
				players[id].pos = msg.data.pos;
				broadcast(msg);
				break;
		}
	});

	conn.on("close", (data) => {
		delete players[id];
		broadcast({
			type: "REMOVE_PLAYER",
			data: id,
		});
	});

});

console.log(`ws://localhost:${port}`);
