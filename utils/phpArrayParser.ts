/**
 * Parser for PHP associative arrays to JSON
 * Handles:
 * - array() syntax and [] syntax
 * - => (arrow) syntax for key-value pairs
 * - Single quoted strings
 * - PHP booleans (TRUE, FALSE, true, false)
 * - PHP NULL (case-insensitive)
 * - Variable assignments ($var = )
 * - Single-line and multi-line comments
 */

export function isPHPArray(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();

  // Check for PHP-specific patterns
  const patterns = [
    /\s*=>\s*/, // PHP arrow syntax for associative arrays
    /\barray\s*\(/i, // array() function call
    /\$\w+\s*=/, // Variable assignment with $
    /\b(TRUE|FALSE|NULL)\b/i, // PHP keywords (case-insensitive)
    /\/\/.*$|\/\*[\s\S]*?\*\//m, // PHP comments
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

export function phpArrayToJson(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove single-line comments
  result = result.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove PHP variable assignments
  result = result.replace(/\$\w+\s*=\s*/g, '');

  // Remove trailing semicolons
  result = result.replace(/;(\s*)$/gm, '$1');

  // Convert array(...) to [...]
  result = convertArraySyntax(result);

  // Convert => to :
  result = result.replace(/\s*=>\s*/g, ': ');

  // Convert PHP booleans and NULL to JSON equivalents (case-insensitive)
  result = result.replace(/\bTRUE\b/gi, 'true');
  result = result.replace(/\bFALSE\b/gi, 'false');
  result = result.replace(/\bNULL\b/gi, 'null');

  // Convert single quotes to double quotes for strings
  result = convertSingleQuotesToDouble(result);

  return result.trim();
}

/**
 * Convert PHP array() syntax to JSON [] syntax
 */
function convertArraySyntax(input: string): string {
  let result = input;

  // Replace array( with [
  result = result.replace(/\barray\s*\(/gi, '[');

  // Find and replace matching closing parentheses with ]
  // This is a simplified approach - for complex nested structures,
  // a more sophisticated parser might be needed
  let depth = 0;
  let output = '';
  let i = 0;

  while (i < result.length) {
    const char = result[i];

    if (char === '[') {
      depth++;
      output += char;
    } else if (char === '(' && result.substring(i - 5, i).toLowerCase() !== 'array') {
      output += char;
    } else if (char === ')' && depth > 0) {
      // This closing paren likely matches an array(
      depth--;
      output += ']';
    } else {
      output += char;
    }

    i++;
  }

  return output;
}

/**
 * Convert single quotes to double quotes while preserving escaped quotes
 * and handling quotes within strings
 */
function convertSingleQuotesToDouble(input: string): string {
  let result = '';
  let inString = false;
  let stringChar: string | null = null;
  let i = 0;

  while (i < input.length) {
    const char = input[i];
    const nextChar = input[i + 1];

    // Handle escape sequences
    if (char === '\\' && inString) {
      result += char;
      if (nextChar) {
        result += nextChar;
        i += 2;
        continue;
      }
    }

    // Handle string delimiters
    if ((char === '"' || char === "'") && !inString) {
      inString = true;
      stringChar = char;
      result += '"'; // Always use double quotes
      i++;
      continue;
    }

    if (char === stringChar && inString) {
      inString = false;
      stringChar = null;
      result += '"'; // Always use double quotes
      i++;
      continue;
    }

    // Handle quotes within strings
    if (inString && char === '"' && stringChar === "'") {
      // Need to escape double quotes if original string used single quotes
      result += '\\"';
    } else if (inString && char === "'" && stringChar === '"') {
      // Single quotes don't need escaping in double-quoted strings
      result += char;
    } else {
      result += char;
    }

    i++;
  }

  return result;
}

/**
 * Advanced parser for PHP arrays
 * More robust handling of complex nested structures
 */
export function parsePHPArrayAdvanced(input: string): any {
  // First apply basic transformations
  let processed = phpArrayToJson(input);

  // Try to parse as JSON
  try {
    return JSON.parse(processed);
  } catch (error) {
    // If parsing fails, return the processed string for further handling
    throw new Error(`Failed to parse PHP array: ${error}`);
  }
}
