const assert = require('assert');
const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'rollup.config.ts');
const config = fs.readFileSync(configPath, 'utf8');

assert.match(
  config,
  /const productionOutputDir = 'prod';/,
  'rollup.config.ts should centralize production output in prod',
);

for (const outputFile of [
  "outputPath('js', 'app.js')",
  "outputPath('background.js')",
  "outputPath('contentScript.js')",
  "outputPath('injectedScript.js')",
]) {
  assert.ok(config.includes(outputFile), `missing ${outputFile}`);
}

for (const visualizerName of [
  "visualizerPath('app')",
  "visualizerPath('background')",
  "visualizerPath('contentScript')",
  "visualizerPath('injectedScript')",
]) {
  assert.ok(config.includes(visualizerName), `missing ${visualizerName}`);
}

assert.ok(!config.includes("'dist/"), 'rollup config should not write to dist/');
assert.ok(!config.includes("'stats-"), 'visualizer outputs should use kleo-* names');

