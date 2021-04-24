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

static JSValue gl_bind_buffer(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum target;
	GLuint id;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &id, argv[1]);
	glBindBuffer(target, id);
	return JS_UNDEFINED;
}

static JSValue gl_buffer_data(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum target;
	GLuint size;
	GLenum usage;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &size, argv[1]);
	JS_ToUint32(ctx, &usage, argv[2]);
	// TODO: support data
	glBufferData(target, size, NULL, usage);
	return JS_UNDEFINED;
}

static JSValue gl_create_texture(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLuint tex;
	glGenTextures(1, &tex);
	return JS_NewUint32(ctx, tex);
}

static JSValue gl_create_shader(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {
	GLenum type;
	JS_ToUint32(ctx, &type, argv[0]);
	GLuint shader = glCreateShader(type);
	return JS_NewUint32(ctx, shader);
}

JSValue init_gl(JSContext *ctx) {

	JSValue gl = JS_NewObject(ctx);

	JS_SetPropertyStr(ctx, gl, "clearColor", JS_NewCFunction(ctx, gl_clear_color, "clearColor", 4));
	JS_SetPropertyStr(ctx, gl, "clear", JS_NewCFunction(ctx, gl_clear, "clear", 1));
	JS_SetPropertyStr(ctx, gl, "enable", JS_NewCFunction(ctx, gl_enable, "enable", 1));
	JS_SetPropertyStr(ctx, gl, "blendFunc", JS_NewCFunction(ctx, gl_blend_func, "blendFunc", 2));
	JS_SetPropertyStr(ctx, gl, "depthFunc", JS_NewCFunction(ctx, gl_depth_func, "depthFunc", 1));

	// buffer
	JS_SetPropertyStr(ctx, gl, "createBuffer", JS_NewCFunction(ctx, gl_create_buffer, "createBuffer", 0));
	JS_SetPropertyStr(ctx, gl, "bindBuffer", JS_NewCFunction(ctx, gl_bind_buffer, "bindBuffer", 2));

	// texture
	JS_SetPropertyStr(ctx, gl, "createTexture", JS_NewCFunction(ctx, gl_create_texture, "createTexture", 0));

	// shader
	JS_SetPropertyStr(ctx, gl, "createShader", JS_NewCFunction(ctx, gl_create_shader, "createShader", 1));

	// clear bit
	JS_SetPropertyStr(ctx, gl, "COLOR_BUFFER_BIT", JS_NewUint32(ctx, GL_COLOR_BUFFER_BIT));
	JS_SetPropertyStr(ctx, gl, "DEPTH_BUFFER_BIT", JS_NewUint32(ctx, GL_DEPTH_BUFFER_BIT));
	JS_SetPropertyStr(ctx, gl, "STENCIL_BUFFER_BIT", JS_NewUint32(ctx, GL_STENCIL_BUFFER_BIT));

	// capability
	JS_SetPropertyStr(ctx, gl, "BLEND", JS_NewUint32(ctx, GL_BLEND));
	JS_SetPropertyStr(ctx, gl, "DEPTH_TEST", JS_NewUint32(ctx, GL_DEPTH_TEST));
	JS_SetPropertyStr(ctx, gl, "STENCIL_TEST", JS_NewUint32(ctx, GL_STENCIL_TEST));
	JS_SetPropertyStr(ctx, gl, "CULL_FACE", JS_NewUint32(ctx, GL_CULL_FACE));
	JS_SetPropertyStr(ctx, gl, "DITHER", JS_NewUint32(ctx, GL_DITHER));
	JS_SetPropertyStr(ctx, gl, "LINE_SMOOTH", JS_NewUint32(ctx, GL_LINE_SMOOTH));
	JS_SetPropertyStr(ctx, gl, "MULTISAMPLE", JS_NewUint32(ctx, GL_MULTISAMPLE));
	JS_SetPropertyStr(ctx, gl, "SCISSOR_TEST", JS_NewUint32(ctx, GL_SCISSOR_TEST));

	// cmp func
	JS_SetPropertyStr(ctx, gl, "NEVER", JS_NewUint32(ctx, GL_NEVER));
	JS_SetPropertyStr(ctx, gl, "ALWAYS", JS_NewUint32(ctx, GL_ALWAYS));
	JS_SetPropertyStr(ctx, gl, "EQUAL", JS_NewUint32(ctx, GL_EQUAL));
	JS_SetPropertyStr(ctx, gl, "NOTEQUAL", JS_NewUint32(ctx, GL_NOTEQUAL));
	JS_SetPropertyStr(ctx, gl, "LESS", JS_NewUint32(ctx, GL_LESS));
	JS_SetPropertyStr(ctx, gl, "LEQUAL", JS_NewUint32(ctx, GL_LEQUAL));
	JS_SetPropertyStr(ctx, gl, "GREATER", JS_NewUint32(ctx, GL_GREATER));
	JS_SetPropertyStr(ctx, gl, "GEQUAL", JS_NewUint32(ctx, GL_GEQUAL));

	// blend func
	JS_SetPropertyStr(ctx, gl, "ZERO", JS_NewUint32(ctx, GL_ZERO));
	JS_SetPropertyStr(ctx, gl, "ONE", JS_NewUint32(ctx, GL_ONE));
	JS_SetPropertyStr(ctx, gl, "SRC_COLOR", JS_NewUint32(ctx, GL_SRC_COLOR));
	JS_SetPropertyStr(ctx, gl, "ONE_MINUS_SRC_COLOR", JS_NewUint32(ctx, GL_ONE_MINUS_SRC_COLOR));
	JS_SetPropertyStr(ctx, gl, "DST_COLOR", JS_NewUint32(ctx, GL_DST_COLOR));
	JS_SetPropertyStr(ctx, gl, "ONE_MINUS_DST_COLOR", JS_NewUint32(ctx, GL_ONE_MINUS_DST_COLOR));
	JS_SetPropertyStr(ctx, gl, "SRC_ALPHA", JS_NewUint32(ctx, GL_SRC_ALPHA));
	JS_SetPropertyStr(ctx, gl, "ONE_MINUS_SRC_ALPHA", JS_NewUint32(ctx, GL_ONE_MINUS_SRC_ALPHA));
	JS_SetPropertyStr(ctx, gl, "DST_ALPHA", JS_NewUint32(ctx, GL_DST_ALPHA));
	JS_SetPropertyStr(ctx, gl, "ONE_MINUS_DST_ALPHA", JS_NewUint32(ctx, GL_ONE_MINUS_DST_ALPHA));

	// type
	JS_SetPropertyStr(ctx, gl, "BYTE", JS_NewUint32(ctx, GL_BYTE));
	JS_SetPropertyStr(ctx, gl, "SHORT", JS_NewUint32(ctx, GL_SHORT));
	JS_SetPropertyStr(ctx, gl, "UNSIGNED_BYTE", JS_NewUint32(ctx, GL_UNSIGNED_BYTE));
	JS_SetPropertyStr(ctx, gl, "UNSIGNED_SHORT", JS_NewUint32(ctx, GL_UNSIGNED_SHORT));
	JS_SetPropertyStr(ctx, gl, "FLOAT", JS_NewUint32(ctx, GL_FLOAT));

	// bool
	JS_SetPropertyStr(ctx, gl, "FALSE", JS_NewUint32(ctx, GL_FALSE));
	JS_SetPropertyStr(ctx, gl, "TRUE", JS_NewUint32(ctx, GL_TRUE));

	// color
	JS_SetPropertyStr(ctx, gl, "RGBA", JS_NewUint32(ctx, GL_RGBA));
	JS_SetPropertyStr(ctx, gl, "RGB", JS_NewUint32(ctx, GL_RGB));
	JS_SetPropertyStr(ctx, gl, "BGRA", JS_NewUint32(ctx, GL_BGRA));
	JS_SetPropertyStr(ctx, gl, "DEPTH_COMPONENT", JS_NewUint32(ctx, GL_DEPTH_COMPONENT));
	JS_SetPropertyStr(ctx, gl, "DEPTH_STENCIL", JS_NewUint32(ctx, GL_DEPTH_STENCIL));

	// primitive
	JS_SetPropertyStr(ctx, gl, "TRIANGLES", JS_NewUint32(ctx, GL_TRIANGLES));
	JS_SetPropertyStr(ctx, gl, "TRIANGLE_STRIP", JS_NewUint32(ctx, GL_TRIANGLE_STRIP));
	JS_SetPropertyStr(ctx, gl, "TRIANGLE_FAN", JS_NewUint32(ctx, GL_TRIANGLE_FAN));
	JS_SetPropertyStr(ctx, gl, "QUADS", JS_NewUint32(ctx, GL_QUADS));
	JS_SetPropertyStr(ctx, gl, "QUAD_STRIP", JS_NewUint32(ctx, GL_QUAD_STRIP));
	JS_SetPropertyStr(ctx, gl, "POINTS", JS_NewUint32(ctx, GL_POINTS));
	JS_SetPropertyStr(ctx, gl, "LINES", JS_NewUint32(ctx, GL_LINES));
	JS_SetPropertyStr(ctx, gl, "LINE_STRIP", JS_NewUint32(ctx, GL_LINE_STRIP));
	JS_SetPropertyStr(ctx, gl, "LINE_LOOP", JS_NewUint32(ctx, GL_LINE_LOOP));

	// usage
	JS_SetPropertyStr(ctx, gl, "STATIC_DRAW", JS_NewUint32(ctx, GL_STATIC_DRAW));
	JS_SetPropertyStr(ctx, gl, "DYNAMIC_DRAW", JS_NewUint32(ctx, GL_DYNAMIC_DRAW));
	JS_SetPropertyStr(ctx, gl, "STREAM_DRAW", JS_NewUint32(ctx, GL_STREAM_DRAW));

	// buf type
	JS_SetPropertyStr(ctx, gl, "ARRAY_BUFFER", JS_NewUint32(ctx, GL_ARRAY_BUFFER));
	JS_SetPropertyStr(ctx, gl, "ELEMENT_ARRAY_BUFFER", JS_NewUint32(ctx, GL_ELEMENT_ARRAY_BUFFER));

	// tex type
	JS_SetPropertyStr(ctx, gl, "TEXTURE_2D", JS_NewUint32(ctx, GL_TEXTURE_2D));
	JS_SetPropertyStr(ctx, gl, "TEXTURE_CUBE_MAP", JS_NewUint32(ctx, GL_TEXTURE_CUBE_MAP));

	// tex param
	JS_SetPropertyStr(ctx, gl, "TEXTURE_MIN_FILTER", JS_NewUint32(ctx, GL_TEXTURE_MIN_FILTER));
	JS_SetPropertyStr(ctx, gl, "TEXTURE_MAG_FILTER", JS_NewUint32(ctx, GL_TEXTURE_MAG_FILTER));
	JS_SetPropertyStr(ctx, gl, "TEXTURE_WRAP_S", JS_NewUint32(ctx, GL_TEXTURE_WRAP_S));
	JS_SetPropertyStr(ctx, gl, "TEXTURE_WRAP_T", JS_NewUint32(ctx, GL_TEXTURE_WRAP_T));

	// filter
	JS_SetPropertyStr(ctx, gl, "NEAREST", JS_NewUint32(ctx, GL_NEAREST));
	JS_SetPropertyStr(ctx, gl, "LINEAR", JS_NewUint32(ctx, GL_LINEAR));

	// wrap
	JS_SetPropertyStr(ctx, gl, "CLAMP_TO_EDGE", JS_NewUint32(ctx, GL_CLAMP_TO_EDGE));
	JS_SetPropertyStr(ctx, gl, "REPEAT", JS_NewUint32(ctx, GL_REPEAT));
	JS_SetPropertyStr(ctx, gl, "MIRRORED_REPEAT", JS_NewUint32(ctx, GL_MIRRORED_REPEAT));

	// shader type
	JS_SetPropertyStr(ctx, gl, "VERTEX_SHADER", JS_NewUint32(ctx, GL_VERTEX_SHADER));
	JS_SetPropertyStr(ctx, gl, "FRAGMENT_SHADER", JS_NewUint32(ctx, GL_FRAGMENT_SHADER));

	return gl;

}
