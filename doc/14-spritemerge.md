# Merging Sprites with kaboom

Kaboom is a fun library to use for creating simple games.

In this tutorial, we are going to learn how to merge two different sprite images into one. This could be useful for games in which you would like your player character to have some cool features, like an armory or new clothing.


## Steps to follow 

We'll cover how to add the following:

* Merge function
* Sprites
* Animation

You can find the code we use in this tutorial at https://replit.com/@ritza/sprite-merge or try out the embedded repl below.

![sprite merge](spritemerge.png)

## Getting started with the code

The first thing we want to do is set up our game by loading the kaboom() library.

```javascript
import kaboom from "kaboom";
```

Before we initialize a kaboom context, we'll first create a merge function for our sprites.

## Merge Function

Let's create a function `mergeImg()`, that takes the URLs of the sprites we want to merge as an argument and returns a merged image. 

```javascript
function mergeImg(urls) {
    let promises = [];
    for (let url of urls) {
        const img = new Image();
        img.src = url;
        img.crossOrigin = "anonymous";
        promises.push(new Promise((resolve, reject) => {
            img.onload = () => {
                resolve(img);
            };
            img.onerror = () => {
                reject(`failed to load ${url}`);
            };
        }));
    }
    return new Promise((resolve, reject) => {
        Promise.all(promises).then((images) => {
            const canvas = document.createElement("canvas");

            const width = images[0].width;
            const height = images[0].height;
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (ctx) {
                images.forEach((img, i) => {
                    if (img.width === width && img.height === height) {
                        ctx.drawImage(img, 0, 0);
                    }
                });
                resolve(ctx.getImageData(0, 0, width, height));
            } else {
                reject();
            }
        }).catch((error) => reject(error));
    })
}
```

Now we'll initialize a kaboom context and set up the scale and font of our game.

```javascript
kaboom({
    scale: 2,
    font: "sinko",
})

```

Let's create an animation object `anims` which will animate our sprites so they move in place.

```javascript
const anims = {
    x: 0, 
    y: 0, 
    height: 1344, 
    width: 832, 
    sliceX: 13, 
    sliceY: 21,
    anims: {
        'walk-up': {from: 104, to: 112}, 
        'walk-left': {from: 117, to: 125}, 
        'walk-down': {from: 130, to: 138}, 
        'walk-right': {from: 143, to: 151}, 
        'idle-up': {from: 104, to: 104}, 
        'idle-left': {from: 117, to: 117}, 
        'idle-down': {from: 130, to: 130}, 
        'idle-right': {from: 143, to: 143}, 
    }
}

```
Next, we'll add 3 more objects to represent our sprites and the merged sprites. These objects will have the same animation properties we've provided for the 'anims' object. 

```javascript
const playerAnims = {
    player: anims
};

const chestAnims = {
    chest: anims
};

const corpusAnims = {
    corpus: anims
};
```


## Adding Sprites

Let's load our sprites onto kaboom.
Let's load our sprites onto kaboom. We'll load two of the sprites to the sprite objects 'chestAnims' and 'corpusAnims' that we created.

```javascript
loadSpriteAtlas("/sprites/spritemerge_chest.png", chestAnims)
loadSpriteAtlas("/sprites/spritemerge_corpus.png", corpusAnims)
```

For the last object 'playerAnims', we'll merge the two other sprites using our function `mergeImg()` into one sprite.

```javascript
mergeImg(["sprites/spritemerge_corpus.png", "/sprites/spritemerge_chest.png"]).then((img) =>
    loadSpriteAtlas(img, playerAnims)
);
```

We'll add some functionality to our objects to position them on the game screen. The `gravity()` function makes sure the objects will not be drawn to the edge of the screen. `body()` gives our objects a "body" that reacts to the game's gravity. The `area()` makes our objects solid so no other objects can pass through them. `pos()` and `origin()` provide our objects with an origin position each time the game is initiated.

```javascript

let DIRECTION = 'down';
gravity(0)

const player = add([
    sprite('player'),
    pos(center()),
    origin("center"),
    area(),
    body()
])


const corpus = add([
    sprite('corpus'),
    pos(center().add(-128, 0)),
    origin("center"),
    area(),
    body()
])


const chest = add([
    sprite('chest'),
    pos(center().add(128, 0)),
    origin("center"),
    area(),
    body()
])
```

## Adding Animation

Now, we'll focus on the animation of our sprites. We'll use the `play()` function provided by the `sprite()` component to display the specified animations.

```javascript
player.play("idle-down")
chest.play("idle-down")
corpus.play("idle-down")
```
Here we'll set up the direction keys on our keyboard to control the directional movement of our objects,  we'll implement this using the `switchAnimation()` function.

```javascript
onKeyDown('left', () => {
    DIRECTION = 'left';
    switchAnimation('walk');
})
onKeyDown('right', () => {
    DIRECTION = 'right';
    switchAnimation('walk');
})
onKeyDown('down', () => {
    DIRECTION = 'down';
    switchAnimation('walk');
})
onKeyDown('up', () => {
    DIRECTION = 'up';
    switchAnimation('walk');
})
onKeyRelease(['left', 'right', 'down', 'up'], () => {
    switchAnimation('idle');
})
```
Using a loop, we'll make it so that our game objects continue to move in the direction for which a key is pressed, else
they will stop moving, and 'switchAnimation' to 'idle'.

```javascript
function switchAnimation(type) {
    if (player.curAnim() !== type+'-'+DIRECTION) {
        player.play(type+'-'+DIRECTION, {loop: true});
        chest.play(type+'-'+DIRECTION, {loop: true});
        corpus.play(type+'-'+DIRECTION, {loop: true});
    }
}
```

Let's add some text to the screen to represent our objects' current state.
We'll create the `getInfo()` function to hold the information about our objects' current animation as well as the frame number of their current stance.

```javascript
const getInfo = () => `
Anim: ${player.curAnim()}
Frame: ${player.frame}
`.trim()
```

The `label` object will be used to render `getInfo()` onto the screen and we'll use the `onUpdate()` function so it updates the text each time our objects change frames or direction.
```
const label = add([
    text(getInfo()),
    pos(4),
])

label.onUpdate(() => {
    label.text = getInfo()
})

```

## Things to try:

You can visit https://kaboomjs.com/ to learn more about the Kaboom library.

Here are some suggestions on how to enhance the game:

* Add more armory/clothing sprites to merge with the player.
* Add a platform and some levels to the game so the player has quests and can discover a new armor in each level. 

You can also try out the repl below:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/demo-embed?embed=true"></iframe>
