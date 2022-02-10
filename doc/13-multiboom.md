# Multiboom with kaboom

Multiboom is a fun kaboom feature that lets us play with kaboom by creating two kaboom contexts on one page. 

In this tutorial, we'll use multiboom to create two similar contexts consisting of two sprites with a spin and scale effect.
You can find the code we use in this tutorial at [https://replit.com/@ritza/multiboom](https://replit.com/@ritza/multiboom)

![multiboom](multiboom.png)

# Getting started with the code

The first thing we want to do is load the kaboom() library and initialize a Kaboom context.

```
import kaboom from "kaboom";

kaboom()
```

Next, we'll start creating a list of the background colors of each context.

```
const backgrounds = [
    [255, 0, 255],
    [0, 0, 255],
]

```


Using a for loop, we're going to generate a new context in each iteration to avoid writing repetitive code for each.
The rest of the code for this program will be placed inside the loop.

We'll create an object "k" which will represent a single context's attributes, i.e the background color, width, and height.

```
for (let i = 0; i < 2; i++) {

    const k = kaboom({
        background: backgrounds[i],
        global: false,
        width: 320,
        height: 320,
    })
```

Next, we'll load our sprite onto each context 

```
    k.loadBean()
```

Let's create a "spin()" function to animate the sprite so it keeps spinning while our program is running.

```
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

Mow we'll add our sprite to each context.

```
    k.add([
        k.sprite("bean"),
        k.pos(k.width() / 2, k.height() / 2),
        k.scale(6),
        k.rotate(0),
        spin(),
        k.origin("center"),
    ])

```
Lastly, we want to add a numbering system to represent the different contexts generated.

```
    k.add([
        k.text(`#${i}`),
    ])

}
```

### Components

* rotate() - used to change the angle of a game object
* origin() - origin for rendering our objects

# Things to try

Here are some challenges to try to out on your own:
- add more frames to the screen
- generate a random background color for each frame 

