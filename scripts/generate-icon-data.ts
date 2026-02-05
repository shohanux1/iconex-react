import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { parseSvgToIconNodes } from './utils/svg-parser';
import { toPascalCase } from './utils/naming';
import {
  getAllIconNames,
  getCategoriesForIcon,
  getVariantsForCategory,
  readSvgFile,
} from './utils/file-utils';

const ICONS_DIR = 'icons';
const OUTPUT_DIR = join('packages', 'iconex', 'src', 'icons');

function main() {
  // Ensure output directory exists
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const iconNames = getAllIconNames(ICONS_DIR);

  if (iconNames.length === 0) {
    console.log('No icons found in icons/ directory.');
    return;
  }

  // Clean old generated files that no longer have source icons
  if (existsSync(OUTPUT_DIR)) {
    const existingFiles = readdirSync(OUTPUT_DIR).filter((f) =>
      f.endsWith('.ts'),
    );
    for (const file of existingFiles) {
      const name = file.replace('.ts', '');
      if (!iconNames.includes(name)) {
        unlinkSync(join(OUTPUT_DIR, file));
      }
    }
  }

  for (const iconName of iconNames) {
    const pascalName = toPascalCase(iconName);
    const categories = getCategoriesForIcon(ICONS_DIR, iconName);

    let viewBox = '0 0 24 24';
    const dataEntries: string[] = [];

    for (const category of categories) {
      const variants = getVariantsForCategory(ICONS_DIR, iconName, category);
      const variantEntries: string[] = [];

      for (const variant of variants) {
        const svgContent = readSvgFile(ICONS_DIR, iconName, category, variant);
        const parsed = parseSvgToIconNodes(svgContent);
        viewBox = parsed.viewBox;

        const nodesStr = JSON.stringify(parsed.nodes, null, 6)
          .split('\n')
          .map((line, i) => (i === 0 ? line : '      ' + line))
          .join('\n');

        variantEntries.push(`      '${variant}': ${nodesStr}`);
      }

      if (variantEntries.length > 0) {
        dataEntries.push(
          `    ${category}: {\n${variantEntries.join(',\n')},\n    }`,
        );
      }
    }

    // Determine default category/variant (first available)
    const defaultCategory = categories[0] || 'regular';
    const firstVariants = getVariantsForCategory(
      ICONS_DIR,
      iconName,
      defaultCategory,
    );
    const defaultVariant =
      firstVariants.includes('light-outline')
        ? 'light-outline'
        : firstVariants[0] || 'bold';

    const fileContent = `import type { IconDefinition } from '../types';

const ${pascalName}: IconDefinition = {
  meta: {
    name: '${iconName}',
    viewBox: '${viewBox}',
    defaultCategory: '${defaultCategory}',
    defaultVariant: '${defaultVariant}',
  },
  data: {
${dataEntries.join(',\n')},
  },
};

export default ${pascalName};
`;

    writeFileSync(join(OUTPUT_DIR, `${iconName}.ts`), fileContent, 'utf8');
  }

  console.log(`Generated ${iconNames.length} icon data files.`);
}

main();
