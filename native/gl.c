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
	GLuint flag;
	JS_ToUint32(ctx, &flag, argv[0]);
	glClear(flag);
	return JS_UNDEFINED;
}

static JSValue gl_enable(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum flag;
	JS_ToUint32(ctx, &flag, argv[0]);
	glEnable(flag);
	return JS_UNDEFINED;
}

static JSValue gl_depth_func(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum func;
	JS_ToUint32(ctx, &func, argv[0]);
	glDepthFunc(func);
	return JS_UNDEFINED;
}

static JSValue gl_blend_func(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum src;
	GLenum dest;
	JS_ToUint32(ctx, &src, argv[0]);
	JS_ToUint32(ctx, &dest, argv[1]);
	glBlendFunc(src, dest);
	return JS_UNDEFINED;
}

static JSValue gl_create_buffer(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLuint buf;
	glGenBuffers(1, &buf);
	return JS_NewUint32(ctx, buf);
}

JSValue init_gl(JSContext *ctx) {

	JSValue gl = JS_NewObject(ctx);

	JS_SetPropertyStr(ctx, gl, "clearColor", JS_NewCFunction(ctx, gl_clear_color, "clearColor", 4));
	JS_SetPropertyStr(ctx, gl, "clear", JS_NewCFunction(ctx, gl_clear, "clear", 1));
	JS_SetPropertyStr(ctx, gl, "enable", JS_NewCFunction(ctx, gl_enable, "enable", 1));
	JS_SetPropertyStr(ctx, gl, "blendFunc", JS_NewCFunction(ctx, gl_depth_func, "blendFunc", 2));
	JS_SetPropertyStr(ctx, gl, "depthFunc", JS_NewCFunction(ctx, gl_depth_func, "depthFunc", 1));
	JS_SetPropertyStr(ctx, gl, "createBuffer", JS_NewCFunction(ctx, gl_create_buffer, "createBuffer", 0));

	JS_SetPropertyStr(ctx, gl, "COLOR_BUFFER_BIT", JS_NewUint32(ctx, GL_COLOR_BUFFER_BIT));
	JS_SetPropertyStr(ctx, gl, "DEPTH_BUFFER_BIT", JS_NewUint32(ctx, GL_DEPTH_BUFFER_BIT));
	JS_SetPropertyStr(ctx, gl, "STENCIL_BUFFER_BIT", JS_NewUint32(ctx, GL_STENCIL_BUFFER_BIT));
	JS_SetPropertyStr(ctx, gl, "BLEND", JS_NewUint32(ctx, GL_BLEND));
	JS_SetPropertyStr(ctx, gl, "DEPTH_TEST", JS_NewUint32(ctx, GL_DEPTH_TEST));
	JS_SetPropertyStr(ctx, gl, "STENCIL_TEST", JS_NewUint32(ctx, GL_STENCIL_TEST));

	return gl;

}
