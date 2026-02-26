---
title: "Introduction to Python"
order: 1
videoUrl: "https://www.youtube.com/embed/kqtD5dpn9C8"
videoProvider: "youtube"
---

# Introduction to Python

Python is a high-level, interpreted programming language known for its simplicity and readability.

## Why Learn Python?

- **Easy to Learn**: Simple syntax that reads like English
- **Versatile**: Web development, data science, AI, automation
- **High Demand**: One of the most sought-after programming skills
- **Large Community**: Extensive libraries and frameworks

## Installing Python

### Windows
```bash
# Download from python.org
# Or use winget
winget install Python.Python.3.12
```

### Linux/Mac
```bash
# Most systems have Python pre-installed
python3 --version

# Install via package manager
sudo apt install python3  # Ubuntu/Debian
brew install python3      # macOS
```

## Your First Python Program

```python
# Hello World
print("Hello, World!")

# Variables
name = "Alice"
age = 25
print(f"My name is {name} and I'm {age} years old")

# Basic math
x = 10
y = 5
print(f"Sum: {x + y}")
print(f"Product: {x * y}")
```

## Python Interactive Shell

```python
>>> 2 + 2
4
>>> "Hello" + " " + "World"
'Hello World'
>>> len("Python")
6
```

## Next Steps

In the next lesson, we'll explore Python data types and variables in depth.
