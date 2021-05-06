type NetEvent =
	"SYNC_OBJ"
	;

type NetData = {
	event: NetEvent,
	data: any,
};

type MsgHandler = (data: any) => void;

type Net = {
	connected: () => boolean,
	recv: (handler: MsgHandler) => void,
	send: (data: any) => void,
};

function netInit(url: string): Net {

	const socket = new WebSocket(url);
	const handlers: Array<MsgHandler> = [];

	socket.onerror = () => {
		console.error(`failed to connect to ${url}`)
	};

	socket.onmessage = (e) => {
		for (const handler of handlers) {
			handler(e.data);
		}
	};

	function connected(): boolean {
		return socket.readyState === 1;
	}

	function recv(handler: MsgHandler) {
		handlers.push(handler);
	}

	function send(data: any) {
		socket.send(data);
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
