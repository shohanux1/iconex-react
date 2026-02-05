/** A single SVG element: [tagName, attributes] or [tagName, attributes, children] */
export type IconNodeChild =
  | readonly [elementName: string, attributes: Record<string, string>]
  | readonly [elementName: string, attributes: Record<string, string>, children: readonly IconNodeChild[]];

/** Array of SVG child elements representing an icon */
export type IconNode = readonly IconNodeChild[];

/** The 3 icon categories */
export type IconCategory = 'regular' | 'sharp' | 'curved';

/** The 6 icon variants */
export type IconVariant =
  | 'bold'
  | 'bulk'
  | 'light-border'
  | 'light-outline'
  | 'broken'
  | 'two-tone';

/**
 * Icon data map: category → variant → SVG nodes.
 * Not all combinations are required.
 */
export type IconData = Partial<
  Record<IconCategory, Partial<Record<IconVariant, IconNode>>>
>;

/** Metadata for an icon */
export interface IconMeta {
  name: string;
  viewBox: string;
  defaultCategory: IconCategory;
  defaultVariant: IconVariant;
}

/** Complete icon definition exported from the core package */
export interface IconDefinition {
  meta: IconMeta;
  data: IconData;
}
