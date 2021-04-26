// implements WebGL interface in OpenGL

#include "utils.h"

#include <quickjs.h>
#define GL_SILENCE_DEPRECATION
#include <OpenGL/gl.h>

static JSValue gl_clear_color(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 4, nargs)) {
		return JS_EXCEPTION;
	}
	double r, g, b, a;
	JS_ToFloat64(ctx, &r, argv[0]);
	JS_ToFloat64(ctx, &g, argv[1]);
	JS_ToFloat64(ctx, &b, argv[2]);
	JS_ToFloat64(ctx, &a, argv[3]);
	glClearColor(r, g, b, a);
	return JS_UNDEFINED;
}

static JSValue gl_clear(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint flag;
	JS_ToUint32(ctx, &flag, argv[0]);
	glClear(flag);
	return JS_UNDEFINED;
}

static JSValue gl_viewport(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 4, nargs)) {
		return JS_EXCEPTION;
	}
	int x, y, w, h;
	JS_ToInt32(ctx, &x, argv[0]);
	JS_ToInt32(ctx, &y, argv[1]);
	JS_ToInt32(ctx, &w, argv[2]);
	JS_ToInt32(ctx, &h, argv[3]);
	glViewport(x, y, w, h);
	return JS_UNDEFINED;
}

static JSValue gl_enable(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum flag;
	JS_ToUint32(ctx, &flag, argv[0]);
	glEnable(flag);
	return JS_UNDEFINED;
}

static JSValue gl_depth_func(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum func;
	JS_ToUint32(ctx, &func, argv[0]);
	glDepthFunc(func);
	return JS_UNDEFINED;
}

static JSValue gl_blend_func(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum src;
	GLenum dest;
	JS_ToUint32(ctx, &src, argv[0]);
	JS_ToUint32(ctx, &dest, argv[1]);
	glBlendFunc(src, dest);
	return JS_UNDEFINED;
}

static JSValue gl_create_buffer(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 0, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint buf;
	glGenBuffers(1, &buf);
	return JS_NewUint32(ctx, buf);
}

static JSValue gl_bind_buffer(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum target;
	GLuint id;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &id, argv[1]);
	glBindBuffer(target, id);
	return JS_UNDEFINED;
}

static JSValue gl_buffer_data(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {

	GLenum target;
	GLenum usage;

	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}

	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &usage, argv[2]);

	if (JS_IsNumber(argv[1])) {
		GLuint size;
		JS_ToUint32(ctx, &size, argv[1]);
		glBufferData(target, size, NULL, usage);
	} else if (JS_IsObject(argv[1])) {
		size_t size;
		JSValue arrbuf = JS_GetTypedArrayBuffer(ctx, argv[1], NULL, NULL, NULL);
		uint8_t *buf = JS_GetArrayBuffer(ctx, &size, arrbuf);
		if (!buf) {
			JS_ThrowInternalError(ctx, "failed to get ArrayBuffer");
			return JS_EXCEPTION;
		}
		glBufferData(target, size, buf, usage);
	} else {
		JS_ThrowTypeError(ctx, "expected ArrayBuffer or Number");
		return JS_EXCEPTION;
	}

	return JS_UNDEFINED;

}

static JSValue gl_buffer_sub_data(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum target;
	GLuint offset;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &offset, argv[1]);
	size_t size;
	uint8_t *buf = JS_GetArrayBuffer(ctx, &size, argv[2]);
	glBufferSubData(target, offset, size, buf);
	return JS_UNDEFINED;
}

static JSValue gl_create_texture(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 0, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint tex;
	glGenTextures(1, &tex);
	return JS_NewUint32(ctx, tex);
}

static JSValue gl_create_shader(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum type;
	JS_ToUint32(ctx, &type, argv[0]);
	return JS_NewUint32(ctx, glCreateShader(type));
}

static JSValue gl_shader_source(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint id;
	JS_ToUint32(ctx, &id, argv[0]);
	const char *code = JS_ToCString(ctx, argv[1]);
	glShaderSource(id, 1, &code, 0);
	JS_FreeCString(ctx, code);
	return JS_UNDEFINED;
}

static JSValue gl_compile_shader(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint id;
	JS_ToUint32(ctx, &id, argv[0]);
	glCompileShader(id);
	return JS_UNDEFINED;
}

static JSValue gl_create_program(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 0, nargs)) {
		return JS_EXCEPTION;
	}
	return JS_NewUint32(ctx, glCreateProgram());
}

static JSValue gl_attach_shader(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint program;
	GLuint shader;
	JS_ToUint32(ctx, &program, argv[0]);
	JS_ToUint32(ctx, &shader, argv[1]);
	glAttachShader(program, shader);
	return JS_UNDEFINED;
}

static JSValue gl_link_program(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint program;
	JS_ToUint32(ctx, &program, argv[0]);
	glLinkProgram(program);
	return JS_UNDEFINED;
}

static JSValue gl_use_program(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint program;
	JS_ToUint32(ctx, &program, argv[0]);
	glUseProgram(program);
	return JS_UNDEFINED;
}

static JSValue gl_bind_attrib_location(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint prog;
	GLuint idx;
	JS_ToUint32(ctx, &prog, argv[0]);
	JS_ToUint32(ctx, &idx, argv[1]);
	const char *name = JS_ToCString(ctx, argv[2]);
	glBindAttribLocation(prog, idx, name);
	JS_FreeCString(ctx, name);
	return JS_UNDEFINED;
}

static JSValue gl_vertex_attrib_pointer(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 6, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint idx;
	GLint size;
	GLenum type;
	GLsizei stride;
	JS_ToUint32(ctx, &idx, argv[0]);
	JS_ToInt32(ctx, &size, argv[1]);
	JS_ToUint32(ctx, &type, argv[2]);
	bool normalized = JS_ToBool(ctx, argv[3]);
	JS_ToInt32(ctx, &stride, argv[4]);
	// TODO: last param ptr
	glVertexAttribPointer(idx, size, type, normalized, stride, 0);
	return JS_UNDEFINED;
}

static JSValue gl_enable_vertex_attrib_array(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint idx;
	JS_ToUint32(ctx, &idx, argv[0]);
	glEnableVertexAttribArray(idx);
	return JS_UNDEFINED;
}

static JSValue gl_draw_elements(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 4, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum prim;
	GLsizei count;
	GLenum type;
	GLuint offset;
	JS_ToUint32(ctx, &prim, argv[0]);
	JS_ToInt32(ctx, &count, argv[1]);
	JS_ToUint32(ctx, &type, argv[2]);
	JS_ToUint32(ctx, &offset, argv[3]);
	// TODO
	glDrawElements(prim, count, type, 0);
	return JS_UNDEFINED;
}

static JSValue gl_draw_arrays(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 4, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum prim;
	GLint first;
	GLsizei count;
	JS_ToUint32(ctx, &prim, argv[0]);
	JS_ToInt32(ctx, &first, argv[1]);
	JS_ToInt32(ctx, &count, argv[2]);
	glDrawArrays(prim, first, count);
	return JS_UNDEFINED;
}

static const JSCFunctionListEntry gl_fields[] = {
	// common
	JS_CFUNC_DEF("clearColor", 4, gl_clear_color),
	JS_CFUNC_DEF("clear", 1, gl_clear),
	JS_CFUNC_DEF("viewport", 4, gl_viewport),
	JS_CFUNC_DEF("enable", 1, gl_enable),
	JS_CFUNC_DEF("blendFunc", 2, gl_blend_func),
	JS_CFUNC_DEF("depthFunc", 1, gl_depth_func),
	// buffer
	JS_CFUNC_DEF("createBuffer", 0, gl_create_buffer),
	JS_CFUNC_DEF("bindBuffer", 2, gl_bind_buffer),
	JS_CFUNC_DEF("bufferData", 3, gl_buffer_data),
	JS_CFUNC_DEF("bufferSubData", 3, gl_buffer_sub_data),
	// texture
	JS_CFUNC_DEF("createTexture", 0, gl_create_texture),
	// shader
	JS_CFUNC_DEF("createShader", 1, gl_create_shader),
	JS_CFUNC_DEF("shaderSource", 2, gl_shader_source),
	JS_CFUNC_DEF("compileShader", 1, gl_compile_shader),
	JS_CFUNC_DEF("createProgram", 0, gl_create_program),
	JS_CFUNC_DEF("attachShader", 2, gl_attach_shader),
	JS_CFUNC_DEF("linkProgram", 1, gl_link_program),
	JS_CFUNC_DEF("useProgram", 1, gl_use_program),
	// attrib
	JS_CFUNC_DEF("bindAttribLocation", 3, gl_bind_attrib_location),
	JS_CFUNC_DEF("vertexAttribPointer", 6, gl_vertex_attrib_pointer),
	JS_CFUNC_DEF("enableVertexAttribArray", 1, gl_enable_vertex_attrib_array),
	// draw
	JS_CFUNC_DEF("drawElements", 4, gl_draw_elements),
	JS_CFUNC_DEF("drawArrays", 3, gl_draw_arrays),
	// clear bit
	JS_PROP_INT32_DEF("COLOR_BUFFER_BIT", GL_COLOR_BUFFER_BIT, 0),
	JS_PROP_INT32_DEF("COLOR_BUFFER_BIT", GL_COLOR_BUFFER_BIT, 0),
	JS_PROP_INT32_DEF("DEPTH_BUFFER_BIT", GL_DEPTH_BUFFER_BIT, 0),
	JS_PROP_INT32_DEF("STENCIL_BUFFER_BIT", GL_STENCIL_BUFFER_BIT, 0),
	// capability
	JS_PROP_INT32_DEF("BLEND", GL_BLEND, 0),
	JS_PROP_INT32_DEF("DEPTH_TEST", GL_DEPTH_TEST, 0),
	JS_PROP_INT32_DEF("STENCIL_TEST", GL_STENCIL_TEST, 0),
	JS_PROP_INT32_DEF("CULL_FACE", GL_CULL_FACE, 0),
	JS_PROP_INT32_DEF("DITHER", GL_DITHER, 0),
	JS_PROP_INT32_DEF("LINE_SMOOTH", GL_LINE_SMOOTH, 0),
	JS_PROP_INT32_DEF("MULTISAMPLE", GL_MULTISAMPLE, 0),
	JS_PROP_INT32_DEF("SCISSOR_TEST", GL_SCISSOR_TEST, 0),
	// cmp func
	JS_PROP_INT32_DEF("NEVER", GL_NEVER, 0),
	JS_PROP_INT32_DEF("ALWAYS", GL_ALWAYS, 0),
	JS_PROP_INT32_DEF("EQUAL", GL_EQUAL, 0),
	JS_PROP_INT32_DEF("NOTEQUAL", GL_NOTEQUAL, 0),
	JS_PROP_INT32_DEF("LESS", GL_LESS, 0),
	JS_PROP_INT32_DEF("LEQUAL", GL_LEQUAL, 0),
	JS_PROP_INT32_DEF("GREATER", GL_GREATER, 0),
	JS_PROP_INT32_DEF("GEQUAL", GL_GEQUAL, 0),
	// blend func
	JS_PROP_INT32_DEF("ZERO", GL_ZERO, 0),
	JS_PROP_INT32_DEF("ONE", GL_ONE, 0),
	JS_PROP_INT32_DEF("SRC_COLOR", GL_SRC_COLOR, 0),
	JS_PROP_INT32_DEF("ONE_MINUS_SRC_COLOR", GL_ONE_MINUS_SRC_COLOR, 0),
	JS_PROP_INT32_DEF("DST_COLOR", GL_DST_COLOR, 0),
	JS_PROP_INT32_DEF("ONE_MINUS_DST_COLOR", GL_ONE_MINUS_DST_COLOR, 0),
	JS_PROP_INT32_DEF("SRC_ALPHA", GL_SRC_ALPHA, 0),
	JS_PROP_INT32_DEF("ONE_MINUS_SRC_ALPHA", GL_ONE_MINUS_SRC_ALPHA, 0),
	JS_PROP_INT32_DEF("DST_ALPHA", GL_DST_ALPHA, 0),
	JS_PROP_INT32_DEF("ONE_MINUS_DST_ALPHA", GL_ONE_MINUS_DST_ALPHA, 0),
	// type
	JS_PROP_INT32_DEF("BYTE", GL_BYTE, 0),
	JS_PROP_INT32_DEF("SHORT", GL_SHORT, 0),
	JS_PROP_INT32_DEF("UNSIGNED_BYTE", GL_UNSIGNED_BYTE, 0),
	JS_PROP_INT32_DEF("UNSIGNED_SHORT", GL_UNSIGNED_SHORT, 0),
	JS_PROP_INT32_DEF("FLOAT", GL_FLOAT, 0),
	// bool
	JS_PROP_INT32_DEF("FALSE", GL_FALSE, 0),
	JS_PROP_INT32_DEF("TRUE", GL_TRUE, 0),
	// color
	JS_PROP_INT32_DEF("RGBA", GL_RGBA, 0),
	JS_PROP_INT32_DEF("RGB", GL_RGB, 0),
	JS_PROP_INT32_DEF("BGRA", GL_BGRA, 0),
	JS_PROP_INT32_DEF("DEPTH_COMPONENT", GL_DEPTH_COMPONENT, 0),
	JS_PROP_INT32_DEF("DEPTH_STENCIL", GL_DEPTH_STENCIL, 0),
	// primitive
	JS_PROP_INT32_DEF("TRIANGLES", GL_TRIANGLES, 0),
	JS_PROP_INT32_DEF("TRIANGLE_STRIP", GL_TRIANGLE_STRIP, 0),
	JS_PROP_INT32_DEF("TRIANGLE_FAN", GL_TRIANGLE_FAN, 0),
	JS_PROP_INT32_DEF("QUADS", GL_QUADS, 0),
	JS_PROP_INT32_DEF("QUAD_STRIP", GL_QUAD_STRIP, 0),
	JS_PROP_INT32_DEF("POINTS", GL_POINTS, 0),
	JS_PROP_INT32_DEF("LINES", GL_LINES, 0),
	JS_PROP_INT32_DEF("LINE_STRIP", GL_LINE_STRIP, 0),
	JS_PROP_INT32_DEF("LINE_LOOP", GL_LINE_LOOP, 0),
	// usage
	JS_PROP_INT32_DEF("STATIC_DRAW", GL_STATIC_DRAW, 0),
	JS_PROP_INT32_DEF("DYNAMIC_DRAW", GL_DYNAMIC_DRAW, 0),
	JS_PROP_INT32_DEF("STREAM_DRAW", GL_STREAM_DRAW, 0),
	// buf type
	JS_PROP_INT32_DEF("ARRAY_BUFFER", GL_ARRAY_BUFFER, 0),
	JS_PROP_INT32_DEF("ELEMENT_ARRAY_BUFFER", GL_ELEMENT_ARRAY_BUFFER, 0),
	// tex type
	JS_PROP_INT32_DEF("TEXTURE_2D", GL_TEXTURE_2D, 0),
	JS_PROP_INT32_DEF("TEXTURE_CUBE_MAP", GL_TEXTURE_CUBE_MAP, 0),
	// tex param
	JS_PROP_INT32_DEF("TEXTURE_MIN_FILTER", GL_TEXTURE_MIN_FILTER, 0),
	JS_PROP_INT32_DEF("TEXTURE_MAG_FILTER", GL_TEXTURE_MAG_FILTER, 0),
	JS_PROP_INT32_DEF("TEXTURE_WRAP_S", GL_TEXTURE_WRAP_S, 0),
	JS_PROP_INT32_DEF("TEXTURE_WRAP_T", GL_TEXTURE_WRAP_T, 0),
	// filter
	JS_PROP_INT32_DEF("NEAREST", GL_NEAREST, 0),
	JS_PROP_INT32_DEF("LINEAR", GL_LINEAR, 0),
	// wrap
	JS_PROP_INT32_DEF("CLAMP_TO_EDGE", GL_CLAMP_TO_EDGE, 0),
	JS_PROP_INT32_DEF("REPEAT", GL_REPEAT, 0),
	JS_PROP_INT32_DEF("MIRRORED_REPEAT", GL_MIRRORED_REPEAT, 0),
	// shader type
	JS_PROP_INT32_DEF("VERTEX_SHADER", GL_VERTEX_SHADER, 0),
	JS_PROP_INT32_DEF("FRAGMENT_SHADER", GL_FRAGMENT_SHADER, 0),
};

JSValue gl_get(JSContext *ctx) {
	JSValue gl = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, gl, gl_fields, countof(gl_fields));
	return gl;
}
