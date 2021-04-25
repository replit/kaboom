#include "utils.h"

#include <stdio.h>
#include <quickjs.h>

static JSValue js_print(
	JSContext *ctx,
	int argc,
	JSValueConst *argv,
	FILE *output
) {

	for(int i = 0; i < argc; i++) {
		if (i != 0) {
			fprintf(output, " ");
		}
		size_t len;
		const char *str = JS_ToCStringLen(ctx, &len, argv[i]);
		if (!str) {
			return JS_EXCEPTION;
		}
		fprintf(output, "%.*s", (int)len, str);
		JS_FreeCString(ctx, str);
	}

	fprintf(output, "\n");

	return JS_UNDEFINED;

}

static JSValue console_log(
	JSContext *ctx,
	JSValueConst this_val,
	int argc,
	JSValueConst *argv
) {
	return js_print(ctx, argc, argv, stdout);
}

static JSValue console_error(
	JSContext *ctx,
	JSValueConst this_val,
	int argc,
	JSValueConst *argv
) {
	return js_print(ctx, argc, argv, stderr);
}

static const JSCFunctionListEntry console_fields[] = {
	JS_CFUNC_DEF("log", 1, console_log),
	JS_CFUNC_DEF("error", 1, console_error),
};

JSValue console_mod(JSContext *ctx) {
	JSValue console = JS_NewObject(ctx);
	JS_SetPropertyFunctionList(ctx, console, console_fields, countof(console_fields));
	return console;
}
