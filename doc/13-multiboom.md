# Multiboom with Kaboom

Multiboom is a fun Kaboom feature that lets you play with Kaboom by creating two Kaboom contexts on one page. 

In this tutorial, we'll use Multiboom to create two similar contexts consisting of two sprites with a spin-and-scale effect. You can find the code we use in [our repl](https://replit.com/@ritza/multiboom).

![multiboom](tutorials/multiboom.png)

# Getting started with the code

The first thing we want to do is load the `kaboom()` library and initialize a Kaboom context:

```javascript
import kaboom from "kaboom";

kaboom()
```

Next, we'll create a list of the background colors of each context:

```javascript
const backgrounds = [
    [255, 0, 255],
    [0, 0, 255],
]

```

Using a for loop, we're going to generate a new context in each iteration to avoid writing repetitive code for each. The rest of the code for this program will be placed inside this loop.

We'll create an object, "k", that will represent a single context's attributes: the background color, width, and height.

```javascript
for (let i = 0; i < 2; i++) {

    const k = kaboom({
        background: backgrounds[i],
        global: false,
        width: 320,
        height: 320,
    })
```

Now let's load our sprite onto each context:

```javascript
    k.loadBean()
```

Create a `spin()` function to animate the sprite so it keeps spinning while our program is running:

```javascript
    function spin() {
        return {
            id: "spin",
            update() {
                this.scale = Math.sin(k.time() + i) * 9
                this.angle = k.time() * 60
            },
        }
    }
```

Now we can add our sprite to each context:

```javascript
    k.add([
        k.sprite("bean"),
        k.pos(k.width() / 2, k.height() / 2),
        k.scale(6),
        k.rotate(0),
        spin(),
        k.origin("center"),
    ])

```
Lastly, we want to add a numbering system to represent the different contexts generated:

```javascript
    k.add([
        k.text(`#${i}`),
    ])

}
```

### Components

* `rotate()` - used to change the angle of a game object
* `origin()` - origin for rendering our objects

# Things to try

Here are some challenges to try to out on your own:
- Add more frames to the screen.
- Generate a random background color for each frame.

You can find the code for this tutorial here:

<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/multiboom?embed=true"></iframe>
