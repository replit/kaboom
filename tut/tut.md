Welcome! Kaboom is a JavaScript library that helps you make games fast and fun :D

Let's get started by initializing the context with the `kaboom()` function.

```js
kaboom()
```

This should give you a blank 640x480 canvas with a nice checkboard pattern.

This will be our game canvas! Everything about our game will happen in this box.

By default `kaboom()` will return a handle that contains all the functions we use for our game like

```js
const k = kaboom()

// all kaboom functions are under this `k` context handle
k.add(...)
k.action(...)
k.keyPress(...)
```

but we can also pass a `global` flag on initialization to make every kaboom function global

```js
kaboom({
    global: true,
})

// we don't need to use the context prefix
add(...)
keyPress(...)
action(...)
```
