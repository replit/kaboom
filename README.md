![logo](misc/kaboom.png)

kaboom.js is a JavaScript library that helps you make games fast and fun!

[doc](https://kaboomjs.com/)

### Example

```html
<script src="https://kaboomjs.com/lib/dev/kaboom.js"></script>
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

### Dev

use examples to test / add features

1. `npm run site`
1. go to http://localhost:8000/examples
1. edit examples in `site/pub/examples/`
