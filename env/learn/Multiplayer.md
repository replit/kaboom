# Make a multiplayer game with websockets

`multiplayer.js` sets up a simple websocket server, write the server side logic there.

On the client side can use this code to setup the websocket connection:

```js
const protocol = location.protocol === "https:" ? "wss" : "ws";
const ws = new WebSocket(`${protocol}://${location.host}/multiplayer`);

ws.onmessage = (msg) => {
	console.log(msg);
};

// Learn more at https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API
```
