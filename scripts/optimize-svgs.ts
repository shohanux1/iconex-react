import { readFileSync, writeFileSync } from 'fs';
import { optimize } from 'svgo';
import { getAllSvgPaths } from './utils/file-utils';

const ICONS_DIR = 'icons';

const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          removeViewBox: false,
        },
      },
    },
    'removeDimensions',
    { name: 'removeAttrs', params: { attrs: ['class', 'data-name'] } },
    'convertStyleToAttrs',
    'sortAttrs',
  ],
};

async function main() {
  const svgPaths = getAllSvgPaths(ICONS_DIR);

  if (svgPaths.length === 0) {
    console.log('No SVG files found in icons/ directory.');
    return;
  }

  let optimized = 0;
  for (const svgPath of svgPaths) {
    const raw = readFileSync(svgPath, 'utf8');
    const result = optimize(raw, { ...svgoConfig, path: svgPath });
    writeFileSync(svgPath, result.data, 'utf8');
    optimized++;
  }

  console.log(`Optimized ${optimized} SVG files.`);
}

main().catch(console.error);
