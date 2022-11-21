kaboom()

loadSprite("bean", "/sprites/bean.png")
const player = add([sprite("bean"), area(), pos(center()), "player"])

player.onClick(() => {
  debug.log("clicked!")
})

onClick("player", () => {
  debug.log("clicked!")
})
