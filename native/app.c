#include "utils.h"

#include <quickjs.h>
#define SOKOL_GLCORE33
#define SOKOL_NO_ENTRY
#define SOKOL_APP_IMPL
#include <sokol_app.h>

static void init() {
}

static void frame() {
}

static void event(const sapp_event *ev) {
}

static void cleanup() {
}

static JSValue app_run(
	JSContext *ctx,
	JSValueConst this,
	int argc,
	JSValueConst *argv
) {

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

static const JSCFunctionListEntry app_fields[] = {
	JS_CFUNC_DEF("run", 0, app_run),
};

JSValue app_init(JSContext *ctx) {

	JSValue app = JS_NewObject(ctx);

	JS_SetPropertyFunctionList(ctx, app, app_fields, countof(app_fields));

	return app;

}
