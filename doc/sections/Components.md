Kaboom uses a flexible component system which values composition over inheritence. Each game object is composed from a list of components, each component gives the game object certain capabilities.

Use `add()` to assemble the components together into a Game Object and add them to the world.

```js
const player = add([
	sprite("froggy"),
	pos(100, 200),
	area(),
	body(),
])

// .jump() is provided by body() component
player.jump()

// .moveTo() is provided by pos() component
player.moveTo(120, 80)

// .onCollide() is provided by the area() component
player.onCollide("enemy", (enemy) => {
	destroy(enemy)
	addExplosion()
})
```

To see what methods and properties a component offers, click on the type that the component function returns, e.g. `PosComp`, which will open a panel showing all the properties and methods it'd give the game object.

To learn more about how components work or how to make your own component, check out the [component](/play?demo=component) demo.
