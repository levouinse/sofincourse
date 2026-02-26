---
title: "JavaScript Basics"
order: 1
videoUrl: "https://www.youtube.com/embed/W6NZfCO5SIk"
videoProvider: "youtube"
---

# JavaScript Basics

JavaScript is the programming language of the web, running in every browser.

## Why JavaScript?

- **Universal**: Runs in all browsers
- **Full-Stack**: Frontend (React, Vue) + Backend (Node.js)
- **Interactive**: Make websites dynamic and responsive
- **Huge Ecosystem**: npm has millions of packages

## Running JavaScript

### Browser Console
```javascript
// Open DevTools (F12) and go to Console
console.log("Hello, World!");
```

### Node.js
```bash
# Install Node.js from nodejs.org
node --version

# Run a file
node script.js
```

## Variables

```javascript
// Modern way (ES6+)
let name = "Alice";
const age = 25;

// Old way (avoid)
var oldStyle = "deprecated";

// Constants can't be reassigned
const PI = 3.14159;
// PI = 3.14; // Error!
```

## Data Types

```javascript
// Numbers
let count = 42;
let price = 19.99;

// Strings
let message = "Hello";
let template = `My name is ${name}`;  // Template literals

// Booleans
let isActive = true;
let isCompleted = false;

// Arrays
let fruits = ["apple", "banana", "cherry"];
let numbers = [1, 2, 3, 4, 5];

// Objects
let person = {
  name: "Alice",
  age: 25,
  city: "New York"
};

// Null and Undefined
let empty = null;
let notDefined;  // undefined
```

## Functions

```javascript
// Function declaration
function greet(name) {
  return `Hello, ${name}!`;
}

// Arrow function (ES6+)
const add = (a, b) => a + b;

// Function call
console.log(greet("Alice"));  // Hello, Alice!
console.log(add(5, 3));        // 8
```

## Operators

```javascript
// Arithmetic
console.log(10 + 5);   // 15
console.log(10 - 5);   // 5
console.log(10 * 5);   // 50
console.log(10 / 5);   // 2
console.log(10 % 3);   // 1
console.log(2 ** 3);   // 8

// Comparison
console.log(5 > 3);    // true
console.log(5 === 5);  // true (strict equality)
console.log(5 == "5"); // true (loose equality)
console.log(5 !== 3);  // true

// Logical
console.log(true && false);  // false
console.log(true || false);  // true
console.log(!true);          // false
```

## Next Steps

In the next lesson, we'll dive into control flow with if statements and loops!
