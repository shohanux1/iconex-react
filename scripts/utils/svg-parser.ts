import { Parser } from 'htmlparser2';

type NodeTuple =
  | [string, Record<string, string>]
  | [string, Record<string, string>, NodeTuple[]];

export interface ParseResult {
  nodes: NodeTuple[];
  viewBox: string;
}

/**
 * Check if a color value is black (#000, #000000, black).
 * These get replaced with currentColor so icons can inherit CSS color.
 */
function isBlackColor(value: string): boolean {
  const v = value.trim().toLowerCase();
  return v === '#000' || v === '#000000' || v === 'black';
}

/**
 * Replace url(#id) references in an attribute value with prefixed versions.
 */
function prefixUrlRefs(value: string, idPrefix: string): string {
  return value.replace(/url\(#([^)]+)\)/g, `url(#${idPrefix}$1)`);
}

/** Clean attributes: remove irrelevant attrs, replace black with currentColor, prefix IDs */
function cleanAttributes(attrs: Record<string, string>, idPrefix: string): Record<string, string> {
  const clean: Record<string, string> = {};
  for (const [key, value] of Object.entries(attrs)) {
    const keyLower = key.toLowerCase();
    if (
      keyLower === 'xmlns' ||
      keyLower === 'class' ||
      keyLower === 'data-name' ||
      keyLower.startsWith('xmlns:')
    ) {
      continue;
    }
    // Prefix id attributes to avoid collisions between icons
    if (keyLower === 'id') {
      clean[key] = `${idPrefix}${value}`;
    } else if ((key === 'fill' || key === 'stroke') && isBlackColor(value)) {
      clean[key] = 'currentColor';
    } else if (keyLower === 'style' && value.includes('mask-type')) {
      // Preserve mask-type style as it's needed for mask rendering
      clean[key] = value;
    } else if (keyLower === 'style') {
      continue;
    } else {
      // Prefix any url(#...) references in attribute values
      clean[key] = prefixUrlRefs(value, idPrefix);
    }
  }
  return clean;
}

/**
 * Parse an SVG string and extract all child elements as a tree of
 * [tag, attributes] or [tag, attributes, children] tuples.
 * Strips the outer <svg> wrapper.
 *
 * @param svgString The raw SVG markup
 * @param idPrefix  A unique prefix for IDs to avoid collisions (e.g., "ix-bag-r-lo-")
 */
export function parseSvgToIconNodes(svgString: string, idPrefix: string = ''): ParseResult {
  let viewBox = '0 0 24 24';
  let insideSvg = false;

  // Stack-based tree builder: each entry is the children array of its parent
  const rootChildren: NodeTuple[] = [];
  const stack: NodeTuple[][] = [];

  const parser = new Parser({
    onopentag(name, attrs) {
      if (name.toLowerCase() === 'svg') {
        insideSvg = true;
        if (attrs.viewBox || attrs.viewbox) {
          viewBox = attrs.viewBox || attrs.viewbox;
        }
        return;
      }

      if (!insideSvg) return;

      const tag = name.toLowerCase();
      const cleanAttrs = cleanAttributes(attrs, idPrefix);
      const node: NodeTuple = [tag, cleanAttrs];
      const children: NodeTuple[] = [];

      // Add this node to the current parent's children
      const parent = stack.length > 0 ? stack[stack.length - 1] : rootChildren;
      parent.push(node);

      // Push a new children array for this node onto the stack
      stack.push(children);
    },
    onclosetag(name) {
      if (name.toLowerCase() === 'svg') {
        insideSvg = false;
        return;
      }

      if (!insideSvg) return;

      // Pop this node's children from the stack
      const children = stack.pop();
      if (!children) return;

      // If this node has children, convert it from [tag, attrs] to [tag, attrs, children]
      if (children.length > 0) {
        const parent = stack.length > 0 ? stack[stack.length - 1] : rootChildren;
        const node = parent[parent.length - 1];
        // Replace the 2-tuple with a 3-tuple including children
        parent[parent.length - 1] = [node[0], node[1], children];
      }
    },
  }, { xmlMode: true });

  parser.write(svgString);
  parser.end();

  return { nodes: rootChildren, viewBox };
}
