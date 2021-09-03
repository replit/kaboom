![Kaboom Logo](kaboom.png)

[**Kaboom.js**](https://kaboomjs.com/) is a JavaScript library that helps you make games fast and fun!

**NOTE**: still in early active development, expect breaking changes and lots of new features (check out `CHANGELOG.md` for these).

## Examples

(these are for the newest beta version or `kaboom@next`)

Lots of iteractive examples [here](https://kaboomjs.com/examples)

```html
<script type="module">

// import kaboom lib
import kaboom from "https://cdn.skypack.dev/kaboom@next";

// initialize kaboom context
kaboom();

// load the default sprite "bean"
loadBean();

// add a game obj to screen, from a list of components
const froggy = add([
    sprite("bean", 32),
    pos(120, 80),
    area(),
    body(),
]);

// jump when user presses "space"
keyPress("space", () => {
    froggy.jump();
});

</script>
```
You can paste this directly into an `.html` file and start playing around!

Kaboom uses a powerful component system to compose game objects and behaviors.
To make a flappy bird movement you only need a few lines
```js
// init context
kaboom();

// load a default sprite "bean"
loadBean();

// compose the player game object from multiple built-in components
const bean = add([
    sprite("bean"),
    pos(80, 40),
    area(),
    body(),
]);

// press space to jump (jump behavior is provided by "body" component)
keyPress("space", () => birdy.jump());
```

It's easy to make custom components to compose your game object behaviors:
```js
// add an entity to the scene, with a list of component describing its behavior
const player = add([
    // it renders as a sprite
    sprite("mark"),
    // it has a position
    pos(100, 200),
    // it has a collider
    area(),
    // it is a physical body which will respond to physics
    body(),
    // you can easily make custom components to encapsulate reusable logics
    doubleJump(),
    health(8),
    // or give it tags for controlling group behaviors
    "player",
    "friendly",
    // plain objects fields are directly assigned to the game obj
    {
        dir: vec2(-1, 0),
        dead: false,
        speed: 240,
    },
]);

// custom components are plain functions that return an object
function health(hp) {
    return {
        // comp id
        id: "health",
        // comp dependencies
        require: [],
        // custom behaviors
        hurt(n) {
            hp -= n ?? 1;
            this.trigger("hurt");
            if (hp <= 0) {
                this.trigger("death");
            }
        },
        heal(n) {
            hp += n ?? 1;
            this.trigger("heal");
        },
        hp() {
            return hp;
        },
    };
}

// listen to custom events from a custom component
player.on("hurt", () => { ... });

// blocky imperative logic
player.collides("enemy", () => player.hurt(1));
```

Blocky imperative syntax for describing behaviors
```js
// check fall death
player.action(() => {
    if (player.pos.y >= height()) {
        destroy(player);
        gameOver();
    }
});

// if 'player' collides with any object with tag "enemy", run the callback
player.collides("enemy", () => {
    player.hp -= 1;
});

// all objects with tag "enemy" will move towards 'player' every frame
action("enemy", (e) => {
    e.move(player.pos.sub(e.pos).unit().scale(e.speed));
});

keyPress("w", () => {
    player.move(vec2(0, 100)),
});
```

If you don't feel like using kaboom's abstraction systems, can use kaboom like a p5.js or love2d with immediate mode APIs

```js
kaboom();

// runs every frame
action(() => {
    // checks if is pressed last frame only
    if (keyIsPressed("space")) {
        doSomeThing();
    }
});

// runs every frame after update
render(() => {
    // immediate drawing functions
    drawSprite("birdy");
    drawText("123abc");
    drawRect(100, 300);
});
```

## Usage

### Browser CDN

Beta release (published frequently)
```html
<script src="https://unpkg.com/kaboom@next/dist/kaboom.js"></script>
```

Latest release
```html
<script src="https://unpkg.com/kaboom@latest/dist/kaboom.js"></script>
```

Also works with other CDNs like `jsdelivr` who works with NPM packages.

Kaboom also provide ES module and commonJS module exports with `.mjs` and `.cjs`, e.g,

```js
// any one of these work
import kaboom from "https://cdn.skypack.dev/kaboom@next";
import kaboom from "https://unpkg.com/kaboom@next/dist/kaboom.mjs";
import kaboom from "https://cdn.jsdelivr.net/npm/kaboom@next/dist/kaboom.mjs";
```

### NPM Package

```sh
$ npm install kaboom@next
```

```ts
// main.ts
import kaboom, { Vec2, GameObj, } from "kaboom";

// currently you'll have to use the handle to get auto complete / type checks etc.
const k = kaboom();

function spawnBullet(p: Vec2): GameObj {
    return k.add([
        k.pos(p),
        k.sprite("bullet"),
        k.area(),
    ]);
}
```

also works with cjs

```js
const kaboom = require("kaboom");
```

## Dev

1. `npm run setup` to setup first time (installing dev packages)
1. `npm run dev` to watch & build lib
1. go to http://localhost:8000/examples
1. edit examples in `examples/` to test
1. make sure not to break any existing examples

## Community

[Github Discussions](https://github.com/replit/kaboom/discussions)

### Misc

- Thanks to Polyducks for the amazing [kitchen sink](https://polyducks.itch.io/kitchen-sink-textmode-font) font
- Find bitmap fonts: [Oldschool PC Font](https://int10h.org/oldschool-pc-fonts)
- Featured on [Console 50](https://console.substack.com/p/console-50)
- Thanks to [Umayr](https://github.com/umayr) for kindly offering the "kaboom" npm package name
