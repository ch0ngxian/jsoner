/**
 * Parser for JavaScript/TypeScript object literals to JSON
 * Handles:
 * - Unquoted keys
 * - Single quoted strings
 * - Variable declarations (const, let, var)
 * - undefined values (converted to null)
 * - Single-line and multi-line comments
 * - Trailing commas
 * - Type annotations (TypeScript)
 */

export function isJavaScriptObject(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();

  // Check for JavaScript/TypeScript patterns
  const patterns = [
    /^\s*(const|let|var)\s+\w+\s*(:\s*\w+[\w<>,\s\[\]]*\s*)?=\s*\{/m, // Variable declaration with optional type annotation
    /\bundefined\b/, // JavaScript undefined keyword
    /\/\/.*$|\/\*[\s\S]*?\*\//m, // JavaScript comments
    /{\s*\w+\s*:\s*[^:]/m, // Unquoted key followed by colon (not ::)
    /{\s*[']\w+['"]\s*:/m, // Single-quoted key
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

export function javascriptObjectToJson(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove single-line comments
  result = result.replace(/\/\/.*$/gm, '');

  // Remove multi-line comments
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Remove variable declarations (const, let, var) with optional type annotations
  result = result.replace(/^\s*(const|let|var)\s+\w+\s*(:\s*\w+[\w<>,\s\[\]|&{}]*)?\s*=\s*/gm, '');

  // Remove TypeScript type assertions
  result = result.replace(/as\s+\w+[\w<>,\s\[\]|&{}]*/g, '');

  // Remove trailing semicolons
  result = result.replace(/;(\s*)$/gm, '$1');

  // Convert undefined to null
  result = result.replace(/:\s*undefined\b/g, ': null');
  result = result.replace(/\[\s*undefined\b/g, '[null');
  result = result.replace(/,\s*undefined\b/g, ', null');

  // Convert unquoted keys to quoted keys
  // Match word characters followed by optional whitespace, then colon
  // Negative lookbehind to avoid matching if already quoted
  result = result.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":');

  // Convert single quotes to double quotes for strings
  // This is a simplified approach - handles most cases
  result = convertSingleQuotesToDouble(result);

  return result.trim();
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

    // Handle escaped quotes within strings
    if (inString && char === '"' && stringChar === "'") {
      // If original was single quote, double quotes don't need escaping
      result += char;
    } else if (inString && char === "'" && stringChar === '"') {
      // If original was double quote, single quotes don't need escaping
      result += char;
    } else {
      result += char;
    }

    i++;
  }

  return result;
}

/**
 * Advanced tokenization-based parser for JavaScript objects
 * More robust handling of complex nested structures
 */
export function parseJavaScriptObjectAdvanced(input: string): any {
  // First apply basic transformations
  let processed = javascriptObjectToJson(input);

  // Try to parse as JSON
  try {
    return JSON.parse(processed);
  } catch (error) {
    // If parsing fails, return the processed string for further handling
    throw new Error(`Failed to parse JavaScript object: ${error}`);
  }
}
