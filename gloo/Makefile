CC := cc

CFLAGS += -Iext
CFLAGS += -ObjC

LDFLAGS += -Lext
LDFLAGS += -lquickjs
LDFLAGS += -framework Cocoa
LDFLAGS += -framework OpenGL

gloo: main.c gloo.c gl.c console.c
	$(CC) $(CFLAGS) $(LDFLAGS) $^ -o $@
