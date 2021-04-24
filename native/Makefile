CC := cc

CFLAGS += -Iext
CFLAGS += -ObjC

LDFLAGS += -Lext
LDFLAGS += -lquickjs
LDFLAGS += -framework Cocoa
LDFLAGS += -framework OpenGL

kaboom: main.c app.c gl.c console.c
	$(CC) $(CFLAGS) $(LDFLAGS) $^ -o $@
