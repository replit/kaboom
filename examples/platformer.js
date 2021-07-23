kaboom({
    global: true,
    fullscreen: true,
    scale: 2,
    clearColor: [0, 0, 0, 1],
});

loadRoot("/pub/examples/");

// See: https://kenney.nl/assets/bit-platformer-pack
loadSprite('tiles', './tilemaps/bit-platformer.png', {
    sliceX: 20,
    sliceY: 20,
    anims: {
        idle: {from: 300, to: 300},
        run: {from: 301, to: 302}
    }
})

// define some constants
const JUMP_FORCE = 320;
const MOVE_SPEED = 120;

TILE_W = 16;
TILE_H = 16;

// add level to scene
addLevel([
    '                                       ',
    '                                       ',
    '                                %      ',
    '                                       ',
    '                         ====          ',
    '                                       ',
    '                 ====                  ',
    '                                       ',
    '         ====                          ',
    '                                       ',
    '     >                             <   ',
    '======================================='
], {
    width: TILE_W,
    height: TILE_H,
    '=': [
        sprite('tiles', {
            frame: 65
        }),
        solid()
    ],
    '<': [
        sprite('tiles', {
            frame: 92
        })
    ],
    '>': [
        sprite('tiles', {
            frame: 93
        })
    ],
    '%': [
        sprite('tiles', {
            frame: 96
        }),
        solid()
    ],
});

// define player object
const player = add([
    sprite('tiles', {
        animSpeed: 0.05,
        frame: 300
    }),
    pos(TILE_W * 3, 0),
    origin('center'),
    scale(1),
    body()
]);

// action() runs every frame
player.action(() => {
});

// jump with space
keyPress("space", () => {
    // these 2 functions are provided by body() component
    if (player.grounded()) {
        player.jump(JUMP_FORCE);
    }
});

// basic key press logic to change animations
keyPress('left', () => {
    player.scale.x = -1
    player.play('run')
    player.move(-MOVE_SPEED, 0);
})

keyPress('right', () => {
    player.scale.x = 1
    player.play('run')
    player.move(MOVE_SPEED, 0);
})

keyRelease('left', () => {
    player.play('idle')
})

keyRelease('right', () => {
    player.play('idle')
})
