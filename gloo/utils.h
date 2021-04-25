#ifndef UTILS_H
#define UTILS_H

#include <quickjs.h>
#include <stdbool.h>

#define countof(x) (sizeof(x) / sizeof((x)[0]))

char *read_file(const char *path);
void JS_DumpErr(JSContext *ctx);

JSValue JS_ECall(
	JSContext *ctx,
	JSValue func,
	JSValue this,
	int nargs,
	JSValueConst *argv
);

JSValue JS_EEval(
	JSContext *ctx,
	const char *code,
	size_t code_len,
	const char *fname,
	int flags
);

bool JS_CheckNargs(
	JSContext *ctx,
	int expected,
	int actual
);

#endif
