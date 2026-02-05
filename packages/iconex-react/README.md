# Iconex React

Beautiful, customizable icon components for React and Next.js.

## Features

- 130+ icons with named exports
- 3 categories: `regular`, `sharp`, `curved`
- 6 variants: `bold`, `bulk`, `light-border`, `light-outline`, `broken`, `two-tone`
- Customizable color, size, and stroke width via props or CSS
- `IconexProvider` for global defaults
- Full TypeScript support with autocompletion
- Tree-shakable — only bundles icons you use

## Installation

```bash
npm install iconex-react
# or
pnpm add iconex-react
# or
yarn add iconex-react
```

## Quick Start

```tsx
import { Home, Search, Heart } from 'iconex-react';

function App() {
  return (
    <div>
      <Home />
      <Search variant="bold" />
      <Heart color="red" size={32} />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `size` | `number \| string` | `24` | Icon width and height in pixels |
| `color` | `string` | `currentColor` | Icon color (inherits from CSS) |
| `variant` | `IconVariant` | `light-outline` | Icon style variant |
| `category` | `IconCategory` | `regular` | Icon design category |
| `strokeWidth` | `number \| string` | — | Override stroke width |
| `className` | `string` | — | Additional CSS classes |

All standard SVG attributes are also supported.

## Variants

```tsx
<Home variant="bold" />
<Home variant="bulk" />
<Home variant="light-border" />
<Home variant="light-outline" />
<Home variant="broken" />
<Home variant="two-tone" />
```

## Categories

```tsx
<Home category="regular" />
<Home category="sharp" />
<Home category="curved" />
```

## Color

```tsx
// Via color prop
<Home color="red" />
<Home color="#3B82F6" />

// Via CSS className (works with Tailwind)
<Home className="text-blue-500" />

// Via CSS inheritance
<div style={{ color: 'purple' }}>
  <Home /> {/* renders purple */}
</div>
```

## Size

```tsx
<Home size={16} />
<Home size={24} />
<Home size={32} />
<Home size={48} />
```

## IconexProvider

Set global defaults for all icons:

```tsx
import { IconexProvider, Home, Search, Heart } from 'iconex-react';

function App() {
  return (
    <IconexProvider
      category="sharp"
      variant="bold"
      color="#3B82F6"
      size={24}
    >
      <Home />    {/* sharp / bold / blue / 24px */}
      <Search />  {/* sharp / bold / blue / 24px */}
      <Heart color="red" /> {/* sharp / bold / red (overrides) / 24px */}
    </IconexProvider>
  );
}
```

## Available Icons

Activity, AddUser, ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Avatar, Bag, Bookmark, Buy, Calendar, Call, Camera, Card, Category, Chart, Chat, CloseSquare, Danger, Delete, Discount, Discovery, Document, Download, Edit, Emoji, Filter, Folder, Game, Graph, Heart, Hide, Home, Image, InfoCircle, InfoSquare, Location, Lock, Login, Logout, Message, MoreCircle, MoreSquare, Notification, Paper, Password, Play, Plus, Profile, Scan, Search, Send, Setting, ShieldDone, ShieldFail, Show, Star, Swap, TickSquare, Ticket, TicketStar, TimeCircle, TimeSquare, Unlock, Upload, Video, Voice, VolumeDown, VolumeOff, VolumeUp, Wallet, Work, and more...

## License

MIT
