/**
 * Parser for Java Map/HashMap initialization to JSON
 * Handles:
 * - Map.of() syntax (Java 9+)
 * - put() method calls
 * - Double-brace initialization
 * - Type declarations
 * - Java keywords (true, false, null)
 */

export function isJavaMap(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();

  // Check for Java Map-specific patterns
  const patterns = [
    /\bMap\s*<.*>\s*\w+\s*=/, // Map type declaration
    /\bHashMap\s*<.*>\s*\(/, // HashMap constructor
    /\bLinkedHashMap\s*<.*>\s*\(/, // LinkedHashMap constructor
    /\bTreeMap\s*<.*>\s*\(/, // TreeMap constructor
    /\bMap\.of\s*\(/, // Map.of() factory method
    /\.put\s*\(/, // put() method call
    /new\s+HashMap\s*<.*>\s*\(\s*\)\s*\{\{/, // Double-brace initialization
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

export function javaMapToJson(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove Java comments
  result = result.replace(/\/\/.*$/gm, '');
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Try to detect and convert different Map initialization patterns

  // Pattern 1: Map.of("key1", value1, "key2", value2, ...)
  if (result.includes('Map.of(')) {
    result = convertMapOf(result);
  }
  // Pattern 2: Sequential put() calls
  else if (result.includes('.put(')) {
    result = convertPutCalls(result);
  }
  // Pattern 3: Double-brace initialization
  else if (result.includes('{{')) {
    result = convertDoubleBrace(result);
  }

  return result.trim();
}

/**
 * Convert Map.of("key1", value1, "key2", value2) to JSON
 */
function convertMapOf(input: string): string {
  // Extract the arguments from Map.of(...)
  const match = input.match(/Map\.of\s*\(([\s\S]*)\)/);
  if (!match) return input;

  const args = match[1];

  // Split by commas (but not commas inside strings or nested structures)
  const pairs = smartSplit(args);

  // Convert pairs to JSON object
  const jsonPairs: string[] = [];
  for (let i = 0; i < pairs.length; i += 2) {
    if (i + 1 < pairs.length) {
      const key = pairs[i].trim();
      const value = pairs[i + 1].trim();
      jsonPairs.push(`${key}: ${value}`);
    }
  }

  return `{${jsonPairs.join(', ')}}`;
}

/**
 * Convert sequential put() calls to JSON
 */
function convertPutCalls(input: string): string {
  // Extract all put() calls
  const putRegex = /\.put\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  const pairs: string[] = [];

  let match;
  while ((match = putRegex.exec(input)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    pairs.push(`${key}: ${value}`);
  }

  if (pairs.length === 0) return input;

  return `{${pairs.join(', ')}}`;
}

/**
 * Convert double-brace initialization to JSON
 */
function convertDoubleBrace(input: string): string {
  // Extract content between {{ and }}
  const match = input.match(/\{\{([\s\S]*)\}\}/);
  if (!match) return input;

  const content = match[1];

  // Extract put() calls from the content
  return convertPutCalls(content);
}

/**
 * Smart split that respects strings and nested structures
 */
function smartSplit(input: string): string[] {
  const result: string[] = [];
  let current = '';
  let depth = 0;
  let inString = false;
  let stringChar: string | null = null;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    const prevChar = i > 0 ? input[i - 1] : '';

    // Handle escape sequences
    if (char === '\\' && inString && prevChar !== '\\') {
      current += char;
      continue;
    }

    // Handle string delimiters
    if ((char === '"' || char === "'") && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
        stringChar = null;
      }
      current += char;
      continue;
    }

    // Track nesting depth
    if (!inString) {
      if (char === '{' || char === '[' || char === '(') {
        depth++;
      } else if (char === '}' || char === ']' || char === ')') {
        depth--;
      }
    }

    // Split on commas at depth 0
    if (char === ',' && depth === 0 && !inString) {
      result.push(current);
      current = '';
      continue;
    }

    current += char;
  }

  if (current.trim()) {
    result.push(current);
  }

  return result;
}

/**
 * Advanced parser for Java Maps
 */
export function parseJavaMapAdvanced(input: string): any {
  // First apply basic transformations
  let processed = javaMapToJson(input);

  // Try to parse as JSON
  try {
    return JSON.parse(processed);
  } catch (error) {
    // If parsing fails, return the processed string for further handling
    throw new Error(`Failed to parse Java Map: ${error}`);
  }
}
