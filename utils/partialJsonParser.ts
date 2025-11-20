import { isRubyHash, parseRubyHashAdvanced } from './rubyHashParser';
import { isJavaScriptObject, javascriptObjectToJson } from './javascriptObjectParser';
import { isPythonDict, pythonDictToJson } from './pythonDictParser';
import { isPHPArray, phpArrayToJson } from './phpArrayParser';
import { isCSharpDict, csharpDictToJson } from './csharpDictParser';

export interface JsonError {
  line: number;
  column: number;
  message: string;
  type: 'syntax' | 'incomplete' | 'invalid';
  position: number;
}

export interface ParseResult {
  data: any;
  errors: JsonError[];
  isValid: boolean;
  fixesApplied: string[];
}

/**
 * Attempts to parse JSON, even if it's incomplete or invalid.
 * Returns parsed data along with error information.
 */
export function parsePartialJson(jsonString: string): ParseResult {
  if (!jsonString || jsonString.trim() === '') {
    return {
      data: null,
      errors: [],
      isValid: true,
      fixesApplied: []
    };
  }

  const trimmed = jsonString.trim();

  // First, try standard JSON.parse
  try {
    const data = JSON.parse(trimmed);
    return {
      data,
      errors: [],
      isValid: true,
      fixesApplied: []
    };
  } catch (error: any) {
    // Check for various language-specific formats

    // Check for JavaScript/TypeScript object
    if (isJavaScriptObject(trimmed)) {
      try {
        const converted = javascriptObjectToJson(trimmed);
        const data = JSON.parse(converted);
        return {
          data,
          errors: [],
          isValid: true,
          fixesApplied: ['Converted from JavaScript/TypeScript object syntax']
        };
      } catch (parseError: any) {
        const converted = javascriptObjectToJson(trimmed);
        const partialResult = attemptPartialParse(converted, parseError);
        partialResult.fixesApplied.unshift('Converted from JavaScript/TypeScript object syntax');
        return partialResult;
      }
    }

    // Check for Python dict
    if (isPythonDict(trimmed)) {
      try {
        const converted = pythonDictToJson(trimmed);
        const data = JSON.parse(converted);
        return {
          data,
          errors: [],
          isValid: true,
          fixesApplied: ['Converted from Python dict syntax']
        };
      } catch (parseError: any) {
        const converted = pythonDictToJson(trimmed);
        const partialResult = attemptPartialParse(converted, parseError);
        partialResult.fixesApplied.unshift('Converted from Python dict syntax');
        return partialResult;
      }
    }

    // Check for PHP array
    if (isPHPArray(trimmed)) {
      try {
        const converted = phpArrayToJson(trimmed);
        const data = JSON.parse(converted);
        return {
          data,
          errors: [],
          isValid: true,
          fixesApplied: ['Converted from PHP array syntax']
        };
      } catch (parseError: any) {
        const converted = phpArrayToJson(trimmed);
        const partialResult = attemptPartialParse(converted, parseError);
        partialResult.fixesApplied.unshift('Converted from PHP array syntax');
        return partialResult;
      }
    }

    // Check for C# Dictionary
    if (isCSharpDict(trimmed)) {
      try {
        const converted = csharpDictToJson(trimmed);
        const data = JSON.parse(converted);
        return {
          data,
          errors: [],
          isValid: true,
          fixesApplied: ['Converted from C# Dictionary syntax']
        };
      } catch (parseError: any) {
        const converted = csharpDictToJson(trimmed);
        const partialResult = attemptPartialParse(converted, parseError);
        partialResult.fixesApplied.unshift('Converted from C# Dictionary syntax');
        return partialResult;
      }
    }

    // Check if this might be a Ruby hash
    if (isRubyHash(trimmed)) {
      const rubyResult = parseRubyHashAdvanced(trimmed);

      if (rubyResult.isRubyHash && rubyResult.errors.length === 0) {
        try {
          const data = JSON.parse(rubyResult.json);
          return {
            data,
            errors: [],
            isValid: true,
            fixesApplied: ['Converted from Ruby hash syntax']
          };
        } catch (parseError: any) {
          // If converted JSON still fails to parse, try partial parse on it
          const partialResult = attemptPartialParse(rubyResult.json, parseError);
          partialResult.fixesApplied.unshift('Converted from Ruby hash syntax');
          return partialResult;
        }
      } else if (rubyResult.errors.length > 0) {
        // Ruby conversion had errors, add them to the result
        const errors: JsonError[] = rubyResult.errors.map((msg, idx) => ({
          line: 1,
          column: 1,
          message: msg,
          type: 'syntax' as const,
          position: 0
        }));
        return {
          data: null,
          errors,
          isValid: false,
          fixesApplied: []
        };
      }
    }

    // If standard parsing fails, analyze and fix the errors
    return attemptPartialParse(trimmed, error);
  }
}

/**
 * Get line and column from position in string
 */
function getLineAndColumn(str: string, position: number): { line: number; column: number } {
  const lines = str.substring(0, position).split('\n');
  return {
    line: lines.length,
    column: lines[lines.length - 1].length + 1
  };
}

/**
 * Attempts to fix common JSON issues and parse partial JSON
 */
function attemptPartialParse(jsonString: string, originalError: any): ParseResult {
  const errors: JsonError[] = [];
  const fixesApplied: string[] = [];
  let fixedJson = jsonString;

  // Parse the original error from JSON.parse
  const originalErrorInfo = parseJsonError(originalError, jsonString);
  if (originalErrorInfo) {
    errors.push(originalErrorInfo);
  }

  // Try various fix strategies in sequence
  const strategies: Array<{
    name: string;
    fix: (json: string) => string;
    detector: (json: string) => JsonError | null;
  }> = [
    {
      name: 'trailing commas',
      fix: fixTrailingCommas,
      detector: detectTrailingCommas
    },
    {
      name: 'unclosed strings',
      fix: fixIncompleteStrings,
      detector: detectUnclosedStrings
    },
    {
      name: 'missing closing brackets',
      fix: fixMissingClosingBraces,
      detector: detectMissingBrackets
    },
    {
      name: 'incomplete values',
      fix: fixIncompleteValues,
      detector: detectIncompleteValues
    }
  ];

  for (const strategy of strategies) {
    const error = strategy.detector(fixedJson);
    if (error) {
      errors.push(error);
      fixedJson = strategy.fix(fixedJson);
      fixesApplied.push(strategy.name);
    }
  }

  // Try to parse the fixed JSON
  try {
    const data = JSON.parse(fixedJson);
    return {
      data,
      errors,
      isValid: false,
      fixesApplied
    };
  } catch {
    // If still can't parse, try extracting valid prefix
    const prefixResult = extractValidPrefix(fixedJson);
    if (prefixResult.success) {
      fixesApplied.push('extracted valid prefix');
      return {
        data: prefixResult.data,
        errors,
        isValid: false,
        fixesApplied
      };
    }

    // Last resort: create fallback structure
    const fallbackData = createFallbackStructure(jsonString);
    fixesApplied.push('fallback parsing');
    return {
      data: fallbackData,
      errors,
      isValid: false,
      fixesApplied
    };
  }
}

/**
 * Parse error from JSON.parse exception
 */
function parseJsonError(error: any, jsonString: string): JsonError | null {
  const message = error.message || '';

  // Try to extract position from error message
  // Common formats: "at position X", "at line X column Y"
  const positionMatch = message.match(/position (\d+)/);
  const lineColMatch = message.match(/line (\d+) column (\d+)/);

  let line = 1;
  let column = 1;
  let position = 0;

  if (lineColMatch) {
    line = parseInt(lineColMatch[1]);
    column = parseInt(lineColMatch[2]);
  } else if (positionMatch) {
    position = parseInt(positionMatch[1]);
    const loc = getLineAndColumn(jsonString, position);
    line = loc.line;
    column = loc.column;
  } else {
    // Try to find error position by looking at the string
    position = jsonString.length;
    const loc = getLineAndColumn(jsonString, position);
    line = loc.line;
    column = loc.column;
  }

  return {
    line,
    column,
    message: error.message || 'Invalid JSON syntax',
    type: 'syntax',
    position
  };
}

/**
 * Detect trailing commas
 */
function detectTrailingCommas(jsonString: string): JsonError | null {
  const trailingCommaPattern = /,(\s*[}\]])/g;
  const match = trailingCommaPattern.exec(jsonString);

  if (match && match.index !== undefined) {
    const loc = getLineAndColumn(jsonString, match.index);
    return {
      line: loc.line,
      column: loc.column,
      message: 'Trailing comma before closing bracket',
      type: 'syntax',
      position: match.index
    };
  }

  return null;
}

/**
 * Detect unclosed strings
 */
function detectUnclosedStrings(jsonString: string): JsonError | null {
  let quoteCount = 0;
  let lastQuoteIndex = -1;
  let escaped = false;

  for (let i = 0; i < jsonString.length; i++) {
    if (jsonString[i] === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (jsonString[i] === '"' && !escaped) {
      quoteCount++;
      lastQuoteIndex = i;
    }
    escaped = false;
  }

  if (quoteCount % 2 === 1) {
    const loc = getLineAndColumn(jsonString, lastQuoteIndex);
    return {
      line: loc.line,
      column: loc.column,
      message: 'Unclosed string',
      type: 'incomplete',
      position: lastQuoteIndex
    };
  }

  return null;
}

/**
 * Detect missing closing brackets/braces
 */
function detectMissingBrackets(jsonString: string): JsonError | null {
  const stack: Array<{ char: string; position: number }> = [];
  let inString = false;
  let escaped = false;

  for (let i = 0; i < jsonString.length; i++) {
    const char = jsonString[i];

    if (char === '\\' && !escaped) {
      escaped = true;
      continue;
    }

    if (char === '"' && !escaped) {
      inString = !inString;
    }

    if (!inString && !escaped) {
      if (char === '{' || char === '[') {
        stack.push({ char, position: i });
      } else if (char === '}') {
        if (stack.length === 0 || stack[stack.length - 1].char !== '{') {
          const loc = getLineAndColumn(jsonString, i);
          return {
            line: loc.line,
            column: loc.column,
            message: 'Unexpected closing brace',
            type: 'syntax',
            position: i
          };
        }
        stack.pop();
      } else if (char === ']') {
        if (stack.length === 0 || stack[stack.length - 1].char !== '[') {
          const loc = getLineAndColumn(jsonString, i);
          return {
            line: loc.line,
            column: loc.column,
            message: 'Unexpected closing bracket',
            type: 'syntax',
            position: i
          };
        }
        stack.pop();
      }
    }

    escaped = false;
  }

  if (stack.length > 0) {
    const unclosed = stack[stack.length - 1];
    const loc = getLineAndColumn(jsonString, unclosed.position);
    const bracketName = unclosed.char === '{' ? 'brace' : 'bracket';
    return {
      line: loc.line,
      column: loc.column,
      message: `Missing closing ${bracketName}`,
      type: 'incomplete',
      position: unclosed.position
    };
  }

  return null;
}

/**
 * Detect incomplete values
 */
function detectIncompleteValues(jsonString: string): JsonError | null {
  const patterns = [
    { regex: /:\s*t$/, message: 'Incomplete boolean "true"' },
    { regex: /:\s*tr$/, message: 'Incomplete boolean "true"' },
    { regex: /:\s*tru$/, message: 'Incomplete boolean "true"' },
    { regex: /:\s*f$/, message: 'Incomplete boolean "false"' },
    { regex: /:\s*fa$/, message: 'Incomplete boolean "false"' },
    { regex: /:\s*fal$/, message: 'Incomplete boolean "false"' },
    { regex: /:\s*fals$/, message: 'Incomplete boolean "false"' },
    { regex: /:\s*n$/, message: 'Incomplete null value' },
    { regex: /:\s*nu$/, message: 'Incomplete null value' },
    { regex: /:\s*nul$/, message: 'Incomplete null value' }
  ];

  for (const pattern of patterns) {
    const match = pattern.regex.exec(jsonString);
    if (match && match.index !== undefined) {
      const position = match.index + match[0].length - 1;
      const loc = getLineAndColumn(jsonString, position);
      return {
        line: loc.line,
        column: loc.column,
        message: pattern.message,
        type: 'incomplete',
        position
      };
    }
  }

  return null;
}

/**
 * Removes trailing commas before closing brackets/braces
 */
function fixTrailingCommas(jsonString: string): string {
  return jsonString
    .replace(/,(\s*[}\]])/g, '$1')
    .replace(/,(\s*)$/g, '$1');
}

/**
 * Attempts to close incomplete strings
 */
function fixIncompleteStrings(jsonString: string): string {
  let fixed = jsonString;
  let quoteCount = 0;
  let escaped = false;

  for (let i = 0; i < fixed.length; i++) {
    if (fixed[i] === '\\' && !escaped) {
      escaped = true;
      continue;
    }
    if (fixed[i] === '"' && !escaped) {
      quoteCount++;
    }
    escaped = false;
  }

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

  while (stack.length > 0) {
    fixed += stack.pop();
  }

  return fixed;
}

/**
 * Handles incomplete values (e.g., incomplete numbers, booleans)
 */
function fixIncompleteValues(jsonString: string): string {
  return jsonString
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
}

/**
 * Tries to extract a valid JSON prefix from the string
 */
function extractValidPrefix(jsonString: string): { success: boolean; data: any } {
  for (let i = jsonString.length; i > 0; i--) {
    const substring = jsonString.substring(0, i);
    const fixed = fixMissingClosingBraces(fixTrailingCommas(substring));
    try {
      const data = JSON.parse(fixed);
      return { success: true, data };
    } catch {
      // Continue
    }
  }
  return { success: false, data: null };
}

/**
 * Creates a fallback structure when all parsing attempts fail
 */
function createFallbackStructure(jsonString: string): any {
  const trimmed = jsonString.trim();

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

  return trimmed;
}

function tryParseAsObject(jsonString: string): any {
  const result: any = {};
  const keyValuePattern = /"([^"]+)"\s*:\s*([^,}\]]+|"[^"]*"|{[^}]*}|\[[^\]]*\])/g;
  let match;

  while ((match = keyValuePattern.exec(jsonString)) !== null) {
    const key = match[1];
    let value: any = match[2].trim();

    try {
      value = JSON.parse(value);
    } catch {
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

function tryParseAsArray(jsonString: string): any {
  const result: any[] = [];
  let content = jsonString.substring(1).trim();
  const items = content.split(',');

  for (let item of items) {
    item = item.trim();
    if (!item || item === ']') continue;

    try {
      result.push(JSON.parse(item));
    } catch {
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

function tryParseAsNumber(jsonString: string): number | string {
  const num = parseFloat(jsonString);
  return isNaN(num) ? jsonString : num;
}

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
