import { Vec2 } from "../../math"
import {
    FormattedText,
    DrawRectOpt,
    DrawLineOpt,
    DrawLinesOpt,
    DrawTriangleOpt,
    DrawPolygonOpt,
    DrawCircleOpt,
    DrawEllipseOpt,
    DrawUVQuadOpt,
    DrawSpriteOpt,
    DrawTextOpt,
} from "../../types"

export type DrawCtx = {
    /**
     * Draw a sprite.
     *
     * @section Draw
     *
     * @example
     * ```js
     * drawSprite({
     *     sprite: "froggy",
     *     pos: vec2(100, 200),
     *     frame: 3,
     * })
     * ```
     */
    drawSprite(options: DrawSpriteOpt): void,
    /**
     * Draw a piece of text.
     *
     * @example
     * ```js
     * drawText({
     *     text: "oh hi",
     *     size: 48,
     *     font: "sans-serif",
     *     width: 120,
     *     pos: vec2(100, 200),
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawText(options: DrawTextOpt): void,
    /**
     * Draw a rectangle.
     *
     * @example
     * ```js
     * drawRect({
     *     width: 120,
     *     height: 240,
     *     pos: vec2(20, 20),
     *     color: YELLOW,
     *     outline: { color: BLACK, width: 4 },
     * })
     * ```
     */
    drawRect(options: DrawRectOpt): void,
    /**
     * Draw a line.
     *
     * @example
     * ```js
     * drawLine({
     *     p1: vec2(0),
     *     p2: mousePos(),
     *     width: 4,
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawLine(options: DrawLineOpt): void,
    /**
     * Draw lines.
     *
     * @example
     * ```js
     * drawLines({
     *     pts: [ vec2(0), vec2(0, height()), mousePos() ],
     *     width: 4,
     *     pos: vec2(100, 200),
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawLines(options: DrawLinesOpt): void,
    /**
     * Draw a triangle.
     *
     * @example
     * ```js
     * drawTriangle({
     *     p1: vec2(0),
     *     p2: vec2(0, height()),
     *     p3: mousePos(),
     *     pos: vec2(100, 200),
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawTriangle(options: DrawTriangleOpt): void,
    /**
     * Draw a circle.
     *
     * @example
     * ```js
     * drawCircle({
     *     pos: vec2(100, 200),
     *     radius: 120,
     *     color: rgb(255, 255, 0),
     * })
     * ```
     */
    drawCircle(options: DrawCircleOpt): void,
    /**
     * Draw an ellipse.
     *
     * @example
     * ```js
     * drawEllipse({
     *     pos: vec2(100, 200),
     *     radiusX: 120,
     *     radiusY: 120,
     *     color: rgb(255, 255, 0),
     * })
     * ```
     */
    drawEllipse(options: DrawEllipseOpt): void,
    /**
     * Draw a convex polygon from a list of vertices.
     *
     * @example
     * ```js
     * drawPolygon({
     *     pts: [
     *         vec2(-12),
     *         vec2(0, 16),
     *         vec2(12, 4),
     *         vec2(0, -2),
     *         vec2(-8),
     *     ],
     *     pos: vec2(100, 200),
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawPolygon(options: DrawPolygonOpt): void,
    /**
     * Draw a rectangle with UV data.
     */
    drawUVQuad(options: DrawUVQuadOpt): void,
    /**
     * Draw a piece of formatted text from formatText().
     *
     * @since v2000.2
     *
     * @example
     * ```js
     * // text background
     * const txt = formatText({
     *     text: "oh hi",
     * })
     *
     * drawRect({
     *     width: txt.width,
     *     height: txt.height,
     * })
     *
     * drawFormattedText(txt)
     * ```
     */
    drawFormattedText(text: FormattedText): void,
    /**
     * Whatever drawn in content will only be drawn if it's also drawn in mask (mask will not be rendered).
     *
     * @since v3000.0
     */
    drawMasked(content: () => void, mask: () => void): void,
    /**
     * Subtract whatever drawn in content by whatever drawn in mask (mask will not be rendered).
     *
     * @since v3000.0
     */
    drawSubtracted(content: () => void, mask: () => void): void,
    /**
     * Push current transform matrix to the transform stack.
     *
     * @example
     * ```js
     * pushTransform()
     *
     * // these transforms will affect every render until popTransform()
     * pushTranslate(120, 200)
     * pushRotate(time() * 120)
     * pushScale(6)
     *
     * drawSprite("froggy")
     * drawCircle(vec2(0), 120)
     *
     * // restore the transformation stack to when last pushed
     * popTransform()
     * ```
     */
    pushTransform(): void,
    /**
     * Pop the topmost transform matrix from the transform stack.
     */
    popTransform(): void,
    /**
     * Translate all subsequent draws.
     *
     * @example
     * ```js
     * pushTranslate(100, 100)
     *
     * // this will be drawn at (120, 120)
     * drawText({
     *     text: "oh hi",
     *     pos: vec2(20, 20),
     * })
     * ```
     */
    pushTranslate(x: number, y: number): void,
    pushTranslate(p: Vec2): void,
    /**
     * Scale all subsequent draws.
     */
    pushScale(x: number, y: number): void,
    pushScale(s: number | Vec2): void,
    //pushScale(s: Vec2): void,
    /**
     * Rotate all subsequent draws.
     */
    pushRotate(angle: number): void,
    /**
     * Rotate all subsequent draws on X axis.
     *
     * @since v3000.0
     */
    pushRotateX(angle: number): void,
    /**
     * Rotate all subsequent draws on Y axis.
     *
     * @since v3000.0
     */
    pushRotateY(angle: number): void,
    /**
     * Rotate all subsequent draws on Z axis (the default).
     *
     * @since v3000.0
     */
    pushRotateZ(angle: number): void,
    /**
     * Draw a piece of text.
     *
     * @example
     * ```js
     * drawText({
     *     text: "oh hi",
     *     size: 48,
     *     font: "sans-serif",
     *     width: 120,
     *     pos: vec2(100, 200),
     *     color: rgb(0, 0, 255),
     * })
     * ```
     */
    drawText(options: DrawTextOpt): void,
    drawUnscaled(content: () => void): void,
    flush(): void,
    drawLoadScreen(): void,
    drawFrame(): void,
    drawDebug(getAll: any, mousePos: any, time: any): void,
    drawVirtualControls(mousePos: any, isMousePressed: any, isMouseReleased: any, testCirclePoint: any, Circle: any, testRectPoint: any): void,
}
