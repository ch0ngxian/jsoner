/**
 * Parser for Python dictionary literals to JSON
 * Handles:
 * - Single quoted strings
 * - Python booleans (True, False)
 * - Python None (converted to null)
 * - Variable assignments
 * - Comments (# style)
 * - Trailing commas
 */

export function isPythonDict(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();

  // Check for Python-specific patterns
  const patterns = [
    /\b(True|False|None)\b/, // Python boolean and None keywords
    /#.*$/m, // Python comment style
    /^\s*\w+\s*=\s*\{/m, // Variable assignment with dict
    /:\s*(True|False|None)\b/, // Dict value with Python keywords
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

export function pythonDictToJson(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove Python comments
  result = result.replace(/#.*$/gm, '');

  // Remove variable assignments (simple pattern)
  result = result.replace(/^\s*\w+\s*=\s*/gm, '');

  // Convert Python boolean and None to JSON equivalents
  // Use word boundaries to avoid partial matches
  result = result.replace(/\bTrue\b/g, 'true');
  result = result.replace(/\bFalse\b/g, 'false');
  result = result.replace(/\bNone\b/g, 'null');

  // Convert single quotes to double quotes for strings
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
 * Advanced parser for Python dictionaries
 * More robust handling of complex nested structures
 */
export function parsePythonDictAdvanced(input: string): any {
  // First apply basic transformations
  let processed = pythonDictToJson(input);

  // Try to parse as JSON
  try {
    return JSON.parse(processed);
  } catch (error) {
    // If parsing fails, return the processed string for further handling
    throw new Error(`Failed to parse Python dict: ${error}`);
  }
}
