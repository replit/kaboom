const ws = require("ws");

module.exports = (server) => {

	const socket = new ws.Server({ server: server, path: "/multiplayer" });

	socket.on("connection", (conn) => {

		function broadcast(data) {
			socket.clients.forEach((client) => {
				if (client !== conn && client.readyState === ws.OPEN) {
					client.send(data);
				}
			});
		}

		conn.on("message", (data) => {
			// ...
		});

		conn.on("close", (data) => {
			// ...
		});

		conn.send("oh hi");

	});

};
