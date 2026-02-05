# Iconex

Beautiful, open-source icons for React & Next.js. 130+ icons across 3 categories and 6 variants, fully tree-shakable.

[Browse Icons](https://iconex-home.vercel.app) | [npm: iconex](https://www.npmjs.com/package/iconex) | [npm: iconex-react](https://www.npmjs.com/package/iconex-react)

## Packages

| Package | Description |
|---------|-------------|
| [iconex](packages/iconex) | Framework-agnostic SVG icon data |
| [iconex-react](packages/iconex-react) | React components with props for variant, category, size, color |

## Quick Start

```bash
npm install iconex-react
```

```tsx
import { Home, Search, Heart } from 'iconex-react';

<Home />
<Search variant="bold" category="sharp" />
<Heart color="red" size={32} />
```

## Features

- 130+ icons with named exports
- 3 categories: `regular`, `sharp`, `curved`
- 6 variants: `bold`, `bulk`, `light-border`, `light-outline`, `broken`, `two-tone`
- `IconexProvider` for global defaults
- Full TypeScript support
- Tree-shakable (ESM + CJS) — only bundles icons you use
- Per-icon deep imports: `import Home from 'iconex-react/icons/Home'`

## Global Defaults

```tsx
import { IconexProvider, Home, Search } from 'iconex-react';

<IconexProvider category="sharp" variant="bold" size={20}>
  <Home />    {/* sharp / bold / 20px */}
  <Search />  {/* sharp / bold / 20px */}
</IconexProvider>
```

## Project Structure

```
iconex/
├── icons/                  Raw SVGs (source of truth)
│   └── home/
│       ├── regular/        bold.svg, bulk.svg, light-border.svg, ...
│       ├── sharp/
│       └── curved/
├── scripts/                Build & codegen scripts
├── packages/
│   ├── iconex/             Core SVG data (framework-agnostic)
│   └── iconex-react/       React wrapper components
```

## Development

```bash
pnpm install
pnpm build        # optimize SVGs → generate TS → compile
pnpm generate     # regenerate TS from SVGs (no compile)
```

## License

MIT
