// Custom RPG-like camera entity
// Start a kaboom game with inpect on
kaboom().debug.inspect = true;

// Load assets
loadSprite("coin", "/sprites/coin.png");
loadSprite("grass", "/sprites/grass.png");

// Setup a basic level
const level = addLevel(["   =  $", "======="], {
  width: 64,
  height: 64,
  pos: vec2(340, 600),
  "=": () => [sprite("grass"), area(), solid(), origin("bot")],
  $: () => [sprite("coin"), area(), origin("bot"), "coin"],
});

// Creating our camera entity
const camera = add([
  pos(window.innerWidth / 2, window.innerHeight / 2),
  layer("bg"),
  area({ width: 30, height: 30 }),
  origin("center"),
  "camera",
  { mouseDownX: 0, mouseDownY: 0 },
]);

// Save starting click point
onMousePress((pos) => {
  camera.mouseDownX = pos.x;
  camera.mouseDownY = pos.y;
});

// Move kaboom camera calculating offsets
onMouseMove((pos) => {
  // Calculate offsets only if mouse left is pressed
  if (isMouseDown("left")) {
    const movementX = pos.x - camera.mouseDownX;
    const movementY = pos.y - camera.mouseDownY;
    const offsetX = camera.pos.x - movementX;
    const offsetY = camera.pos.y - movementY;
    camPos(offsetX, offsetY);
  }
});

// Move camera entity with offsets after mouse release
onMouseRelease(() => {
  const pos = mousePos();
  const movementX = pos.x - camera.mouseDownX;
  const movementY = pos.y - camera.mouseDownY;
  const offsetX = camera.pos.x - movementX;
  const offsetY = camera.pos.y - movementY;
  camera.moveTo(vec2(offsetX, offsetY));
});
