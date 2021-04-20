![logo](misc/kaboom.png)

kaboom.js is a JavaScript library that helps you make games fast and fun!

[website](https://kaboomjs.com/)

### Example

```html
<script src="https://kaboomjs.com/lib/0.3.0/kaboom.js"></script>
<script type="module">

// make kaboom functions global
kaboom.global();

// init kaboom context
init();

// define a scene
scene("main", () => {

	// add a text at position (100, 100)
	add([
		text("ohhimark", 32),
		pos(100, 100),
	]);

});

// start the game
start("main");

</script>
```

paste this directly into an `html` file and start playing around!

### Usage

the recommended way is to [download](https://kaboomjs.com/lib/latest/kaboom.js) a local copy of the library and use it directly, the source should be easy to read and modify (still in progress of documenting the source)

you can also use CDN

```html
<script src="https://kaboomjs.com/lib/@version/kaboom.js"></script>
```

all available version tags can be found in CHANGELOG.md, or github releases

special version tags:
- `dev`: current master with the newest unreleased features / fixes, but not guaranteed to be stable
- `latest`: latest release

the script will expose a `window.kaboom` containing all the kaboom functions, you can either do

```js
kaboom.global();

init();
scene(...);
start(...);
```

to import all kaboom functions to global namespace, or use namespaced kaboom functions to avoid any naming collision

```js
const k = kaboom;

k.init();
k.scene(...);
k.start(...);
```

### Dev

use examples to test / add features

1. `npm run site`
1. go to http://localhost:8000/examples
1. edit examples in `site/pub/examples/`
