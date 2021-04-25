#ifndef UTILS_H
#define UTILS_H

#include <quickjs.h>
#include <stdbool.h>

#define countof(x) (sizeof(x) / sizeof((x)[0]))

char *read_file(const char *path);

JSValue JS_ECall(
	JSContext *ctx,
	JSValue func,
	JSValue this,
	int nargs,
	JSValueConst *argv
);

bool JS_CheckNargs(
	JSContext *ctx,
	int expected,
	int actual
);

#endif
