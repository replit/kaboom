type Net = {
	connect(): Promise<WebSocket>,
	close(): void,
	connected(): boolean,
	recv(type: string, handler: MsgHandler): void,
	send(type: string, data: any): void,
};

function netInit(url: string): Net {

	const handlers: Record<string, MsgHandler[]> = {};
	const sendQueue: string[] = [];

	let socket: WebSocket | null = null;

	function connected(): boolean {
		return socket !== null && socket.readyState === 1;
	}

	function connect(): Promise<WebSocket> {

		const ws = new WebSocket(url);

		return new Promise<WebSocket>((resolve, reject) => {

			ws.onopen = () => {
				resolve(ws);
				socket = ws;
				for (const msg of sendQueue) {
					ws.send(msg);
				}
			};

			ws.onerror = () => {
				reject(`failed to connect to ${url}`)
			};

			ws.onmessage = (e) => {
				const msg = JSON.parse(e.data);
				if (handlers[msg.type]) {
					for (const handler of handlers[msg.type]) {
						handler(msg.id, msg.data);
					}
				}
			};

		});

	}

	function recv(type: string, handler: MsgHandler) {
		if (!handlers[type]) {
			handlers[type] = [];
		}
		handlers[type].push(handler);
	}

	function send(type: string, data: any) {
		const msg = JSON.stringify({
			type: type,
			data: data,
		});
		if (socket) {
			socket.send(msg);
		} else {
			sendQueue.push(msg)
		}
	}

	function close() {
		if (socket) {
			socket.close();
		}
	}

	return {
		connect,
		close,
		connected,
		recv,
		send,
	};

}

export {
	Net,
	netInit,
};
