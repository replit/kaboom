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

```sh
# lib
$ npm run demo

# doc
$ npm run site
```

