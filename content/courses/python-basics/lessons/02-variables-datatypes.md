---
title: "Variables and Data Types"
order: 2
videoUrl: "https://www.youtube.com/embed/LrOAl8vUFHY"
videoProvider: "youtube"
---

# Variables and Data Types

Learn how to store and manipulate data in Python.

## Variables

Variables are containers for storing data values.

```python
# No need to declare type
message = "Hello"
count = 42
price = 19.99
is_active = True
```

## Data Types

### Numbers
```python
# Integer
age = 25
year = 2024

# Float
temperature = 36.6
pi = 3.14159

# Operations
print(10 + 5)   # 15
print(10 - 5)   # 5
print(10 * 5)   # 50
print(10 / 5)   # 2.0
print(10 // 3)  # 3 (floor division)
print(10 % 3)   # 1 (modulo)
print(2 ** 3)   # 8 (power)
```

### Strings
```python
name = "Alice"
greeting = 'Hello'
multiline = """This is
a multiline
string"""

# String operations
print("Hello" + " " + "World")  # Concatenation
print("Python" * 3)              # Repetition
print(len("Hello"))              # Length: 5
print("Hello"[0])                # Indexing: H
print("Hello"[1:4])              # Slicing: ell
```

### Booleans
```python
is_student = True
is_graduated = False

# Comparison operators
print(5 > 3)   # True
print(5 < 3)   # False
print(5 == 5)  # True
print(5 != 3)  # True
```

### Lists
```python
fruits = ["apple", "banana", "cherry"]
numbers = [1, 2, 3, 4, 5]
mixed = [1, "hello", True, 3.14]

# List operations
fruits.append("orange")
print(fruits[0])        # apple
print(len(fruits))      # 4
print(fruits[-1])       # orange (last item)
```

## Type Conversion

```python
# String to int
age = int("25")

# Int to string
text = str(100)

# String to float
price = float("19.99")

# Check type
print(type(age))    # <class 'int'>
print(type(text))   # <class 'str'>
```

## Practice Exercise

Create variables for:
- Your name (string)
- Your age (integer)
- Your height in meters (float)
- Whether you're a student (boolean)

Then print them all in a formatted message!
