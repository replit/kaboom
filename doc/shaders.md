---
title: Shaders
description: Learn how to write and use custom shaders in Kaboom.
---

# Writing a shader

## Vertex shader

A vertex shader can manipulate data on vertex level. Usually a vertex shader can change any of the vertex's properties, but for kaboom only the position can be altered. In most instances the mesh will be a four point quad, thus the shader is called 4 times, once for each point in the quad.
A default vertex shader would look like this. The function is passed the position, uv coordinate and color of the vertex and needs to return the updated position.

```
vec4 vert(vec2 pos, vec2 uv, vec4 color) {
  return def_vert();
}
```

The default vertex shader returns the primitive's vertex unchanged.
If a modified vertex is to be returned, it should be a 4 dimensional vector with x, y the position of the vertex, z=0 and w=1. Since there is no z-buffer, and the view is orthogonal, z has no effect. The w coordinate is 1 because we are returning a point, not a vector. Vectors can't be moved, therefore their w would be 0 and would not be influenced by the translation part of the matrix.

## Fragment shader

Once the positions of all vertices is determined, the primitive is rasterized. For each pixel drawn, the fragment shader is called. This shader can no longer change the position, but it can affect the color.
A default fragment shader would look like this. 

```
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  return def_frag();
}
```

This default shader mixes the base color and texture colors together.
If an altered color is to be returned, it should be a vec4 containing the r, g, b and a channels as floating point numbers between 0 and 1.
For example, the following shader only uses the texture channel's alpha, while using the base color.

```
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  return vec4(color.rgb, texture2D(tex, uv).a);
}
```

The following shader takes the texture color, grayscales it and then recolors it with the base color.

```
vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
  vec4 tcolor = texture2D(tex, uv);
  float gray = dot(tcolor.rgb, vec3(0.299, 0.587, 0.114));
  return vec4(color.rgb * gray, tcolor.a);
}
```

# Loading a shader

There are two ways to load a shader:
* loadShader takes two strings with the vertex and fragment shader code.
* loadShaderURL takes file URLs for the vertex and fragment shaders.

# Passing data

Without parameters, a shader would be static, or would have to be redefined each frame if some dynamism was expected. Therefore a shader can have parameters which can change every time the scene is rendered. These parameters are called uniforms. Every function passing a shader also has a parameter to pass uniforms to the shader. For example, the following sprite effect defines a function which returns an object with a uniform called u_time. This function is called each frame, and the parameters are sent to the shader before rendering.

```ts
loadShader("invert", null, `
	uniform float u_time;
	
	vec4 frag(vec2 pos, vec2 uv, vec4 color, sampler2D tex) {
		vec4 c = def_frag();
		float t = (sin(u_time * 4.0) + 1.0) / 2.0;
		return mix(c, vec4(1.0 - c.r, 1.0 - c.g, 1.0 - c.b, c.a), t);
	}
`)
	
add([
  sprite("bean"),
  pos(80, 40),
  scale(8),
  // Use the shader with shader() component and pass uniforms
  shader("invert", () => ({
    "u_time": time(),
  })),
])
```

Instead of a function, an object can be passed. This can be used in case the uniforms are not frame dependent. Note though that to replace uniforms set using an object, the function needs to be called once more (in case of usePostEffect) or the component readded (in case of the shader component).
When using the direct draw API, like drawSprite or drawUVQuad, the shader and uniforms are passed through the render properties.

```ts
drawSprite({
  sprite: "bean",
  pos: vec2(100, 200),
  shader: "invert",
  uniforms: {
    "u_time": time(),
  }
})
```

# Multipass shaders

Some shaders, like gaussian blur, need multiple passes in order to work. This can be done by making a framebuffer (makeCanvas), drawing inside this framebuffer (by using the drawon component or Canvas.draw), and using the famebuffer's texture (frameBuffer.tex) to draw a quad (uvquad component or drawUVQuad).

# Learning more about shaders

GLSL has a variety of functions which makes it easier to express your ideas in code. So be sure to look these up.
Here are some resources to get started on writing GLSL shaders.
 * [https://thebookofshaders.com/]
 * [https://www.khronos.org/files/webgl/webgl-reference-card-1_0.pdf]
