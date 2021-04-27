# gloo

a cross-platform + web-native JavaScript multimedia library

use the same JS code to run graphics applications / games natively in your browser, also natively on your OS (macOS, Windows, Linux, iOS, Android)

## Usage

### native

compile and use the `gloo` binary

```sh
$ make
$ ./gloo game.js
```

### browser

import `gloo.js` to your project

```html
<script src="gloo.js"></script>
<script src="game.js"></script>
```
(you do need to have a HTTP file server running to load files)

## Example

exampels are under `examples/`

to run on native:
```sh
$ make run
```

to run on browser:
```sh
$ python3 -m http.server
```
(or any other static serv)
then open http://localhost:8000/examples
