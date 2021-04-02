# 0.1.0
- changed default origin point to `"topleft"`, so if you want object origin point to be at center you'll need to manual `origin("center")`
- integrated `kit/physics` and `kit/level` to main lib
- added an arg field to `start(scene, ...)` to forward args to start scene
- makes `collides()` only run on first collision, not run every frame during the same collision
- `camPos()` by default focuses to center, so `camPos(player.pos)` puts player in the center of the screen
- added `camScale()`, `camRot()` and `camIgnore()`
- added `obj.overlaps()` by `area()`, and `overlaps()`
- renamed `kaboom.import()` to `kaboom.global()`
