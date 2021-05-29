const ws = require("ws");
const port = process.env.PORT || 7000;

const server = new ws.Server({
	port: port,
});

let lastID = 0;
const objs = {};

server.on("connection", (conn) => {

	const id = lastID++;

	objs[id] = {};

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

	for (const id in objs) {
		for (const oid in objs[id]) {
			conn.send(JSON.stringify({
				type: "ADD_OBJ",
				data: objs[id][oid],
				id: id,
			}));
		}
	}

	conn.on("message", (data) => {
		const msg = JSON.parse(data);
		broadcast(msg);
		switch (msg.type) {
			case "ADD_OBJ":
				objs[id][msg.data.id] = msg.data;
				break;
			case "UPDATE_OBJ":
				objs[id][msg.data.id] = msg.data;
				break;
		}
	});

	conn.on("close", (data) => {
		broadcast({
			type: "DISCONNECT",
			data: id,
		});
		delete objs[id];
	});

});

console.log(`ws://localhost:${port}`);

