#define GL_SILENCE_DEPRECATION
#include <quickjs.h>
#include <OpenGL/gl.h>

static JSValue gl_clear_color(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	double r, g, b, a;
	JS_ToFloat64(ctx, &r, argv[0]);
	JS_ToFloat64(ctx, &g, argv[1]);
	JS_ToFloat64(ctx, &b, argv[2]);
	JS_ToFloat64(ctx, &a, argv[3]);
	glClearColor(r, g, b, a);
	return JS_UNDEFINED;
}

static JSValue gl_clear(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT | GL_STENCIL_BUFFER_BIT);
	return JS_UNDEFINED;
}

JSValue init_gl(JSContext *ctx) {
	JSValue gl = JS_NewObject(ctx);
	JS_SetPropertyStr(ctx, gl, "clearColor", JS_NewCFunction(ctx, gl_clear_color, "clearColor", 4));
	JS_SetPropertyStr(ctx, gl, "clear", JS_NewCFunction(ctx, gl_clear, "clear", 1));
	return gl;
}
