import { forwardRef, createElement } from 'react';
import type { IconDefinition } from 'iconex';
import Icon from './Icon';
import type { IconProps } from './Icon';

/**
 * Creates a named icon component from an IconDefinition.
 * Used by generated icon files.
 */
const createIconexIcon = (iconName: string, iconDef: IconDefinition) => {
  const Component = forwardRef<SVGSVGElement, IconProps>((props, ref) =>
    createElement(Icon, {
      ref,
      __iconData: iconDef.data,
      __iconMeta: iconDef.meta,
      ...props,
    }),
  );

  Component.displayName = iconName;
  return Component;
};

export default createIconexIcon;
