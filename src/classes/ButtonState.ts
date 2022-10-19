export class ButtonState<T = string> {
    pressed: Set<T> = new Set([])
    pressedRepeat: Set<T> = new Set([])
    released: Set<T> = new Set([])
    down: Set<T> = new Set([])
    update() {
        this.pressed.clear()
        this.released.clear()
        this.pressedRepeat.clear()
    }
    press(btn: T) {
        this.pressed.add(btn)
        this.pressedRepeat.add(btn)
        this.down.add(btn)
    }
    pressRepeat(btn: T) {
        this.pressedRepeat.add(btn)
    }
    release(btn: T) {
        this.down.delete(btn)
        this.pressed.delete(btn)
        this.released.add(btn)
    }
}