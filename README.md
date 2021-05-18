![Kaboom Logo](misc/kaboom.png)

Kaboom.js is a JavaScript library that helps you make games fast and fun!

Check out our official [website](https://kaboomjs.com/)!

## Example

```html
<script src="https://kaboomjs.com/lib/0.5.1/kaboom.js"></script>
<script type="module">

// initialize kaboom context
const k = kaboom();

// define a scene
k.scene("main", () => {

	// add a text at position (100, 100)
	k.add([
		k.text("ohhimark", 32),
		k.pos(100, 100),
	]);

});

// start the game
k.start("main");

</script>
```

You can paste this directly into an `html` file and start playing around!

## Usage

### cdn

1. self hosted

```html
<script src="https://kaboomjs.com/lib/0.5.1/kaboom.js"></script>
```

All available version tags can be found in CHANGELOG.md, or Github releases.

Special Version Tags:
- `dev`: current master with the newest unreleased features / fixes, but not guaranteed to be stable
- `latest`: latest release

2. third party

kaboom is on npm thus supported by most js lib CDN providers

```html
<script src="https://unpkg.com/kaboom@0.5.1/dist/kaboom.js"></script>
<script src="https://cdn.jsdelivr.net/npm/kaboom@0.5.0/dist/kaboom.js"></script>
```

When imported in browser, the script will expose a global `kaboom` function to initialize a kaboom context, returning an object containing all the functions

```js
const k = kaboom();

k.init();
k.scene(...);
k.start(...);
```

You can also import all functions to global namespace by giving a `global` flag

```js
kaboom({
	global: true,
});

init();
scene(...);
start(...);
```

Kaboom also provide ES module and commonJS module exports with `.mjs` and `.cjs`, e.g,

```js
import kaboom from "https://kaboomjs.com/lib/0.5.1/kaboom.mjs";
```

### npm package

```
$ npm install kaboom
```

```ts
// main.ts
import kaboom, { Vec2, GameObj, } from "kaboom";
import asepritePlugin from "kaboom/plugins/aseprite";

const k = kaboom({
	plugins: [ asepritePlugin, ],
});

function spawnBullet(p: Vec2): GameObj {
	return k.add([
		k.pos(p),
		k.sprite("bullet"),
	]);
}
```

also works with cjs

```js
const kaboom = require("kaboom");
```

## Dev

1. `npm run dev` to watch & build lib
1. go to http://localhost:8000/examples
1. edit examples in `examples/` to test
1. make sure not breaking any existing examples

### Misc

- Featured on [Console 50](https://console.substack.com/p/console-50)
- Shoutout to [Umayr](https://github.com/umayr) for kindly offering the "kaboom" npm package name
