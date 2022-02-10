## Basic Setup

1. `npm run setup` to setup first time (to install dev dependencies, and site dependencies)
1. `npm run dev` to watch & build lib and the website (the website might take some time to build)
1. The entry point is `src/kaboom.ts`, editting any files referenced will trigger rebuild
1. Go to http://localhost:3000/play
1. Edit demos in `demo/` to test
1. Make sure not to break any existing demos
1. Remember to `npm run check` to check typescript, `npm run lint` to check eslint before commit, or use `npm run fmt` to auto format with eslint

## Documentation

Most kaboom docs are written in `src/types.ts` as jsDoc above each entry. Help on improving the documentation is appreciated!

- Typo / wrong / missing information
- Necessary `@example`, `@param`, `@return`, `@since`, `@deprecated` tags

Doc rendered on the website is built through `npm run build` command. This will generate a `site/doc.json` which contains all the documentation information.

To view the built documentation, use `npm run site`. Or if you want to preview changes as you're editing, use `npm run devsite` instead, then `npm run build` should trigger refresh the page with updated content.

## Demo

Kaboom uses a lot of demos / examples to teach people how to use. Each demo is a `.js` file under `demo/`. There're currently 2 types of demos:

- **Learn** demos that teaches basic kaboom concepts. We try to keep each one teach one thing and teach it well.
- **Game** demos that showcases kaboom's strength and elegance. We try to keep these FUN and compact.

The demo roster wants to be sufficient and compact. Feel free to improve / document existing ones, or submit new ones if you think it's helpful.

To test demos, run `npm run dev`, go to `http://localhost:3000/play` and use the dropdown menu to navigate, or use `http://localhost:3000/demo/${name}` for a fullscreen view for a specific demo.

## Pull Request

When your PR is ready for review, add the `boop` tag so we'll know it's ready!
