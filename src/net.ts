type MsgHandler = (data: any, id: number) => void;

type NetConf = {
	errHandler?: (err: string) => void,
};

type Net = {
	connect: () => void,
	connected: () => boolean,
	recv: (type: string, handler: MsgHandler) => void,
	send: (type: string, data: any) => void,
};

function netInit(url: string, gconf: NetConf = {}): Net {

	const handlers: Record<string, MsgHandler[]> = {};
	const sendQueue: string[] = [];
	const handleErr = gconf.errHandler ?? console.error;

	let socket: WebSocket | null = null;

	function connected(): boolean {
		return socket !== null && socket.readyState === 1;
	}

	function connect() {

		socket = new WebSocket(url);

		socket.onopen = () => {
			for (const msg of sendQueue) {
				socket.send(msg);
			}
		};

		socket.onerror = () => {
			handleErr(`failed to connect to ${url}`)
		};

		socket.onmessage = (e) => {
			const msg = JSON.parse(e.data);
			if (handlers[msg.type]) {
				for (const handler of handlers[msg.type]) {
					try {
						handler(msg.data, msg.id);
					} catch (e) {
						handleErr(e);
					}
				}
			}
		};

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

	return {
		connect,
		connected,
		recv,
		send,
	};

}

export {
	MsgHandler,
	Net,
	netInit,
};
