import { mkdirSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { toPascalCase } from './utils/naming';
import { getAllIconNames } from './utils/file-utils';

const ICONS_DIR = 'icons';
const OUTPUT_DIR = join('packages', 'iconex-react', 'src', 'icons');

function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const iconNames = getAllIconNames(ICONS_DIR);

  if (iconNames.length === 0) {
    console.log('No icons found. Skipping React component generation.');
    return;
  }

  // Clean old generated files
  if (existsSync(OUTPUT_DIR)) {
    const existingFiles = readdirSync(OUTPUT_DIR).filter((f) =>
      f.endsWith('.tsx'),
    );
    for (const file of existingFiles) {
      const name = file.replace('.tsx', '');
      const kebab = name
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .toLowerCase();
      if (!iconNames.includes(kebab)) {
        unlinkSync(join(OUTPUT_DIR, file));
      }
    }
  }

  for (const iconName of iconNames) {
    const pascalName = toPascalCase(iconName);

    const content = `import { default as ${pascalName}Data } from 'iconex/icons/${iconName}';
import createIconexIcon from '../createIconexIcon';

const ${pascalName} = createIconexIcon('${pascalName}', ${pascalName}Data);
export default ${pascalName};
`;

    writeFileSync(join(OUTPUT_DIR, `${pascalName}.tsx`), content, 'utf8');
  }

  console.log(`Generated ${iconNames.length} React icon components.`);
}

main();
