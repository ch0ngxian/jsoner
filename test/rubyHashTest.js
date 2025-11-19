// Test Ruby Hash Parser
const { parseRubyHashAdvanced, isRubyHash } = require('../utils/rubyHashParser.ts');

console.log('=== Ruby Hash Parser Tests ===\n');

// Test 1: String keys with hash rocket
const test1 = '{ "name" => "Alice", "age" => 30, "city" => "New York" }';
console.log('Test 1: String keys with hash rocket');
console.log('Input:', test1);
const result1 = parseRubyHashAdvanced(test1);
console.log('Is Ruby Hash:', result1.isRubyHash);
console.log('Converted JSON:', result1.json);
console.log('Errors:', result1.errors);
console.log('');

// Test 2: Symbol keys with colon shorthand
const test2 = '{ title: "The Ruby Programming Language", author: "David Thomas", year: 2009 }';
console.log('Test 2: Symbol keys with colon shorthand');
console.log('Input:', test2);
const result2 = parseRubyHashAdvanced(test2);
console.log('Is Ruby Hash:', result2.isRubyHash);
console.log('Converted JSON:', result2.json);
console.log('Errors:', result2.errors);
console.log('');

// Test 3: Symbol keys with hash rocket
const test3 = '{ :title => "The Ruby Programming Language", :author => "David Thomas", :year => 2009 }';
console.log('Test 3: Symbol keys with hash rocket');
console.log('Input:', test3);
const result3 = parseRubyHashAdvanced(test3);
console.log('Is Ruby Hash:', result3.isRubyHash);
console.log('Converted JSON:', result3.json);
console.log('Errors:', result3.errors);
console.log('');

// Test 4: With variable assignment
const test4 = 'person = { "name" => "Alice", "age" => 30, "city" => "New York" }';
console.log('Test 4: With variable assignment');
console.log('Input:', test4);
const result4 = parseRubyHashAdvanced(test4);
console.log('Is Ruby Hash:', result4.isRubyHash);
console.log('Converted JSON:', result4.json);
console.log('Errors:', result4.errors);
console.log('');

// Test 5: Nested hash
const test5 = '{ name: "Alice", address: { city: "New York", zip: 10001 } }';
console.log('Test 5: Nested hash');
console.log('Input:', test5);
const result5 = parseRubyHashAdvanced(test5);
console.log('Is Ruby Hash:', result5.isRubyHash);
console.log('Converted JSON:', result5.json);
console.log('Errors:', result5.errors);
console.log('');

// Test 6: With nil value
const test6 = '{ name: "Alice", age: 30, email: nil }';
console.log('Test 6: With nil value');
console.log('Input:', test6);
const result6 = parseRubyHashAdvanced(test6);
console.log('Is Ruby Hash:', result6.isRubyHash);
console.log('Converted JSON:', result6.json);
console.log('Errors:', result6.errors);
console.log('');

// Test 7: Array values
const test7 = '{ name: "Alice", hobbies: ["reading", "coding", "hiking"] }';
console.log('Test 7: Array values');
console.log('Input:', test7);
const result7 = parseRubyHashAdvanced(test7);
console.log('Is Ruby Hash:', result7.isRubyHash);
console.log('Converted JSON:', result7.json);
console.log('Errors:', result7.errors);
