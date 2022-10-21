
export declare class ButtonState<T = string> {
    pressed: Set<T>
    pressedRepeat: Set<T>
    released: Set<T>
    down: Set<T>
    update(): void
    press(btn: T): void
    pressRepeat(btn: T): void
    release(btn: T): void
}
