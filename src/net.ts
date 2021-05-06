type NetEvent =
	"SYNC_OBJ"
	"CUSTOM"
	;

type NetData = {
	event: NetEvent,
	data: any,
};

type MsgHandler = (data: any) => void;

type NetConf = {
	errHandler?: (err: string) => void,
};

type Net = {
	connected: () => boolean,
	recv: (handler: MsgHandler) => void,
	send: (data: any) => void,
};

function netInit(url: string, gconf: NetConf = {}): Net {

	const socket = new WebSocket(url);
	const handlers: Array<MsgHandler> = [];
	const handleErr = gconf.errHandler ?? console.error;

	socket.onerror = () => {
		handleErr(`failed to connect to ${url}`)
	};

	socket.onmessage = (e) => {
		try {
			const msg = JSON.parse(e.data);
			if (msg.type === "CUSTOM") {
				for (const handler of handlers) {
					handler(msg.data);
				}
			}
		} catch {
			handleErr("failed to parse socket data as JSON");
		}
	};

	function connected(): boolean {
		return socket.readyState === 1;
	}

	function recv(handler: MsgHandler) {
		handlers.push(handler);
	}

	function send(data: any) {
		socket.send(JSON.stringify({
			type: "CUSTOM",
			data: data,
		}));
	}

	return {
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
