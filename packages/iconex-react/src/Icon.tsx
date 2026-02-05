import { forwardRef, createElement } from 'react';
import type { SVGAttributes } from 'react';
import type { IconNode, IconNodeChild, IconCategory, IconVariant, IconData, IconMeta } from 'iconex';
import { useIconexContext } from './IconexProvider';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
  /** Icon size in pixels (sets both width and height) */
  size?: number | string;
  /** Icon color */
  color?: string;
  /** Override stroke width for stroke-based icons */
  strokeWidth?: number | string;
  /** Icon variant */
  variant?: IconVariant;
  /** Icon category */
  category?: IconCategory;
  /** Absolute stroke width (not affected by size scaling) */
  absoluteStrokeWidth?: boolean;
}

export interface InternalIconProps extends IconProps {
  __iconData: IconData;
  __iconMeta: IconMeta;
}

/** Convert SVG attribute names to React-compatible camelCase */
const SVG_ATTR_MAP: Record<string, string> = {
  'fill-rule': 'fillRule',
  'clip-rule': 'clipRule',
  'clip-path': 'clipPath',
  'stroke-width': 'strokeWidth',
  'stroke-linecap': 'strokeLinecap',
  'stroke-linejoin': 'strokeLinejoin',
  'stroke-miterlimit': 'strokeMiterlimit',
  'stroke-dasharray': 'strokeDasharray',
  'stroke-dashoffset': 'strokeDashoffset',
  'stroke-opacity': 'strokeOpacity',
  'fill-opacity': 'fillOpacity',
  'font-size': 'fontSize',
  'font-family': 'fontFamily',
  'font-weight': 'fontWeight',
  'text-anchor': 'textAnchor',
  'text-decoration': 'textDecoration',
  'dominant-baseline': 'dominantBaseline',
  'alignment-baseline': 'alignmentBaseline',
  'color-interpolation-filters': 'colorInterpolationFilters',
  'flood-color': 'floodColor',
  'flood-opacity': 'floodOpacity',
  'stop-color': 'stopColor',
  'stop-opacity': 'stopOpacity',
};

/** Parse inline style string to React style object */
function parseStyleToObject(style: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const part of style.split(';')) {
    const [prop, val] = part.split(':').map(s => s.trim());
    if (prop && val) {
      // Convert CSS property to camelCase (e.g., mask-type -> maskType)
      const camelProp = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      result[camelProp] = val;
    }
  }
  return result;
}

function toReactAttrs(attrs: Record<string, string>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'style') {
      result.style = parseStyleToObject(value);
    } else {
      result[SVG_ATTR_MAP[key] ?? key] = value;
    }
  }
  return result;
}

function renderIconNode(node: IconNodeChild, index: number): React.ReactNode {
  const [tag, attrs] = node;
  const children = node.length === 3 ? node[2] : undefined;
  const reactAttrs = toReactAttrs(attrs);

  if (children && children.length > 0) {
    return createElement(
      tag,
      { key: index, ...reactAttrs },
      ...children.map((child, i) => renderIconNode(child, i)),
    );
  }
  return createElement(tag, { key: index, ...reactAttrs });
}

function renderIconNodes(nodes: IconNode): React.ReactNode[] {
  return nodes.map((node, index) => renderIconNode(node, index));
}

const Icon = forwardRef<SVGSVGElement, InternalIconProps>(
  (
    {
      __iconData,
      __iconMeta,
      size,
      color,
      strokeWidth,
      variant,
      category,
      absoluteStrokeWidth = false,
      className,
      style,
      ...restProps
    },
    ref,
  ) => {
    const context = useIconexContext();

    const resolvedSize = size ?? context.size ?? 24;
    const resolvedColor = color ?? context.color ?? 'currentColor';
    const resolvedCategory =
      category ?? context.category ?? __iconMeta.defaultCategory;
    const resolvedVariant =
      variant ?? context.variant ?? __iconMeta.defaultVariant;
    const resolvedStrokeWidth = strokeWidth ?? context.strokeWidth;

    const categoryData = __iconData[resolvedCategory];
    const iconNodes = categoryData?.[resolvedVariant];

    if (!iconNodes) {
      return null;
    }

    const computedStrokeWidth =
      resolvedStrokeWidth !== undefined
        ? absoluteStrokeWidth
          ? (Number(resolvedStrokeWidth) * 24) / Number(resolvedSize)
          : resolvedStrokeWidth
        : undefined;

    const classes = ['iconex', `iconex-${__iconMeta.name}`, className]
      .filter(Boolean)
      .join(' ');

    return createElement(
      'svg',
      {
        ref,
        xmlns: 'http://www.w3.org/2000/svg',
        width: resolvedSize,
        height: resolvedSize,
        viewBox: __iconMeta.viewBox,
        fill: 'none',
        strokeWidth: computedStrokeWidth,
        className: classes,
        style: { color: resolvedColor, ...style },
        'aria-hidden': 'true',
        ...restProps,
      },
      ...renderIconNodes(iconNodes),
    );
  },
);

Icon.displayName = 'Icon';
export default Icon;
