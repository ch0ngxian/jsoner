/**
 * Ruby Hash to JSON Parser
 * Converts Ruby hash syntax to JSON format
 */

export interface RubyParseResult {
  json: string;
  isRubyHash: boolean;
  errors: string[];
}

/**
 * Detects if the input looks like a Ruby hash
 */
export function isRubyHash(input: string): boolean {
  const trimmed = input.trim();

  // Check for Ruby hash patterns
  const patterns = [
    /\w+\s*=>\s*/, // Hash rocket syntax
    /:\w+\s*=>/, // Symbol with hash rocket
    /\w+:\s*[^:]/, // Symbol shorthand (but not ::)
    /{\s*:\w+/, // Opening brace with symbol
    /{\s*"\w+"\s*=>/, // Opening brace with string key and hash rocket
  ];

  return patterns.some(pattern => pattern.test(trimmed));
}

/**
 * Converts Ruby hash string to JSON string
 */
export function rubyHashToJson(input: string): RubyParseResult {
  const errors: string[] = [];
  let json = input.trim();

  // Check if it's a Ruby hash
  if (!isRubyHash(json)) {
    return { json: input, isRubyHash: false, errors: [] };
  }

  try {
    // Remove variable assignment if present (e.g., "person = {...")
    json = json.replace(/^\s*\w+\s*=\s*/, '');

    // Step 1: Convert hash rockets (=>) to colons (:)
    // Handle cases with proper spacing around =>
    json = json.replace(/\s*=>\s*/g, ': ');

    // Step 2: Convert symbol keys to string keys
    // Pattern 1: Symbol shorthand (title: "value") - keep as is but quote the key
    // We need to handle this carefully to not affect strings
    json = json.replace(/([{,]\s*)(\w+)(\s*:\s*)/g, (match, prefix, key, colon) => {
      return `${prefix}"${key}"${colon}`;
    });

    // Pattern 2: Symbol with hash rocket (:title => "value") - already handled by step 1
    // Now convert :title to "title"
    json = json.replace(/:(\w+)(\s*:)/g, '"$1"$2');

    // Step 3: Handle unquoted string values (need to be quoted)
    // This is tricky - we need to identify unquoted strings that aren't booleans, numbers, or null

    // Step 4: Fix common Ruby-specific issues
    // Convert Ruby's nil to null
    json = json.replace(/:\s*nil\b/gi, ': null');
    json = json.replace(/\s+nil\b/gi, ' null');

    // Handle Ruby symbols that might remain (edge cases)
    json = json.replace(/:([a-zA-Z_]\w*)/g, '"$1"');

    // Step 5: Ensure proper JSON boolean format
    json = json.replace(/:\s*true\b/g, ': true');
    json = json.replace(/:\s*false\b/g, ': false');

    // Step 6: Clean up any double quotes that might have been added incorrectly
    // Fix cases where we might have quoted already quoted strings
    json = json.replace(/""+/g, '"');

    // Try to parse to validate
    try {
      JSON.parse(json);
    } catch (e) {
      // If parsing fails, it might be because of unquoted values or other issues
      errors.push(`Converted Ruby hash but JSON parsing failed: ${e instanceof Error ? e.message : String(e)}`);
    }

    return { json, isRubyHash: true, errors };
  } catch (error) {
    errors.push(`Failed to convert Ruby hash: ${error instanceof Error ? error.message : String(error)}`);
    return { json: input, isRubyHash: true, errors };
  }
}

/**
 * More sophisticated Ruby hash parser with tokenization
 */
export function parseRubyHashAdvanced(input: string): RubyParseResult {
  const errors: string[] = [];
  let source = input.trim();

  // Check if it's a Ruby hash
  if (!isRubyHash(source)) {
    return { json: input, isRubyHash: false, errors: [] };
  }

  // Remove variable assignment if present
  source = source.replace(/^\s*\w+\s*=\s*/, '');

  try {
    const result = convertRubyValue(source, 0);
    const jsonValue = result.value;
    const jsonString = JSON.stringify(jsonValue, null, 2);

    return { json: jsonString, isRubyHash: true, errors };
  } catch (error) {
    // Fallback to simple string replacement
    return rubyHashToJson(input);
  }
}

interface ParseValueResult {
  value: any;
  endIndex: number;
}

/**
 * Recursively parse Ruby values
 */
function convertRubyValue(source: string, startIndex: number): ParseValueResult {
  let i = startIndex;

  // Skip whitespace
  while (i < source.length && /\s/.test(source[i])) {
    i++;
  }

  if (i >= source.length) {
    throw new Error('Unexpected end of input');
  }

  const char = source[i];

  // Parse hash/object
  if (char === '{') {
    return parseRubyHash(source, i);
  }

  // Parse array
  if (char === '[') {
    return parseRubyArray(source, i);
  }

  // Parse string
  if (char === '"' || char === "'") {
    return parseString(source, i);
  }

  // Parse symbol as string
  if (char === ':' && i + 1 < source.length && /[a-zA-Z_]/.test(source[i + 1])) {
    return parseSymbol(source, i);
  }

  // Parse number, boolean, or nil
  return parsePrimitive(source, i);
}

/**
 * Parse Ruby hash into JavaScript object
 */
function parseRubyHash(source: string, startIndex: number): ParseValueResult {
  let i = startIndex + 1; // Skip opening {
  const obj: any = {};

  // Skip whitespace
  while (i < source.length && /\s/.test(source[i])) {
    i++;
  }

  // Empty hash
  if (source[i] === '}') {
    return { value: obj, endIndex: i + 1 };
  }

  while (i < source.length) {
    // Skip whitespace
    while (i < source.length && /\s/.test(source[i])) {
      i++;
    }

    if (source[i] === '}') {
      return { value: obj, endIndex: i + 1 };
    }

    // Parse key
    let key: string;

    // Symbol shorthand (key: value)
    if (/[a-zA-Z_]/.test(source[i])) {
      const keyMatch = source.slice(i).match(/^([a-zA-Z_]\w*)(\s*:)(?!:)/);
      if (keyMatch) {
        key = keyMatch[1];
        i += keyMatch[0].length;
      } else {
        throw new Error(`Expected key at position ${i}`);
      }
    }
    // Symbol with hash rocket (:key =>)
    else if (source[i] === ':') {
      const symbolResult = parseSymbol(source, i);
      key = symbolResult.value;
      i = symbolResult.endIndex;

      // Skip whitespace and =>
      while (i < source.length && /\s/.test(source[i])) {
        i++;
      }
      if (source.slice(i, i + 2) === '=>') {
        i += 2;
      } else {
        throw new Error(`Expected => at position ${i}`);
      }
    }
    // String key ("key" =>)
    else if (source[i] === '"' || source[i] === "'") {
      const stringResult = parseString(source, i);
      key = stringResult.value;
      i = stringResult.endIndex;

      // Skip whitespace and =>
      while (i < source.length && /\s/.test(source[i])) {
        i++;
      }
      if (source.slice(i, i + 2) === '=>') {
        i += 2;
      } else {
        throw new Error(`Expected => at position ${i}`);
      }
    } else {
      throw new Error(`Unexpected character at position ${i}: ${source[i]}`);
    }

    // Skip whitespace
    while (i < source.length && /\s/.test(source[i])) {
      i++;
    }

    // Parse value
    const valueResult = convertRubyValue(source, i);
    obj[key] = valueResult.value;
    i = valueResult.endIndex;

    // Skip whitespace
    while (i < source.length && /\s/.test(source[i])) {
      i++;
    }

    // Check for comma or closing brace
    if (source[i] === ',') {
      i++;
    } else if (source[i] === '}') {
      return { value: obj, endIndex: i + 1 };
    }
  }

  throw new Error('Unclosed hash');
}

/**
 * Parse Ruby array into JavaScript array
 */
function parseRubyArray(source: string, startIndex: number): ParseValueResult {
  let i = startIndex + 1; // Skip opening [
  const arr: any[] = [];

  // Skip whitespace
  while (i < source.length && /\s/.test(source[i])) {
    i++;
  }

  // Empty array
  if (source[i] === ']') {
    return { value: arr, endIndex: i + 1 };
  }

  while (i < source.length) {
    // Skip whitespace
    while (i < source.length && /\s/.test(source[i])) {
      i++;
    }

    if (source[i] === ']') {
      return { value: arr, endIndex: i + 1 };
    }

    // Parse value
    const valueResult = convertRubyValue(source, i);
    arr.push(valueResult.value);
    i = valueResult.endIndex;

    // Skip whitespace
    while (i < source.length && /\s/.test(source[i])) {
      i++;
    }

    // Check for comma or closing bracket
    if (source[i] === ',') {
      i++;
    } else if (source[i] === ']') {
      return { value: arr, endIndex: i + 1 };
    }
  }

  throw new Error('Unclosed array');
}

/**
 * Parse string literal
 */
function parseString(source: string, startIndex: number): ParseValueResult {
  const quote = source[startIndex];
  let i = startIndex + 1;
  let value = '';

  while (i < source.length) {
    if (source[i] === '\\' && i + 1 < source.length) {
      // Handle escape sequences
      i++;
      const escapeChar = source[i];
      switch (escapeChar) {
        case 'n': value += '\n'; break;
        case 't': value += '\t'; break;
        case 'r': value += '\r'; break;
        case '\\': value += '\\'; break;
        case '"': value += '"'; break;
        case "'": value += "'"; break;
        default: value += escapeChar;
      }
      i++;
    } else if (source[i] === quote) {
      return { value, endIndex: i + 1 };
    } else {
      value += source[i];
      i++;
    }
  }

  throw new Error('Unclosed string');
}

/**
 * Parse Ruby symbol as string
 */
function parseSymbol(source: string, startIndex: number): ParseValueResult {
  let i = startIndex + 1; // Skip :
  let value = '';

  while (i < source.length && /[a-zA-Z0-9_]/.test(source[i])) {
    value += source[i];
    i++;
  }

  return { value, endIndex: i };
}

/**
 * Parse primitive values (number, boolean, nil)
 */
function parsePrimitive(source: string, startIndex: number): ParseValueResult {
  let i = startIndex;
  let value = '';

  // Collect characters until we hit a delimiter
  while (i < source.length && !/[,\}\]\s]/.test(source[i])) {
    value += source[i];
    i++;
  }

  value = value.trim();

  // Convert nil to null
  if (value === 'nil') {
    return { value: null, endIndex: i };
  }

  // Boolean
  if (value === 'true') {
    return { value: true, endIndex: i };
  }
  if (value === 'false') {
    return { value: false, endIndex: i };
  }

  // Number
  const num = Number(value);
  if (!isNaN(num)) {
    return { value: num, endIndex: i };
  }

  throw new Error(`Unexpected value: ${value}`);
}
