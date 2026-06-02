# slim-extension

## Production build

Run `npm run build` to create the Chrome extension bundle in `prod/`.

The Rollup production build writes JavaScript, copied assets, and the generated
manifest into `prod/`. Bundle visualizer reports use the `kleo-*.html` prefix so
they are easy to distinguish from extension runtime files.

Run `npm run test:rollup-config` after changing `rollup.config.ts` to verify the
output folder and visualizer naming conventions.
