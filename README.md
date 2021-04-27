![Kaboom Logo](misc/kaboom.png)

Kaboom.js is a JavaScript library that helps you make games fast and fun!

Check out our official [website](https://kaboomjs.com/)!

### Example

```html
<script src="https://kaboomjs.com/lib/0.4.1/kaboom.js"></script>
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

### Usage

We recommend [downloading](https://kaboomjs.com/lib/latest/kaboom.js) the script and use it directly, the source should be easy to read and modify (documentation is still in progress).

You can also use CDN

```html
<script src="https://kaboomjs.com/lib/@version/kaboom.js"></script>
```

All available version tags can be found in CHANGELOG.md, or Github releases.

Special Version Tags:
- `dev`: current master with the newest unreleased features / fixes, but not guaranteed to be stable
- `latest`: latest release

The script will expose a `window.kaboom` function to initialize a kaboom context, returning an object containing

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

However, it is possible to use a module version of kaboomjs.

```html
<script type="module" src="script.js"></script>
```

`script.js`:
```js
import kaboom from "https://kaboomjs.com/lib/0.4.1/kaboom.mjs";

const k = kaboom();

k.init();
k.scene(...);
k.start(...);

```

Using the module version means that there will be no `window.kaboom` available and kaboom must be imported.

### Dev

Use examples to test / add features

1. `npm run dev`
1. go to http://localhost:8000/examples
1. edit examples in `examples/`

### Misc

Featured on [Console 50](https://console.substack.com/p/console-50)
