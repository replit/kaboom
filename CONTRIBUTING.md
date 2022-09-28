## Developing Kaboom

1. `npm install` to install dev packages
1. `npm run dev` to start dev server
1. Go to http://localhost:8000/
1. Pick on example to test and edit the corresponding `/examples/[name].js`, or create a new file under `/examples` to test anything you're working on
1. The source entry point is `src/kaboom.ts`, editting any files referenced will automatically trigger rebuild
1. Make sure not to break any existing examples
1. Before commit `npm run check` to check typescript, `npm run lint` to check eslint before commit, or use `npm run fmt` to auto format with eslint

## Documentation

Most kaboom docs are written in `src/types.ts` as jsDoc above each entry. Help on improving the documentation is appreciated!

Documentations are rendered on the kaboom website under `/site`. To build the website

- `npm run build` to build kaboom and generate `site/doc.json`
- `cd site`
- `npm install` if haven't already
- `npm run dev` to start nextjs dev server
- go to http://localhost:3000
