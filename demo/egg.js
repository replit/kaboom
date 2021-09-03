// Egg minigames (yes, like Peppa)

kaboom();

loadSprite("bean", "sprites/bean2.png", {
    sliceX: 4,
    anims: {
        idle: {
            from: 0,
            to: 0,
        },
        put: {
            from: 3,
            to: 3,
        },
    },
});

loadSprite("newbean", "sprites/bean.png")
loadSprite("egg", "sprites/egg.png");

const player = add([
    sprite("bean"),
    pos(width() / 2, height() / 2),
    area(),
    scale(2),
    origin("center"),
]);

const counter = add([
    text("0", { size: 50 }),
    {
        value: 0
    }
]);

keyPress("space", () => {
    player.moveTo(rand(0, width()), rand(0, height()));

    add([
        sprite("egg"),
        pos(player.pos.x + rand(-10, 10), player.pos.y + rand(-10, 10)),
        scale(1),
        origin("center"),
        "egg"
    ]);

    counter.value += 1;
    counter.text = counter.value;

    readd(player);
    readd(counter);

    player.play("put");
    wait(0.5, () => player.play("idle"));
});

keyPress("enter", () => {
    // All eggs to bean
  
    every("egg", (e) => {
        e.use(sprite("newbean"));
    });
});
