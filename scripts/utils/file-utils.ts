import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

export const CATEGORIES = ['regular', 'sharp', 'curved'] as const;
export const VARIANTS = [
  'bold',
  'bulk',
  'light-border',
  'light-outline',
  'broken',
  'two-tone',
] as const;

/**
 * Get all icon names from the icons/ directory.
 * Each subdirectory is an icon name.
 */
export function getAllIconNames(iconsDir: string): string[] {
  if (!existsSync(iconsDir)) return [];
  return readdirSync(iconsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

/**
 * Get available categories for a given icon.
 */
export function getCategoriesForIcon(
  iconsDir: string,
  iconName: string,
): string[] {
  const iconDir = join(iconsDir, iconName);
  return CATEGORIES.filter((cat) => existsSync(join(iconDir, cat)));
}

/**
 * Get available variants for a given icon + category.
 */
export function getVariantsForCategory(
  iconsDir: string,
  iconName: string,
  category: string,
): string[] {
  const catDir = join(iconsDir, iconName, category);
  if (!existsSync(catDir)) return [];
  return VARIANTS.filter((variant) =>
    existsSync(join(catDir, `${variant}.svg`)),
  );
}

/**
 * Read an SVG file for a specific icon/category/variant.
 */
export function readSvgFile(
  iconsDir: string,
  iconName: string,
  category: string,
  variant: string,
): string {
  return readFileSync(join(iconsDir, iconName, category, `${variant}.svg`), 'utf8');
}

/**
 * Get all SVG file paths recursively from the icons directory.
 */
export function getAllSvgPaths(iconsDir: string): string[] {
  const paths: string[] = [];
  const iconNames = getAllIconNames(iconsDir);

  for (const iconName of iconNames) {
    for (const category of CATEGORIES) {
      for (const variant of VARIANTS) {
        const svgPath = join(iconsDir, iconName, category, `${variant}.svg`);
        if (existsSync(svgPath)) {
          paths.push(svgPath);
        }
      }
    }
  }

  return paths;
}
