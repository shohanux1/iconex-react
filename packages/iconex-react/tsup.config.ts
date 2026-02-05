import { defineConfig } from 'tsup';
import { readdirSync, existsSync } from 'fs';

const iconsDir = 'src/icons';
const iconFiles = existsSync(iconsDir)
  ? readdirSync(iconsDir)
      .filter((f) => f.endsWith('.tsx'))
      .map((f) => `${iconsDir}/${f}`)
  : [];

export default defineConfig({
  entry: ['src/index.ts', 'src/dynamicIconImports.ts', ...iconFiles],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  outDir: 'dist',
  treeshake: true,
  sourcemap: true,
  external: ['react', 'react-dom', 'iconex'],
  esbuildOptions(options) {
    options.jsx = 'automatic';
  },
});
