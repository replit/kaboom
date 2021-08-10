### Welcome to kaboom!

This is a place where you can make games, with JavaScript and [Kaboom.js](https://kaboomjs.com/).

This is an intro tutorial that will cover basic concepts of kaboom and make a very simple game in the end.

```js
addSprite("mark");
```

Paste this code to the editor and see what happens!

Unless something goes horribly wrong, you should see a smily face at the top left corner.

```js
const mark = addSprite("mark", { pos: vec2(100, 100) });

mark.action(() => {
  mark.move(10, 0);
});
```
