import { readdirSync, mkdirSync, renameSync, existsSync, rmSync } from 'fs';
import { join, parse } from 'path';

const ICONS_DIR = 'icons';

/**
 * Convert a file name like "Arrow - Down 2.svg" to kebab-case "arrow-down-2"
 */
function toKebabCase(fileName: string): string {
  const name = parse(fileName).name; // strip .svg
  return name
    .replace(/\s*-\s*/g, '-')   // "Arrow - Down" → "Arrow-Down"
    .replace(/\s+/g, '-')       // "Arrow Down" → "Arrow-Down"
    .replace(/([a-z])([A-Z])/g, '$1-$2') // "InfoCircle" → "Info-Circle" (just in case)
    .toLowerCase();
}

function main() {
  // Find category folders at icons/ level (capitalized ones like "Regular", "Sharp", "Curved")
  const topLevel = readdirSync(ICONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const categoryDirs = topLevel.filter((d) =>
    ['regular', 'sharp', 'curved'].includes(d.name.toLowerCase()),
  );

  if (categoryDirs.length === 0) {
    console.log('No category folders (Regular/Sharp/Curved) found at top level. Nothing to reorganize.');
    return;
  }

  let moved = 0;

  for (const catDir of categoryDirs) {
    const category = catDir.name.toLowerCase(); // "Regular" → "regular"
    const catPath = join(ICONS_DIR, catDir.name);

    // Find variant folders inside the category (Bold, Bulk, etc.)
    const variantDirs = readdirSync(catPath, { withFileTypes: true })
      .filter((d) => d.isDirectory());

    // Map folder names to canonical variant names
    const VARIANT_MAP: Record<string, string> = {
      'light': 'light-border',
      'light border': 'light-border',
      'light-border': 'light-border',
      'outline': 'light-outline',
      'light outline': 'light-outline',
      'light-outline': 'light-outline',
      'two tone': 'two-tone',
      'two-tone': 'two-tone',
      'twotone': 'two-tone',
    };

    for (const varDir of variantDirs) {
      const rawVariant = varDir.name.toLowerCase(); // "Bold" → "bold"
      const variant = VARIANT_MAP[rawVariant] ?? rawVariant;
      const varPath = join(catPath, varDir.name);

      // Find all SVG files
      const svgFiles = readdirSync(varPath).filter((f) =>
        f.toLowerCase().endsWith('.svg'),
      );

      for (const svgFile of svgFiles) {
        const iconName = toKebabCase(svgFile);
        const destDir = join(ICONS_DIR, iconName, category);
        const destFile = join(destDir, `${variant}.svg`);

        mkdirSync(destDir, { recursive: true });
        renameSync(join(varPath, svgFile), destFile);
        moved++;
      }
    }

    // Clean up the now-empty category directory
    rmSync(catPath, { recursive: true, force: true });
    console.log(`Removed empty directory: ${catPath}`);
  }

  console.log(`Reorganized ${moved} SVG files into icon-first structure.`);
}

main();
