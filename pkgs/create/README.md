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
  -d, --desktop          Enable packaging for desktop release (uses tauri and requires rust to be installed)
  -e, --example <name>   Start from a example listed on kaboomjs.com/play
      --spaces <level>   Use spaces instead of tabs for generated files
  -v, --version <label>  Use a specific kaboom version (default latest)

EXAMPLE

  # quick start with default config
  $ npm init kaboom mygame

  # need to put all args after -- if using with npm init
  $ npm init kaboom -- --typescript --example burp mygame

  # if installed locally you don't need to use -- when passing options
  $ create-kaboom -t -s -d burp mygame
  ```
