# Iconex

Framework-agnostic icon data library with multiple categories and variants.

## Overview

Iconex provides SVG icon data as lightweight `[tag, attributes]` tuples. It serves as the core data layer — use it with any framework or with the official [iconex-react](https://www.npmjs.com/package/iconex-react) wrapper.

- 130+ icons
- 3 categories: `regular`, `sharp`, `curved`
- 6 variants: `bold`, `bulk`, `light-border`, `light-outline`, `broken`, `two-tone`
- Full TypeScript support
- Tree-shakable (ESM + CJS)

## Installation

```bash
npm install iconex
# or
pnpm add iconex
# or
yarn add iconex
```

## Usage

```typescript
import HomeData from 'iconex/icons/home';

console.log(HomeData.meta);
// { name: 'home', viewBox: '0 0 24 24', defaultCategory: 'regular', defaultVariant: 'light-outline' }

console.log(HomeData.data.regular?.bold);
// [["path", { "fill": "currentColor", "d": "..." }]]
```

## Types

```typescript
import type {
  IconDefinition,
  IconCategory,   // 'regular' | 'sharp' | 'curved'
  IconVariant,     // 'bold' | 'bulk' | 'light-border' | 'light-outline' | 'broken' | 'two-tone'
  IconNode,        // Array of SVG element tuples
  IconNodeChild,   // [tag, attrs] or [tag, attrs, children]
} from 'iconex';
```

## For React / Next.js

Use [iconex-react](https://www.npmjs.com/package/iconex-react) for ready-to-use React components:

```bash
pnpm add iconex-react
```

```tsx
import { Home } from 'iconex-react';

<Home variant="bold" category="sharp" color="red" size={32} />
```

## License

MIT
