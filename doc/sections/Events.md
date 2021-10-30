Kaboom uses events extensively for a flat and declarative code style.

For example, it's most common for a game to have something run every frame which can be achieved by adding an `onUpdate()` event

```js
// Make something always move to the right
onUpdate(() => {
	banana.move(320, 0)
})
```

Events are also used for input handlers.

```js
onKeyPress("space", () => {
	player.jump()
})
```

Every function with the `on` prefix is an event register function that takes a callback function as the last argument, and should return a function that cancels the event listener.

Note that you should never nest one event handler function inside another or it might cause severe performance punishment.
