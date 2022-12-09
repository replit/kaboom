# Shading sprites with Kaboom

In this tutorial, we'll learn about the Kaboom shader function `loadShader()` and how to change the color of sprites or other game objects.

![shader](shader.png)

You can find the code for this tutorial on [our repl](https://replit.com/@ritza/shade-sprites) or try out the embedded repl below.

## Getting started

Add the following code to your program to initialize a Kaboom context and import the `"bean"` sprite we will be using for the tutorial:

```javascript
import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
```

## Creating a shader

In this section, we'll use the `loadShader()` function to create a new shader and use this shader to invert the colors of the `"bean"` sprite we added.

Add the following code below the `loadSprite()` function:


```javascript
loadShader("invert", null, `
uniform float u_time;

vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	float t = (sin(u_time * 4.0) + 1.0) / 2.0;
	return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), t);
}
`, false)

```

The function takes four arguments: the tag or name of the function (`"invert"` in this case), a vertex position (`null` in this case), the fragment shader, and a boolean to indicate whether the fragment shader is loaded from a file URL. It is false in this case because we've added a custom fragment shader.

For the fragment shader, the line `uniform float u_time` declares the uniform time variable `u_time` which will be used to run keep shading our sprite as long as the program runs. The `frag()` function is used to create a fragment color composed of the vertex position, texture coordinates, vertex color, and texture that it receives as arguments.The `def_frag()` function returns the default fragment color of the sprite that the `frag()` function is being applied to. The `mix()` function returns the ever-changing-color effect as it switches between the default color and the fragment shader color for as  long as the program runs.

The `def_frag()` function returns the default fragment color.

## Adding a shader to an object

Add the following code below the `loadShader()` function to create an object for the `"bean"` sprite:

```
const bean = add([
	sprite("bean"),
	pos(80, 40),
	scale(4),
	shader("invert", {
		"u_time": time(),
	}),
])
```

In the code above, the `pos()` and `scale()` functions are used to set the position and size of the `"bean"` object when the program starts. The `shader()` component is used to apply the shader function `"invert"` to the `"bean"` object. The `time()` function applies the shader function for as long as the program runs.

Add this block of code below the `"bean"` object to keep updating the color of the object in each frame:

```javascript
bean.onUpdate(() => {
	bean.uniform["u_time"] = time()
})

```

If you run the program now, you'll notice the color of the bean object change indefinitely.

## Things to try

Here are some things you can try to learn more about the shader function:

- Apply the shader function to different sprites.
- Create a disco ball using the shader function to alternate the colors of the ball and the background.

Try out the embedded repl below:
<iframe frameborder="0" width="100%" height="500px" src="https://replit.com/@ritza/shade-sprites?embed=true"></iframe>
