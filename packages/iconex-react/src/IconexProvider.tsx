import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import type { IconCategory, IconVariant } from 'iconex';

export interface IconexContextValue {
  /** Default category for all icons under this provider */
  category?: IconCategory;
  /** Default variant for all icons under this provider */
  variant?: IconVariant;
  /** Default size */
  size?: number | string;
  /** Default color */
  color?: string;
  /** Default stroke width */
  strokeWidth?: number | string;
}

const IconexContext = createContext<IconexContextValue>({});

export function useIconexContext(): IconexContextValue {
  return useContext(IconexContext);
}

export interface IconexProviderProps extends IconexContextValue {
  children: ReactNode;
}

/**
 * Provides default icon props to all iconex-react icons within its tree.
 *
 * @example
 * ```tsx
 * <IconexProvider category="sharp" variant="bold" size={20}>
 *   <Home />
 *   <Search variant="broken" />
 * </IconexProvider>
 * ```
 */
export function IconexProvider({ children, ...value }: IconexProviderProps) {
  return (
    <IconexContext.Provider value={value}>{children}</IconexContext.Provider>
  );
}
