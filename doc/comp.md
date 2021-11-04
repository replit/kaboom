# Custom Component

Kaboom uses a flexible component system that helps you compose game logic.

Let's take a look at how the default component `lifespan()` is implemented.

```js
function lifespan(time) {
	let timer = 0;
	return {
		id: "lifespan",
		update() {
			timer -= dt();
			if (timer <= 0) {
				destroy(this);
			}
		},
	};
}
```

Components are just plain functions that returns an object. The return object will contain all the exposed states, methods, and event hooks of the component. In this case, the `lifespan()` component returns and `id`, which is a string which serves as an unique identification of the comp. There's also an `update()`, which is an event hook that'll run every frame. All `this` inside the component functions refer to the game obj it's attached to.

All special fields:
```js
function mycomp() {
	// use closed local variable for internal data
	let data = 123;
	return {
		id: "mycomp",
		// if this comp requires other comps to work
		require: [ "area", "pos", ],
		// runs when the obj is added to scene
		add() {
			debug.log("Hi! This should only be fire once.");
		},
		// runs every frame
		update() {
			// we're using a method from "pos" comp here, so we declare require "pos" above
			this.move(200, 0);
		},
		// runs every frame, after update
		draw() {
			drawLine(this.pos, mousePos());
		},
		// runs when obj is destroyed
		destroy() {
			debug.log("Oh bye");
		},
		// what to display in inspect mode
		inspect() {
			return "some state that deserves to be shown in inspect mode";
		},
	}
}
```

Most kaboom built-in components are built using public interfaces, feel free to check them out. Also check out the "drag", "platformer", "doublejump" demos with their own custom components.

Check out the [component demo](https://kaboomjs.com/play?demo=component).
