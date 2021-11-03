By default kaboom starts in debug mode, which enables key bindings that calls out various debug utilities:

- `f1` to toggle inspect mode
- `f5` to take screenshot
- `f6` to toggle recording
- `f7` to slow down
- `f8` to pause / resume
- `f9` to speed up
- `f10` to skip frame

Some of these can be also controlled with stuff under the `debug` object.

If you want to turn debug mode off when releasing you game, set `debug` option to false in `kaboom()`
