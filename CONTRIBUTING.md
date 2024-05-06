## Developing Kaboom

1. `npm install` to install dev packages.
1. `npm run dev` to start dev server.
   ~ _to run npm run dev on Windows:_ change `"dev": "NODE_ENV=development node scripts/dev.js"` to `"dev": "set NODE_ENV=development & node scripts/dev.js"`. **Make sure to change back to original before commit**.
1. Go to http://localhost:8000/
1. Pick on example to test and edit the corresponding `/examples/[name].js`, or create a new file under `/examples` to test anything you're working on.
1. The source entry point is `src/kaboom.ts`, editing any files referenced will automatically trigger rebuild. **Make sure not to break any existing examples**.
1. Before commit `npm run check` to check typescript, `npm run lint` to check eslint before commit, or use `npm run fmt` to auto format with eslint ~ _to run npm run lint on Windows:_ change `"linebreak-style": "[ "error", "unix" ]"` to `"linebreak-style": "[ "error", "windows" ]"` in `.eslintrc.json`. **Make sure to change back to original before commit**.
1. Make sure to disable Prettier (if you have it installed) as it will interfere with Kaboom's auto formatting. You can do so on a per project basis by creating a file at the root of the project named `.prettierignore` with the content `**`. **Make sure to not commit this file.**

## Documentation

Most kaboom docs are written in `src/types.ts` as [jsDoc](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) above each kaboom component entry. **Note: Kaboom's auto formatting doesn't format code blocks written in jsDoc. They need to be manually formatted like existing jsDoc code blocks.**

**Help on improving the documentation is appreciated! Thank you for contributing!**
