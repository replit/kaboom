CC := cc

CFLAGS += -Iext
CFLAGS += -ObjC

LDFLAGS += -Lext
LDFLAGS += -lquickjs
LDFLAGS += -framework Cocoa
LDFLAGS += -framework OpenGL

kaboom: main.c gl.c
	$(CC) $(CFLAGS) $(LDFLAGS) $^ -o $@
