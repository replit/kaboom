#include <stdlib.h>
#include <string.h>

#include <quickjs.h>
#define SOKOL_GLCORE33
#define SOKOL_NO_ENTRY
#define SOKOL_APP_IMPL
#include <sokol_app.h>
#include <OpenGL/gl.h>

static void init() {
}

static void frame() {
}

static void event(const sapp_event *ev) {
}

static void cleanup() {
}

static JSValue app_init(JSContext *ctx, JSValueConst this, int argc, JSValueConst *argv) {

	sapp_run(&(sapp_desc) {
		.width = 640,
		.height = 480,
		.window_title = "kaboom",
		.init_cb = init,
		.frame_cb = frame,
		.cleanup_cb = cleanup,
		.event_cb = event,
	});

	return JS_UNDEFINED;

}

JSValue init_gl(JSContext *ctx);

static char *read_file(const char *path) {

	FILE *file = fopen(path, "r");

	if (!file) {
		fprintf(stderr, "failed to read: '%s'\n", path);
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
		fprintf(stderr, "failed to read: '%s'\n", path);
		return NULL;
	}

	fclose(file);

	return buffer;

}

int main(int argc, char **argv) {

	if (argc < 2) {
		fprintf(stderr, "nope\n");
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
	char *code = read_file(path);

	JSValue gobj = JS_GetGlobalObject(ctx);
    JS_SetPropertyStr(ctx, gobj, "appInit", JS_NewCFunction(ctx, app_init, "appInit", 0));

    JS_SetPropertyStr(ctx, gobj, "gl", init_gl(ctx));

	JSValue result = JS_Eval(ctx, code, strlen(code), "test.js", JS_EVAL_TYPE_GLOBAL);

	if (JS_IsException(result)) {
		fprintf(stderr, "%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
	}

	free(code);

	return EXIT_SUCCESS;

}
