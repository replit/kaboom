# create-kaboom

a script to help you start a kaboom project in no time

```
USAGE

  $ create-kaboom [OPTIONS] <dir>

    or

  $ npm init kaboom -- [OPTIONS] <dir>

OPTIONS

  -h, --help             Print this message
  -t, --typescript       Use TypeScript
  -s, --start            Start the dev server right away
      --no-hmr           Don't use vite hmr / hot reload
  -d, --demo <name>      Start from a demo listed on kaboomjs.com/play
      --spaces <num>     Use spaces instead of tabs for generated files
  -v, --version <label>  Use a specific kaboom version (default latest)

EXAMPLE

  # quick start with default config
  $ npm init kaboom mygame

  # need to put all args after -- if using with npm init
  $ npm init kaboom -- --typescript --demo burp mygame

  # if installed locally you don't need to use -- when passing options
  $ create-kaboom -t -s -d burp mygame
```
