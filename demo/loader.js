// Weilding the asset loader

kaboom()

// All loadXXX() functions return a Promise<Data> where you can handle however you want
loadSprite("bean", "/sprites/bean.png").catch((err) => {
	console.error(err)
}).then((data) => {
	console.log(data)
})

add([
	sprite("bean"),
	pos(200)
])

onDraw(() => {

	// Reference "bean" you loaded above
	drawSprite({
		sprite: "bean",
	})

	// You can also pass resource url directly without loadXXX()
	drawSprite({
		pos: vec2(100),
		sprite: "/sprites/bean.png",
	})

})
