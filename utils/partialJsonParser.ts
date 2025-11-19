/**
 * Attempts to parse JSON, even if it's incomplete or invalid.
 * Returns a parsed object/array or the original string if parsing fails completely.
 */
export function parsePartialJson(jsonString: string): any {
  if (!jsonString || jsonString.trim() === '') {
    return null;
  }

  const trimmed = jsonString.trim();

  // First, try standard JSON.parse
  try {
    return JSON.parse(trimmed);
  } catch (error) {
    // If standard parsing fails, try to fix common issues
    return attemptPartialParse(trimmed);
  }
}

/**
 * Attempts to fix common JSON issues and parse partial JSON
 */
function attemptPartialParse(jsonString: string): any {
  let fixedJson = jsonString;

  // Try various fix strategies in sequence
  const strategies = [
    fixTrailingCommas,
    fixIncompleteStrings,
    fixMissingClosingBraces,
    fixIncompleteValues,
    extractValidPrefix
  ];

  for (const strategy of strategies) {
    try {
      fixedJson = strategy(fixedJson);
      return JSON.parse(fixedJson);
    } catch {
      // Continue to next strategy
    }
  }

  // If all strategies fail, return a best-effort structure
  return createFallbackStructure(jsonString);
}

/**
 * Removes trailing commas before closing brackets/braces
 */
function fixTrailingCommas(jsonString: string): string {
  return jsonString
    .replace(/,(\s*[}\]])/g, '$1')  // Remove trailing commas
    .replace(/,(\s*)$/g, '$1');     // Remove trailing comma at end
}

/**
 * Attempts to close incomplete strings
 */
function fixIncompleteStrings(jsonString: string): string {
  let fixed = jsonString;

  // Count quotes to see if we have an unclosed string
  let quoteCount = 0;
  let lastQuoteIndex = -1;
  let escaped = false;

  for (let i = 0; i < fixed.length; i++) {
    if (fixed[i] === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (fixed[i] === '"' && !escaped) {
      quoteCount++;
      lastQuoteIndex = i;
    }
    escaped = false;
  }

  // If odd number of quotes, we have an unclosed string
  if (quoteCount % 2 === 1) {
    fixed = fixed + '"';
  }

  return fixed;
}

/**
 * Adds missing closing braces and brackets
 */
function fixMissingClosingBraces(jsonString: string): string {
  let fixed = jsonString;
  const stack: string[] = [];
  let inString = false;
  let escaped = false;

  // Track opening brackets/braces
  for (let i = 0; i < fixed.length; i++) {
    const char = fixed[i];

    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
    }

    if (!inString && !escaped) {
      if (char === '{') stack.push('}');
      else if (char === '[') stack.push(']');
      else if (char === '}' && stack[stack.length - 1] === '}') stack.pop();
      else if (char === ']' && stack[stack.length - 1] === ']') stack.pop();
    }

    escaped = false;
  }

  // Add missing closing brackets/braces
  while (stack.length > 0) {
    fixed += stack.pop();
  }

  return fixed;
}

/**
 * Handles incomplete values (e.g., incomplete numbers, booleans)
 */
function fixIncompleteValues(jsonString: string): string {
  let fixed = jsonString;

  // Remove incomplete values at the end
  // Match patterns like: "key": t (incomplete true)
  // or "key": fal (incomplete false)
  // or "key": nul (incomplete null)
  fixed = fixed
    .replace(/:\s*t$/, ': true')
    .replace(/:\s*f$/, ': false')
    .replace(/:\s*fa$/, ': false')
    .replace(/:\s*fal$/, ': false')
    .replace(/:\s*fals$/, ': false')
    .replace(/:\s*tr$/, ': true')
    .replace(/:\s*tru$/, ': true')
    .replace(/:\s*n$/, ': null')
    .replace(/:\s*nu$/, ': null')
    .replace(/:\s*nul$/, ': null');

  return fixed;
}

/**
 * Tries to extract a valid JSON prefix from the string
 */
function extractValidPrefix(jsonString: string): string {
  // Try to find the longest valid JSON prefix
  for (let i = jsonString.length; i > 0; i--) {
    const substring = jsonString.substring(0, i);
    const fixed = fixMissingClosingBraces(fixTrailingCommas(substring));
    try {
      JSON.parse(fixed);
      return fixed;
    } catch {
      // Continue
    }
  }
  return jsonString;
}

/**
 * Creates a fallback structure when all parsing attempts fail
 */
function createFallbackStructure(jsonString: string): any {
  const trimmed = jsonString.trim();

  // Try to determine what type of structure was intended
  if (trimmed.startsWith('{')) {
    return tryParseAsObject(trimmed);
  } else if (trimmed.startsWith('[')) {
    return tryParseAsArray(trimmed);
  } else if (trimmed.startsWith('"')) {
    return tryParseAsString(trimmed);
  } else if (/^-?\d/.test(trimmed)) {
    return tryParseAsNumber(trimmed);
  } else if (trimmed.startsWith('t') || trimmed.startsWith('f')) {
    return tryParseAsBoolean(trimmed);
  } else if (trimmed.startsWith('n')) {
    return null;
  }

  // Last resort: return as is
  return trimmed;
}

/**
 * Attempts to parse a partial object
 */
function tryParseAsObject(jsonString: string): any {
  const result: any = {};

  // Extract key-value pairs using regex
  const keyValuePattern = /"([^"]+)"\s*:\s*([^,}\]]+|"[^"]*"|{[^}]*}|\[[^\]]*\])/g;
  let match;

  while ((match = keyValuePattern.exec(jsonString)) !== null) {
    const key = match[1];
    let value: any = match[2].trim();

    // Try to parse the value
    try {
      value = JSON.parse(value);
    } catch {
      // If parsing fails, try to infer the type
      if (value.startsWith('"')) {
        value = value.replace(/^"|"$/g, '');
      } else if (value === 'true') {
        value = true;
      } else if (value === 'false') {
        value = false;
      } else if (value === 'null') {
        value = null;
      } else if (!isNaN(Number(value))) {
        value = Number(value);
      }
    }

    result[key] = value;
  }

  return Object.keys(result).length > 0 ? result : jsonString;
}

/**
 * Attempts to parse a partial array
 */
function tryParseAsArray(jsonString: string): any {
  const result: any[] = [];

  // Remove opening bracket and try to extract values
  let content = jsonString.substring(1).trim();

  // Split by commas (simple approach)
  const items = content.split(',');

  for (let item of items) {
    item = item.trim();
    if (!item || item === ']') continue;

    try {
      result.push(JSON.parse(item));
    } catch {
      // Try to infer type
      if (item.startsWith('"') && item.endsWith('"')) {
        result.push(item.replace(/^"|"$/g, ''));
      } else if (item === 'true') {
        result.push(true);
      } else if (item === 'false') {
        result.push(false);
      } else if (item === 'null') {
        result.push(null);
      } else if (!isNaN(Number(item))) {
        result.push(Number(item));
      } else {
        result.push(item);
      }
    }
  }

  return result.length > 0 ? result : jsonString;
}

/**
 * Attempts to parse a partial string
 */
function tryParseAsString(jsonString: string): string {
  let str = jsonString;
  if (str.startsWith('"') && !str.endsWith('"')) {
    str += '"';
  }
  try {
    return JSON.parse(str);
  } catch {
    return str.replace(/^"|"$/g, '');
  }
}

/**
 * Attempts to parse a partial number
 */
function tryParseAsNumber(jsonString: string): number | string {
  const num = parseFloat(jsonString);
  return isNaN(num) ? jsonString : num;
}

/**
 * Attempts to parse a partial boolean
 */
function tryParseAsBoolean(jsonString: string): boolean | string {
  if (jsonString.startsWith('t')) return true;
  if (jsonString.startsWith('f')) return false;
  return jsonString;
}

/**
 * Checks if a string can be parsed as valid JSON
 */
export function isValidJson(jsonString: string): boolean {
  try {
    JSON.parse(jsonString);
    return true;
  } catch {
    return false;
  }
}
