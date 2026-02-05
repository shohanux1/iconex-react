/**
 * Convert kebab-case to PascalCase.
 * "arrow-right" -> "ArrowRight"
 * "2-user" -> "TwoUser" (numbers can't start identifiers)
 */
export function toPascalCase(str: string): string {
  const DIGIT_WORDS: Record<string, string> = {
    '0': 'Zero',
    '1': 'One',
    '2': 'Two',
    '3': 'Three',
    '4': 'Four',
    '5': 'Five',
    '6': 'Six',
    '7': 'Seven',
    '8': 'Eight',
    '9': 'Nine',
  };

  const result = str
    .split('-')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join('');

  // If it starts with a digit, replace leading digits with words
  if (/^\d/.test(result)) {
    return result.replace(/^\d+/, (match) =>
      match.split('').map((d) => DIGIT_WORDS[d]).join(''),
    );
  }

  return result;
}

/**
 * Convert PascalCase to kebab-case.
 * "ArrowRight" -> "arrow-right"
 */
export function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
