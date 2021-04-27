#include <sys/time.h>
#include <quickjs.h>
#define SOKOL_GLCORE33
#define SOKOL_NO_ENTRY
#define SOKOL_IMPL
#include <sokol_app.h>
#include <sokol_audio.h>
#define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>
#include <minimp3.h>
#include <OpenGL/gl.h>

#define countof(x) (sizeof(x) / sizeof((x)[0]))

// TODO
#define NUM_KEYS SAPP_KEYCODE_MENU

typedef enum {
	BTN_IDLE,
	BTN_PRESSED,
	BTN_RPRESSED,
	BTN_RELEASED,
	BTN_DOWN,
} btn_state;

typedef struct {
	JSContext *js_ctx;
	JSValue js_frame;
	JSValue js_init;
	JSValue g;
	btn_state key_states[NUM_KEYS];
	btn_state mouse_state;
	struct timeval start_time;
	float time;
	float dt;
	float mouse_x;
	float mouse_y;
} gctx_t;

gctx_t gctx;

char *read_text(const char *path) {

	FILE *file = fopen(path, "r");

	if (!file) {
		return NULL;
	}

	fseek(file, 0, SEEK_END);
	size_t size = ftell(file);
	fseek(file, 0, SEEK_SET);

	char *buffer = malloc(size + 1);
	size_t r_size = fread(buffer, 1, size, file);

	buffer[size] = '\0';

	if (r_size != size) {
		free(buffer);
		return NULL;
	}

	fclose(file);

	return buffer;

}

uint8_t *read_bytes(const char *path, size_t *osize) {

	FILE *file = fopen(path, "rb");

	if (!file) {
		return NULL;
	}

	fseek(file, 0, SEEK_END);
	size_t size = ftell(file);
	fseek(file, 0, SEEK_SET);

	uint8_t *buffer = malloc(size);
	size_t r_size = fread(buffer, 1, size, file);

	if (r_size != size) {
		free(buffer);
		return NULL;
	}

	fclose(file);
	*osize = size;

	return buffer;

}

void JS_PrintVal(JSContext *ctx, FILE *f, JSValue val) {
	const char *str = JS_ToCString(ctx, val);
	fprintf(f, "%s", str);
	JS_FreeCString(ctx, str);
}

void JS_DumpErr(JSContext *ctx) {
	JSValue err = JS_GetException(ctx);
	JS_PrintVal(ctx, stderr, err);
	JSValue stack = JS_GetPropertyStr(ctx, err, "stack");
	if (!JS_IsUndefined(stack)) {
		JS_PrintVal(ctx, stderr, stack);
	}
	// TODO: is this necessary?
	JS_FreeValue(ctx, stack);
}

void JS_HandleTasks(JSContext *ctx) {
	JSContext *ctx2;
	while (1) {
		int err = JS_ExecutePendingJob(JS_GetRuntime(ctx), &ctx2);
		if (err <= 0) {
			if (err < 0) {
				JS_DumpErr(ctx2);
			}
			break;
		}
	}
}

JSValue JS_ECall(
	JSContext *ctx,
	JSValue func,
	JSValue this,
	int nargs,
	JSValueConst *argv
) {
	JSValue res = JS_Call(ctx, func, this, nargs, argv);
	if (JS_IsException(res)) {
		JS_DumpErr(ctx);
	}
	return res;
}

bool JS_CheckNargs(
	JSContext *ctx,
	int expected,
	int actual
) {
	if (expected != actual) {
		JS_ThrowTypeError(ctx, "expected %d args, found %d", expected, actual);
		return false;
	}
	return true;
}

JSValue gl_clear_color(
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

JSValue gl_clear(
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

JSValue gl_viewport(
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

JSValue gl_enable(
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

JSValue gl_depth_func(
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

JSValue gl_blend_func(
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

JSValue gl_create_buffer(
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

JSValue gl_bind_buffer(
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

JSValue gl_buffer_data(
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
		uint8_t *buf = JS_GetArrayBuffer(
			ctx,
			&size,
			JS_GetTypedArrayBuffer(ctx, argv[1], NULL, NULL, NULL)
		);
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

JSValue gl_buffer_sub_data(
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
	uint8_t *buf = JS_GetArrayBuffer(
		ctx,
		&size,
		JS_GetTypedArrayBuffer(ctx, argv[2], NULL, NULL, NULL)
	);
	glBufferSubData(target, offset, size, buf);
	return JS_UNDEFINED;
}

JSValue gl_create_texture(
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

JSValue gl_bind_texture(
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
	glBindTexture(target, id);
	return JS_UNDEFINED;
}

JSValue gl_tex_image_2d(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	// TODO: support full arg version
	if (!JS_CheckNargs(ctx, 6, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum target;
	GLint level;
	GLint iformat;
	GLsizei width;
	GLsizei height;
	GLenum format;
	GLenum type;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToInt32(ctx, &level, argv[1]);
	JS_ToInt32(ctx, &iformat, argv[2]);
	JS_ToUint32(ctx, &format, argv[3]);
	JS_ToUint32(ctx, &type, argv[4]);
	JSValue img = argv[5];
	JS_ToInt32(ctx, &width, JS_GetPropertyStr(ctx, img, "width"));
	JS_ToInt32(ctx, &height, JS_GetPropertyStr(ctx, img, "height"));
	size_t size;
	uint8_t *buf = JS_GetArrayBuffer(
		ctx,
		&size,
		JS_GetPropertyStr(ctx, img, "data")
	);
	glTexImage2D(target, level, iformat, width, height, 0, format, type, buf);
	return JS_UNDEFINED;
}

JSValue gl_tex_parameter_i(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}
	GLenum target;
	GLenum prop;
	GLint val;
	JS_ToUint32(ctx, &target, argv[0]);
	JS_ToUint32(ctx, &prop, argv[1]);
	JS_ToInt32(ctx, &val, argv[2]);
	glTexParameteri(target, prop, val);
	return JS_UNDEFINED;
}

JSValue gl_create_shader(
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

JSValue gl_shader_source(
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

JSValue gl_compile_shader(
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

#define INFO_LOG_LEN 512
char info_log[INFO_LOG_LEN];

JSValue gl_get_shader_info_log(
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
	GLsizei len;
	glGetShaderInfoLog(id, INFO_LOG_LEN, &len, info_log);
	if (len) {
		return JS_NewStringLen(ctx, info_log, len);
	} else {
		return JS_UNDEFINED;
	}
}

JSValue gl_create_program(
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

JSValue gl_attach_shader(
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

JSValue gl_link_program(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint prog;
	JS_ToUint32(ctx, &prog, argv[0]);
	glLinkProgram(prog);
	return JS_UNDEFINED;
}

JSValue gl_use_program(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 1, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint prog;
	JS_ToUint32(ctx, &prog, argv[0]);
	glUseProgram(prog);
	return JS_UNDEFINED;
}

JSValue gl_get_uniform_location(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLuint prog;
	JS_ToUint32(ctx, &prog, argv[0]);
	const char *name = JS_ToCString(ctx, argv[1]);
	GLint loc = glGetUniformLocation(prog, name);
	JS_FreeCString(ctx, name);
	return JS_NewInt32(ctx, loc);
}

JSValue gl_uniform_1f(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 2, nargs)) {
		return JS_EXCEPTION;
	}
	GLint loc;
	double f1;
	JS_ToInt32(ctx, &loc, argv[0]);
	JS_ToFloat64(ctx, &f1, argv[1]);
	glUniform1f(loc, f1);
	return JS_UNDEFINED;
}

JSValue gl_uniform_2f(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}
	GLint loc;
	double f1;
	double f2;
	JS_ToInt32(ctx, &loc, argv[0]);
	JS_ToFloat64(ctx, &f1, argv[1]);
	JS_ToFloat64(ctx, &f2, argv[2]);
	glUniform2f(loc, f1, f2);
	return JS_UNDEFINED;
}

JSValue gl_uniform_3f(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 4, nargs)) {
		return JS_EXCEPTION;
	}
	GLint loc;
	double f1;
	double f2;
	double f3;
	JS_ToInt32(ctx, &loc, argv[0]);
	JS_ToFloat64(ctx, &f1, argv[1]);
	JS_ToFloat64(ctx, &f2, argv[2]);
	JS_ToFloat64(ctx, &f3, argv[3]);
	glUniform3f(loc, f1, f2, f3);
	return JS_UNDEFINED;
}

JSValue gl_uniform_4f(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 5, nargs)) {
		return JS_EXCEPTION;
	}
	GLint loc;
	double f1;
	double f2;
	double f3;
	double f4;
	JS_ToInt32(ctx, &loc, argv[0]);
	JS_ToFloat64(ctx, &f1, argv[1]);
	JS_ToFloat64(ctx, &f2, argv[2]);
	JS_ToFloat64(ctx, &f3, argv[3]);
	JS_ToFloat64(ctx, &f4, argv[4]);
	glUniform4f(loc, f1, f2, f3, f4);
	return JS_UNDEFINED;
}

JSValue gl_uniform_matrix4_fv(
	JSContext *ctx,
	JSValue this,
	int nargs,
	JSValue *argv
) {
	if (!JS_CheckNargs(ctx, 3, nargs)) {
		return JS_EXCEPTION;
	}
	GLint loc;
	JS_ToInt32(ctx, &loc, argv[0]);
	bool transpose = JS_ToBool(ctx, argv[1]);
	size_t size;
	uint8_t *buf = JS_GetArrayBuffer(
		ctx,
		&size,
		JS_GetTypedArrayBuffer(ctx, argv[2], NULL, NULL, NULL)
	);
	// TODO: test cast
	glUniformMatrix4fv(loc, 0, transpose, (GLfloat*)buf);
	return JS_UNDEFINED;
}

JSValue gl_bind_attrib_location(
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

JSValue gl_vertex_attrib_pointer(
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
	int64_t offset;
	JS_ToUint32(ctx, &idx, argv[0]);
	JS_ToInt32(ctx, &size, argv[1]);
	JS_ToUint32(ctx, &type, argv[2]);
	bool normalized = JS_ToBool(ctx, argv[3]);
	JS_ToInt32(ctx, &stride, argv[4]);
	JS_ToInt64(ctx, &offset, argv[5]);
	// TODO: last param ptr
	glVertexAttribPointer(idx, size, type, normalized, stride, (void*)offset);
	return JS_UNDEFINED;
}

JSValue gl_enable_vertex_attrib_array(
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

JSValue gl_draw_elements(
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

JSValue gl_draw_arrays(
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

const JSCFunctionListEntry gl_members[] = {
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
	JS_CFUNC_DEF("bindTexture", 2, gl_bind_texture),
	JS_CFUNC_DEF("texImage2D", 6, gl_tex_image_2d),
	JS_CFUNC_DEF("texParameteri", 3, gl_tex_parameter_i),
	// shader
	JS_CFUNC_DEF("createShader", 1, gl_create_shader),
	JS_CFUNC_DEF("shaderSource", 2, gl_shader_source),
	JS_CFUNC_DEF("compileShader", 1, gl_compile_shader),
	JS_CFUNC_DEF("getShaderInfoLog", 1, gl_get_shader_info_log),
	JS_CFUNC_DEF("createProgram", 0, gl_create_program),
	JS_CFUNC_DEF("attachShader", 2, gl_attach_shader),
	JS_CFUNC_DEF("linkProgram", 1, gl_link_program),
	JS_CFUNC_DEF("useProgram", 1, gl_use_program),
	// uniform
	JS_CFUNC_DEF("getUniformLocation", 2, gl_get_uniform_location),
	JS_CFUNC_DEF("uniform1f", 2, gl_uniform_1f),
	JS_CFUNC_DEF("uniform2f", 3, gl_uniform_2f),
	JS_CFUNC_DEF("uniform3f", 4, gl_uniform_3f),
	JS_CFUNC_DEF("uniform4f", 5, gl_uniform_4f),
	JS_CFUNC_DEF("uniformMatrix4fv", 3, gl_uniform_matrix4_fv),
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

btn_state process_btn(btn_state b) {
	if (b == BTN_PRESSED || b == BTN_RPRESSED) {
		return BTN_DOWN;
	} else if (b == BTN_RELEASED) {
		return BTN_IDLE;
	}
	return b;
}

void init() {
	gettimeofday(&gctx.start_time, NULL);
	JS_ECall(gctx.js_ctx, gctx.js_init, JS_UNDEFINED, 1, &gctx.g);
}

void frame() {

	JS_HandleTasks(gctx.js_ctx);
	JS_ECall(gctx.js_ctx, gctx.js_frame, JS_UNDEFINED, 1, &gctx.g);

	struct timeval time;

	gettimeofday(&time, NULL);

	float t =
		(float)(time.tv_sec - gctx.start_time.tv_sec)
		+ (float)(time.tv_usec - gctx.start_time.tv_usec) / 1000000.0;
	gctx.dt = t - gctx.time;
	gctx.time = t;

	for (int i = 0; i < NUM_KEYS; i++) {
		gctx.key_states[i] = process_btn(gctx.key_states[i]);
	}

	gctx.mouse_state = process_btn(gctx.mouse_state);

}

void event(const sapp_event *ev) {
	switch (ev->type) {
		case SAPP_EVENTTYPE_KEY_DOWN:
			if (ev->key_repeat) {
				gctx.key_states[ev->key_code] = BTN_RPRESSED;
			} else {
				gctx.key_states[ev->key_code] = BTN_PRESSED;
			}
			break;
		case SAPP_EVENTTYPE_KEY_UP:
			gctx.key_states[ev->key_code] = BTN_RELEASED;
			break;
		case SAPP_EVENTTYPE_CHAR:
			break;
		case SAPP_EVENTTYPE_MOUSE_DOWN:
			if (ev->mouse_button == SAPP_MOUSEBUTTON_LEFT) {
				gctx.mouse_state = BTN_PRESSED;
			}
			break;
		case SAPP_EVENTTYPE_MOUSE_UP:
			if (ev->mouse_button == SAPP_MOUSEBUTTON_LEFT) {
				gctx.mouse_state = BTN_RELEASED;
			}
			break;
		case SAPP_EVENTTYPE_MOUSE_MOVE:
			gctx.mouse_x = ev->mouse_x;
			gctx.mouse_y = ev->mouse_y;
			break;
		default:
			break;
	}
}

bool streq(const char *s1, const char *s2) {
	return strcmp(s1, s2) == 0;
}

sapp_keycode str_to_sapp_keycode(const char *k) {
	if      (streq(k, "a")) return SAPP_KEYCODE_A;
	else if (streq(k, "b")) return SAPP_KEYCODE_B;
	else if (streq(k, "c")) return SAPP_KEYCODE_C;
	else if (streq(k, "d")) return SAPP_KEYCODE_D;
	else if (streq(k, "e")) return SAPP_KEYCODE_E;
	else if (streq(k, "f")) return SAPP_KEYCODE_F;
	else if (streq(k, "g")) return SAPP_KEYCODE_G;
	else if (streq(k, "h")) return SAPP_KEYCODE_H;
	else if (streq(k, "i")) return SAPP_KEYCODE_I;
	else if (streq(k, "j")) return SAPP_KEYCODE_J;
	else if (streq(k, "k")) return SAPP_KEYCODE_K;
	else if (streq(k, "l")) return SAPP_KEYCODE_L;
	else if (streq(k, "m")) return SAPP_KEYCODE_M;
	else if (streq(k, "n")) return SAPP_KEYCODE_N;
	else if (streq(k, "o")) return SAPP_KEYCODE_O;
	else if (streq(k, "p")) return SAPP_KEYCODE_P;
	else if (streq(k, "q")) return SAPP_KEYCODE_Q;
	else if (streq(k, "r")) return SAPP_KEYCODE_R;
	else if (streq(k, "s")) return SAPP_KEYCODE_S;
	else if (streq(k, "t")) return SAPP_KEYCODE_T;
	else if (streq(k, "u")) return SAPP_KEYCODE_U;
	else if (streq(k, "v")) return SAPP_KEYCODE_V;
	else if (streq(k, "w")) return SAPP_KEYCODE_W;
	else if (streq(k, "x")) return SAPP_KEYCODE_X;
	else if (streq(k, "y")) return SAPP_KEYCODE_Y;
	else if (streq(k, "z")) return SAPP_KEYCODE_Z;
	else if (streq(k, "1")) return SAPP_KEYCODE_1;
	else if (streq(k, "2")) return SAPP_KEYCODE_2;
	else if (streq(k, "3")) return SAPP_KEYCODE_3;
	else if (streq(k, "4")) return SAPP_KEYCODE_4;
	else if (streq(k, "5")) return SAPP_KEYCODE_5;
	else if (streq(k, "6")) return SAPP_KEYCODE_6;
	else if (streq(k, "7")) return SAPP_KEYCODE_7;
	else if (streq(k, "8")) return SAPP_KEYCODE_8;
	else if (streq(k, "9")) return SAPP_KEYCODE_9;
	else if (streq(k, "0")) return SAPP_KEYCODE_0;
	else if (streq(k, "-")) return SAPP_KEYCODE_MINUS;
	else if (streq(k, "=")) return SAPP_KEYCODE_EQUAL;
	else if (streq(k, "space")) return SAPP_KEYCODE_SPACE;
	else if (streq(k, ",")) return SAPP_KEYCODE_COMMA;
	else if (streq(k, ".")) return SAPP_KEYCODE_PERIOD;
	else if (streq(k, "/")) return SAPP_KEYCODE_SLASH;
	else if (streq(k, "[")) return SAPP_KEYCODE_LEFT_BRACKET;
	else if (streq(k, "]")) return SAPP_KEYCODE_RIGHT_BRACKET;
	else if (streq(k, "\\")) return SAPP_KEYCODE_BACKSLASH;
	else if (streq(k, ";")) return SAPP_KEYCODE_SEMICOLON;
	else if (streq(k, "enter")) return SAPP_KEYCODE_ENTER;
	else if (streq(k, "esc")) return SAPP_KEYCODE_ESCAPE;
	else if (streq(k, "backspace")) return SAPP_KEYCODE_BACKSPACE;
	else if (streq(k, "tab")) return SAPP_KEYCODE_TAB;
// 	else if (streq(k, "'")) return SAPP_KEYCODE_QUOTE;
	else if (streq(k, "`")) return SAPP_KEYCODE_GRAVE_ACCENT;
	else if (streq(k, "f1")) return SAPP_KEYCODE_F1;
	else if (streq(k, "f2")) return SAPP_KEYCODE_F2;
	else if (streq(k, "f3")) return SAPP_KEYCODE_F3;
	else if (streq(k, "f4")) return SAPP_KEYCODE_F4;
	else if (streq(k, "f5")) return SAPP_KEYCODE_F5;
	else if (streq(k, "f6")) return SAPP_KEYCODE_F6;
	else if (streq(k, "f7")) return SAPP_KEYCODE_F7;
	else if (streq(k, "f5")) return SAPP_KEYCODE_F5;
	else if (streq(k, "f6")) return SAPP_KEYCODE_F6;
	else if (streq(k, "f7")) return SAPP_KEYCODE_F7;
	else if (streq(k, "f8")) return SAPP_KEYCODE_F8;
	else if (streq(k, "f9")) return SAPP_KEYCODE_F9;
	else if (streq(k, "f10")) return SAPP_KEYCODE_F10;
	else if (streq(k, "f11")) return SAPP_KEYCODE_F11;
	else if (streq(k, "f12")) return SAPP_KEYCODE_F12;
	else if (streq(k, "right")) return SAPP_KEYCODE_RIGHT;
	else if (streq(k, "left")) return SAPP_KEYCODE_LEFT;
	else if (streq(k, "down")) return SAPP_KEYCODE_DOWN;
	else if (streq(k, "up")) return SAPP_KEYCODE_UP;
	else if (streq(k, "control")) return SAPP_KEYCODE_RIGHT_CONTROL;
	else return SAPP_KEYCODE_INVALID;
}

JSValue gloo_key_pressed(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_key_pressed_rep(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED || state == BTN_RPRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_key_down(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_PRESSED || state == BTN_RPRESSED || state == BTN_DOWN) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_key_released(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	const char *key = JS_ToCString(ctx, argv[0]);
	btn_state state = gctx.key_states[str_to_sapp_keycode(key)];
	JS_FreeCString(ctx, key);
	if (state == BTN_RELEASED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_mouse_pressed(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_PRESSED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_mouse_down(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_PRESSED || gctx.mouse_state == BTN_DOWN) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_mouse_released(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	if (gctx.mouse_state == BTN_RELEASED) {
		return JS_TRUE;
	}
	return JS_FALSE;
}

JSValue gloo_time(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.time);
}

JSValue gloo_dt(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.dt);
}

JSValue gloo_mouse_x(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.mouse_x);
}

JSValue gloo_mouse_y(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewFloat64(ctx, gctx.mouse_y);
}

JSValue gloo_width(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewInt32(ctx, sapp_width());
}

JSValue gloo_height(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	return JS_NewInt32(ctx, sapp_height());
}

JSValue gloo_quit(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {
	sapp_quit();
	return JS_UNDEFINED;
}

const JSCFunctionListEntry gctx_members[] = {
	JS_CFUNC_DEF("quit", 0, gloo_quit),
	JS_CFUNC_DEF("time", 0, gloo_time),
	JS_CFUNC_DEF("dt", 0, gloo_dt),
	JS_CFUNC_DEF("mouseX", 0, gloo_mouse_x),
	JS_CFUNC_DEF("mouseY", 0, gloo_mouse_y),
	JS_CFUNC_DEF("width", 0, gloo_width),
	JS_CFUNC_DEF("height", 0, gloo_height),
	JS_CFUNC_DEF("keyPressed", 1, gloo_key_pressed),
	JS_CFUNC_DEF("keyPressedRep", 1, gloo_key_pressed_rep),
	JS_CFUNC_DEF("keyDown", 1, gloo_key_down),
	JS_CFUNC_DEF("keyReleased", 1, gloo_key_released),
	JS_CFUNC_DEF("mousePressed", 0, gloo_mouse_pressed),
	JS_CFUNC_DEF("mouseDown", 0, gloo_mouse_down),
	JS_CFUNC_DEF("mouseReleased", 0, gloo_mouse_released),
};

JSValue gloo_run(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	gctx.js_ctx = ctx;

	gctx.g = JS_NewObject(ctx);

	JSValue gl = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, gl, gl_members, countof(gl_members));
	JS_SetPropertyStr(ctx, gctx.g, "gl", gl);
	JS_SetPropertyFunctionList(ctx, gctx.g, gctx_members, countof(gctx_members));

	JSValue conf = argv[0];
	gctx.js_init = JS_GetPropertyStr(ctx, conf, "init");
	gctx.js_frame = JS_GetPropertyStr(ctx, conf, "frame");
	const char *title = JS_ToCString(ctx, JS_GetPropertyStr(ctx, conf, "title"));
	int width, height;
	JS_ToInt32(ctx, &width, JS_GetPropertyStr(ctx, conf, "width"));
	JS_ToInt32(ctx, &height, JS_GetPropertyStr(ctx, conf, "height"));

	// TODO: you can only open an OpenGL window after 10sec you closed the last
	// one on my M1 / Big Sur, no idea why
	sapp_run(&(sapp_desc) {
		.width = width,
		.height = height,
		.window_title = title,
		.init_cb = init,
		.frame_cb = frame,
		.event_cb = event,
	});

	JS_FreeCString(ctx, title);

	return gctx.g;

}

// http://web.mit.edu/freebsd/head/contrib/wpa/src/utils/base64.c
char base64_table[65] = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

uint8_t *base64_decode(
	const char *src,
	size_t len,
	size_t *out_len
) {

	unsigned char dtable[256], *out, *pos, block[4], tmp;
	size_t i, count, olen;
	int pad = 0;

	memset(dtable, 0x80, 256);

	for (i = 0; i < sizeof(base64_table) - 1; i++) {
		dtable[base64_table[i]] = (unsigned char) i;
	}

	dtable['='] = 0;

	count = 0;

	for (i = 0; i < len; i++) {
		if (dtable[src[i]] != 0x80) {
			count++;
		}
	}

	if (count == 0 || count % 4) {
		return NULL;
	}

	olen = count / 4 * 3;
	pos = out = malloc(olen);

	if (out == NULL) {
		return NULL;
	}

	count = 0;

	for (i = 0; i < len; i++) {

		tmp = dtable[src[i]];

		if (tmp == 0x80) {
			continue;
		}

		if (src[i] == '=') {
			pad++;
		}

		block[count] = tmp;
		count++;

		if (count == 4) {
			*pos++ = (block[0] << 2) | (block[1] >> 4);
			*pos++ = (block[1] << 4) | (block[2] >> 2);
			*pos++ = (block[2] << 6) | block[3];
			count = 0;
			if (pad) {
				if (pad == 1)
					pos--;
				else if (pad == 2)
					pos -= 2;
				else {
					free(out);
					return NULL;
				}
				break;
			}
		}
	}

	*out_len = pos - out;

	return out;

}

JSValue gloo_read_text(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	JSValue pfuncs[2];
	JSValue promise = JS_NewPromiseCapability(ctx, pfuncs);

	const char *src = JS_ToCString(ctx, argv[0]);

	if (!src) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	char *content = read_text(src);

	if (!content) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	JSValue ret = JS_NewString(ctx, content);
	free(content);
	JS_Call(ctx, pfuncs[0], JS_UNDEFINED, 1, &ret);

	return promise;

}

JSValue gloo_read_bytes(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	JSValue pfuncs[2];
	JSValue promise = JS_NewPromiseCapability(ctx, pfuncs);

	const char *src = JS_ToCString(ctx, argv[0]);

	if (!src) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	size_t size;
	uint8_t *bytes = read_bytes(src, &size);

	if (!bytes) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	JSValue buf = JS_NewArrayBufferCopy(ctx, bytes, size);
	free(bytes);
	JS_Call(ctx, pfuncs[0], JS_UNDEFINED, 1, &buf);

	return promise;

}

// TODO: port window.ImageData?
JSValue gloo_load_img(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	JSValue pfuncs[2];
	JSValue promise = JS_NewPromiseCapability(ctx, pfuncs);

	size_t src_len;
	const char *src = JS_ToCStringLen(ctx, &src_len, argv[0]);

	if (!src) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	const char *dataurl_prefix = "data:";
	uint8_t *bytes;
	size_t size;

	if (strncmp(src, dataurl_prefix, strlen(dataurl_prefix)) == 0) {
		// base64
		const char *data_start = strchr(src, ',');
		bytes = base64_decode(data_start, src_len - (data_start - src), &size);
	} else {
		// file path
		bytes = read_bytes(src, &size);
	}

	JS_FreeCString(ctx, src);

	if (!bytes) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	int w, h;
	uint8_t *data = stbi_load_from_memory(bytes, size, &w, &h, NULL, 4);
	free(bytes);

	if (!data) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	JSValue buf = JS_NewArrayBufferCopy(ctx, data, w * h * 4);
	free(data);

	JSValue img = JS_NewObject(ctx);
	JS_SetPropertyStr(ctx, img, "width", JS_NewInt32(ctx, w));
	JS_SetPropertyStr(ctx, img, "height", JS_NewInt32(ctx, h));
	JS_SetPropertyStr(ctx, img, "data", buf);
	JS_Call(ctx, pfuncs[0], JS_UNDEFINED, 1, &img);

	return promise;

}

// TODO: port window.AudioBuffer?
JSValue gloo_load_audio(
	JSContext *ctx,
	JSValue this,
	int argc,
	JSValue *argv
) {

	JSValue pfuncs[2];
	JSValue promise = JS_NewPromiseCapability(ctx, pfuncs);

	size_t src_len;
	const char *src = JS_ToCStringLen(ctx, &src_len, argv[0]);

	if (!src) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	const char *dataurl_prefix = "data:";
	uint8_t *bytes;
	size_t size;

	if (strncmp(src, dataurl_prefix, strlen(dataurl_prefix)) == 0) {
		// base64
		const char *data_start = strchr(src, ',');
		bytes = base64_decode(data_start, src_len - (data_start - src), &size);
	} else {
		// file path
		bytes = read_bytes(src, &size);
	}

	JS_FreeCString(ctx, src);

	if (!bytes) {
		// TODO: err msg
		JS_Call(ctx, pfuncs[1], JS_UNDEFINED, 0, NULL);
		return promise;
	}

	// TODO: parse

	JS_Call(ctx, pfuncs[0], JS_UNDEFINED, 0, NULL);

	return promise;

}

const JSCFunctionListEntry gloo_members[] = {
	JS_CFUNC_DEF("run", 1, gloo_run),
	JS_CFUNC_DEF("loadImg", 1, gloo_load_img),
	JS_CFUNC_DEF("loadAudio", 1, gloo_load_audio),
	JS_CFUNC_DEF("readText", 1, gloo_read_text),
	JS_CFUNC_DEF("readBytes", 1, gloo_read_bytes),
};

JSValue console_print(
	JSContext *ctx,
	int argc,
	JSValue *argv,
	FILE *f
) {
	for(int i = 0; i < argc; i++) {
		if (i != 0) {
			fprintf(f, " ");
		}
		JS_PrintVal(ctx, f, argv[i]);
	}
	fprintf(f, "\n");
	return JS_UNDEFINED;
}

JSValue console_log(
	JSContext *ctx,
	JSValue this_val,
	int argc,
	JSValue *argv
) {
	return console_print(ctx, argc, argv, stdout);
}

JSValue console_error(
	JSContext *ctx,
	JSValue this_val,
	int argc,
	JSValue *argv
) {
	return console_print(ctx, argc, argv, stderr);
}

const JSCFunctionListEntry console_members[] = {
	JS_CFUNC_DEF("log", 1, console_log),
	JS_CFUNC_DEF("error", 1, console_error),
};

int main(int argc, char **argv) {

	if (argc < 2) {
		fprintf(stderr, "what file?\n");
		return EXIT_FAILURE;
	}

	JSRuntime *rt = JS_NewRuntime();

	if (rt == NULL) {
		fprintf(stderr, "failed to init quickjs runtime\n");
		return EXIT_FAILURE;
	}

	JSContext *ctx = JS_NewContext(rt);

	if (ctx == NULL) {
		fprintf(stderr, "failed to init quickjs ctx\n");
		return EXIT_FAILURE;
	}

	char *path = argv[1];
	char *code = read_text(path);

	if (!code) {
		fprintf(stderr, "failed to read %s\n", path);
		return EXIT_FAILURE;
	}

	JSValue gobj = JS_GetGlobalObject(ctx);

	JSValue gloo = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, gloo, gloo_members, countof(gloo_members));
	JS_SetPropertyStr(ctx, gobj, "gloo", gloo);

	JSValue console = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, console, console_members, countof(console_members));
	JS_SetPropertyStr(ctx, gobj, "console", console);

	JSValue res = JS_Eval(ctx, code, strlen(code), path, JS_EVAL_TYPE_GLOBAL);

	if (JS_IsException(res)) {
		JS_DumpErr(ctx);
		return EXIT_FAILURE;
	}

	JS_HandleTasks(ctx);

	return EXIT_SUCCESS;

}
