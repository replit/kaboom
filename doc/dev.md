# Developing Kaboom

To start developing Kaboom, first clone the github repo

```sh
$ git clone https://github.com/replit/kaboom
```

Run the `setup` command to install the dev packages

```sh
$ npm run setup
```

Then run the `dev` command to start the dev server

```sh
$ npm run dev
```

This will start a server that serves the kaboom website, and build the source files on file change.

As you're making changes to kaboom source under `src/`, go to [http://localhost:8000/demo](http://localhost:8000/demo) and edit or create demos under `demo/` to test whatever you're changing.

Also remember to run `check` to check for typescript errors and linting.

```sh
$ npm run check
```

## Folder structure

- `blog/` blog posts
- `dist/` built distribution files
- `doc/` various documentations
- `examples/` examples
- `pkgs/` other related packages such `kaboom-create`
- `scripts/` development scripts
- `site/` kaboom website source code
- `sprites/` some examples sprites
- `src/` kaboom library source code
## Source code overview

(todo)
