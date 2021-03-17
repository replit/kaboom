![logo](misc/kaboom.png)

kaboom.js is a JavaScript library that helps you make games fast and fun!

[doc](https://kaboomjs.com/)

### Example

```js
const k = kaboom;
k.init();

k.scene("main", () => {
	k.add([
		k.pos(0, 0),
		k.text("oh hi", 24),
	]);
});

k.start("main");
```

### Usage

1. download `kaboom.js` and

```html
<script src="kaboom.js"></script>
```

2. use CDN

```html
<!-- TODO -->
```

### Dev

use examples to test / add features

1. `npm run site`
1. go to http://localhost:8000/examples
1. edit examples in `site/pub/examples/`

