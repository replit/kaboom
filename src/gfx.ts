function gfxInit(gl: WebGLRenderingContext, gopt: GfxOpt): Gfx {

	return {
		width,
		height,
		scale,
		makeTex,
		makeShader,
		makeFont,
		drawTexture,
		drawText,
		drawFormattedText,
		drawRect,
		drawLine,
		drawLines,
		drawTriangle,
		drawCircle,
		drawEllipse,
		drawPolygon,
		drawUVQuad,
		formatText,
		frameStart,
		frameEnd,
		pushTranslate,
		pushScale,
		pushRotateX,
		pushRotateY,
		pushRotateZ,
		pushTransform,
		popTransform,
		applyMatrix,
		drawCalls,
		background,
		toNDC,
		toScreen,
	};

}

export {
	Gfx,
	originPt,
	gfxInit,
};
