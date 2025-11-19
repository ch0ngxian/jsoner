/**
 * Parser for C# Dictionary initialization to JSON
 * Handles:
 * - Collection initializer syntax { { "key", value }, ... }
 * - Index initializer syntax ["key"] = value
 * - Add() method calls
 * - Type declarations
 * - C# keywords (true, false, null)
 */

export function isCSharpDict(input: string): boolean {
  if (!input || typeof input !== 'string') return false;

  const trimmed = input.trim();

  // Check for C# Dictionary-specific patterns
  const patterns = [
    /\bDictionary\s*<.*>\s*\(/, // Dictionary constructor
    /new\s+Dictionary\s*</, // new Dictionary<...>
    /\bvar\s+\w+\s*=\s*new\s+Dictionary/, // var ... = new Dictionary
    /\[["']\w+["']\]\s*=/, // Index initializer ["key"] =
    /\{\s*\{/, // Collection initializer { {
    /\.Add\s*\(/, // Add() method call
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

export function csharpDictToJson(input: string): string {
  if (!input) return input;

  let result = input;

  // Remove C# comments
  result = result.replace(/\/\/.*$/gm, '');
  result = result.replace(/\/\*[\s\S]*?\*\//g, '');

  // Try to detect and convert different Dictionary initialization patterns

  // Pattern 1: Index initializer ["key"] = value
  if (result.includes('[') && result.includes('] =')) {
    result = convertIndexInitializer(result);
  }
  // Pattern 2: Collection initializer { { "key", value }, ... }
  else if (/\{\s*\{/.test(result)) {
    result = convertCollectionInitializer(result);
  }
  // Pattern 3: Add() method calls
  else if (result.includes('.Add(')) {
    result = convertAddCalls(result);
  }

  return result.trim();
}

/**
 * Convert index initializer ["key"] = value to JSON
 */
function convertIndexInitializer(input: string): string {
  // Remove variable declaration and type info
  let result = input.replace(/^[\s\S]*?new\s+Dictionary\s*<[^>]*>\s*(\([^)]*\))?\s*\{/m, '{');

  // Convert ["key"] = value to "key": value
  result = result.replace(/\[([^[\]]+)\]\s*=\s*/g, '$1: ');

  // Remove trailing semicolons and closing braces
  result = result.replace(/;?\s*\};\s*$/, '}');

  return result;
}

/**
 * Convert collection initializer { { "key", value }, ... } to JSON
 */
function convertCollectionInitializer(input: string): string {
  // Remove variable declaration and type info up to the opening {
  let result = input.replace(/^[\s\S]*?new\s+Dictionary\s*<[^>]*>\s*(\([^)]*\))?\s*\{/m, '{');

  // Remove trailing }; or };
  result = result.replace(/\};\s*$/, '}');

  // Convert { "key", value } to "key": value
  // This pattern matches inner braces with two comma-separated values
  result = result.replace(/\{\s*([^,}]+)\s*,\s*([^}]+)\s*\}/g, '$1: $2');

  return result;
}

/**
 * Convert Add() method calls to JSON
 */
function convertAddCalls(input: string): string {
  // Extract all Add() calls
  const addRegex = /\.Add\s*\(\s*([^,]+)\s*,\s*([^)]+)\s*\)/g;
  const pairs: string[] = [];

  let match;
  while ((match = addRegex.exec(input)) !== null) {
    const key = match[1].trim();
    const value = match[2].trim();
    pairs.push(`${key}: ${value}`);
  }

  if (pairs.length === 0) return input;

  return `{${pairs.join(', ')}}`;
}

/**
 * Advanced parser for C# Dictionaries
 */
export function parseCSharpDictAdvanced(input: string): any {
  // First apply basic transformations
  let processed = csharpDictToJson(input);

  // Try to parse as JSON
  try {
    return JSON.parse(processed);
  } catch (error) {
    // If parsing fails, return the processed string for further handling
    throw new Error(`Failed to parse C# Dictionary: ${error}`);
  }
}
