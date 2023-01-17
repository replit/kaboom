---
title: Improving graphics performance in Kaboom3000
author: tga
date: 01/15/2023
description: Big major release with tons of new features and improvements.
image: 3000.png
---

# Improving graphics performance in Kaboom3000

> tga, 01/15/2023

## Use in-place matrix math

> performance gain: 1.2x

## Getting rid of spread operators

> performance gain: 2x

Kaboom uses a lot of spread operators to forward drawing options to other draw functions, for example

```js
function drawSprite(opts) {
    // doing some calculations above, then forward
    drawTexture({
        ...opts,
        tex: spr.data.tex,
        quad: q.scale(opt.quad || new Quad(0, 0, 1, 1)),
    }))
}
```

However we found spread operators are a huge performance, especially to Kaboom who is using tons of them every frame.

```js
function drawSprite(opts) {
    drawTexture(Object.assign(opt, {
        tex: spr.data.tex,
        quad: q.scale(opt.quad ?? new Quad(0, 0, 1, 1)),
    }))
}
```

## Automatically batch textures

> performance gain: 50x

It's expensive to initiate a draw call (`gl.drawElements()`, `gl.drawArrays()` etc.) in WebGL. Kaboom uses a batched renderer that keeps all shape vertices data in a buffer and only initiates a draw call at frame end or when texture or shader uniform changes. However, texture changes happens a lot, people can use

Consider this example:

```js
kaboom()

loadSprite("bean", "sprites/bean.png")

for (let i = 0; i < 5000; i++) {
	add([
		sprite("bean"),
		pos(rand(0, width()), rand(0, height())),
		anchor("center"),
	])
}
```

It renders 5000 sprites. After

However, if you draw the same amount of sprites but alternate between 2 sprites, this example will crash your browser tab:

```js
kaboom()

loadSprite("bean", "sprites/bean.png")
loadSprite("bag", "sprites/bag.png")

for (let i = 0; i < 5000; i++) {
	add([
		sprite(i % 2 === 0 ? "bean" : "bag"),
		pos(rand(0, width()), rand(0, height())),
		anchor("center"),
	])
}
```

In v3000 Kaboom introduced a machanism to automatically batch all sprites to a large texture atlas when loaded. As a result, the later example have the exact same performance with the former one.

What does this mean? If you aren't already packing your sprites and suffering from bad performance of rendering a lot of sprites, you can enjoy a free performance boost. If you're already packing all your sprites to texture atlas for performance,
