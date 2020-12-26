## v0.2.0

- changed

```js
scene("game");
// "game" scene stuff
```
to

```js
scene("game", () => {
	// "game" scene stuff
});
```
- removed `ready()` (unnecessary due to the `scene()` change)
- renamed `sup()` to `action()`
- renamed `huh()` to `click()`

