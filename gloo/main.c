#include "utils.h"

#include <stdlib.h>
#include <string.h>

#include <quickjs.h>

void console_init(JSContext *ctx);
void gloo_init(JSContext *ctx);

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

	gloo_init(ctx);
	console_init(ctx);

	JSValue result = JS_Eval(ctx, code, strlen(code), path, JS_EVAL_TYPE_GLOBAL);

	if (JS_IsException(result)) {
		fprintf(stderr, "%s\n", JS_ToCString(ctx, JS_GetException(ctx)));
	}

	free(code);

	return EXIT_SUCCESS;

}
