# Shader with Kaboom

In this tutorial, we'll be learning about the kaboom shader function `loadShader()` and how to change the color shades of sprites or other game objects.

![shader](shader.png)

You can find the code for this tutorial on [Replit](https://replit.com/@ritza/shader-1) or try out the embedded repl below.

## Getting started

Add the following code to your program to initialize a kaboom context and import the "bean" sprite that we will be using for the tutorial:

```javascript
import kaboom from "kaboom"

kaboom()

loadSprite("bean", "/sprites/bean.png")
```

## Creating a shader

In this section, we'll use the `loadShader()` function to create a new shader and use this shader to invert the colors of the "bean" sprite we added earlier in the tutorial.

Add the following code below the `loadSprite()` function:


```javascript
loadShader("invert", null, `
uniform float u_time;

vec4 frag(vec3 pos, vec2 uv, vec4 color, sampler2D tex) {
	vec4 c = def_frag();
	float t = (sin(u_time * 4.0) + 1.0) / 2.0;
	return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), t);
}
`)

```
In the code above, we added a custom shader function to our program with the name/tag "invert". The function takes 3 arguments: the tag or name of the function; a vertex position that is null in this case; the fragment shader; and a boolean that highlights whether the color is a URL, in this case, it's false.

For the fragment shader, the line `uniform float u_time` declares the uniform time variable `u_time` which will be used to run keep shading our sprite as long as the program runs. The `frag()` function is used to create a fragment color composed of the vertex position, texture coordinates, vertex color, and texture that it receives as arguments.The `def_frag()` function returns the default fragment color.


## Adding a shader to an object

Add the folwing code below the `loadShader()` to create an object for the "bean" sprite:

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

In the code above, the `pos()` and `scale()` functions are used to set the position and size of the "bean" object respectively when the program starts. The `shader()` component is used to apply the shader function "invert" to the "bean" object. The `time()` function applies the shader function for as long as the program runs.

Add this last block of code below the "bean" object to keep updating the color of the object in each frame:
```javascript
bean.onUpdate(() => {
	bean.uniform["u_time"] = time()
})

```
If you run the program, you'll notice the color of the bean object change indefinitely.

### Things to try

Here are some things to try to learn more about the shader function:

- apply the shader function to different sprites
- create a disco ball using the shader function to alternate the colors the color of the ball and the background.

Try out the embedded repl below:
<iframe height="400px" width="100%" src="https://replit.com/@ritza/shader-1?embed=true" scrolling="no" frameborder="no" allowtransparency="true" allowfullscreen="true" sandbox="allow-forms allow-pointer-lock allow-popups allow-same-origin allow-scripts allow-modals"></iframe>