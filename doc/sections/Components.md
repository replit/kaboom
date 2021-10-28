Kaboom uses a flexible component system which values composition over inheritence. Each game object is composed from a list of components, each component gives the game object certain abilities.

For example,

- `sprite()` component gives the object the ability to render as a sprite and controlling animations.
- `pos()` component gives the object a position in world and the ability to move.
- `area()` component gives the object the ability to check for collisions with other game objects with `area()` component.
- `body()` component gives the ability.

These components are typically used with `add()` to assemble them together into a Game Object and add them to the world.

```js
const player = add([
	sprite("froggy"),
	pos(100, 200),
	area(),
	body(),
])

// a method provided by body() component
player.jump()

// a method provided by the pos() component
player.moveTo(123)
```

To check out what methods and properties the component gives the Game Object, click on the type that the component function returns, e.g. `PosComp`, which will open a panel showing what it gives.
