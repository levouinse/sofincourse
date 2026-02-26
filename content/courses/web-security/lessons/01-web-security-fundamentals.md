---
title: "Web Security Fundamentals"
order: 1
videoUrl: "https://www.youtube.com/embed/WlmKwIe9z1Q"
videoProvider: "youtube"
---

# Web Security Fundamentals

Understanding web security is crucial for building safe applications.

## OWASP Top 10

The most critical web application security risks:

1. **Broken Access Control**
2. **Cryptographic Failures**
3. **Injection**
4. **Insecure Design**
5. **Security Misconfiguration**
6. **Vulnerable Components**
7. **Authentication Failures**
8. **Software and Data Integrity Failures**
9. **Security Logging Failures**
10. **Server-Side Request Forgery (SSRF)**

## Common Vulnerabilities

### 1. SQL Injection

**Vulnerable Code:**
```javascript
// DON'T DO THIS!
const query = `SELECT * FROM users WHERE username = '${username}'`;
```

**Secure Code:**
```javascript
// Use parameterized queries
const query = 'SELECT * FROM users WHERE username = ?';
db.execute(query, [username]);
```

### 2. Cross-Site Scripting (XSS)

**Vulnerable Code:**
```html
<!-- DON'T DO THIS! -->
<div>${userInput}</div>
```

**Secure Code:**
```javascript
// Sanitize user input
import DOMPurify from 'dompurify';
const clean = DOMPurify.sanitize(userInput);
```

### 3. Cross-Site Request Forgery (CSRF)

**Protection:**
```javascript
// Use CSRF tokens
app.use(csrf());

// In forms
<input type="hidden" name="_csrf" value="${csrfToken}">
```

## Security Headers

```javascript
// Express.js example
app.use(helmet());

// Manual headers
res.setHeader('X-Content-Type-Options', 'nosniff');
res.setHeader('X-Frame-Options', 'DENY');
res.setHeader('X-XSS-Protection', '1; mode=block');
res.setHeader('Strict-Transport-Security', 'max-age=31536000');
```

## Password Security

```javascript
// NEVER store plain text passwords!
import bcrypt from 'bcrypt';

// Hash password
const saltRounds = 10;
const hashedPassword = await bcrypt.hash(password, saltRounds);

// Verify password
const isValid = await bcrypt.compare(password, hashedPassword);
```

## Input Validation

```javascript
// Validate and sanitize all inputs
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  age: z.number().min(18).max(120),
  username: z.string().min(3).max(20).regex(/^[a-z0-9_]+$/)
});

// Validate
const result = userSchema.parse(userInput);
```

## Secure Authentication

```javascript
// Use established libraries
import jwt from 'jsonwebtoken';

// Create token
const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
  expiresIn: '1h'
});

// Verify token
const decoded = jwt.verify(token, SECRET_KEY);
```

## Best Practices

1. **Never trust user input** - Always validate and sanitize
2. **Use HTTPS** - Encrypt data in transit
3. **Keep dependencies updated** - Run `npm audit` regularly
4. **Implement rate limiting** - Prevent brute force attacks
5. **Use security headers** - Protect against common attacks
6. **Log security events** - Monitor for suspicious activity
7. **Principle of least privilege** - Give minimum necessary permissions

## Tools for Security Testing

```bash
# Dependency scanning
npm audit
npm audit fix

# OWASP ZAP - Web app scanner
# Burp Suite - Security testing
# Nikto - Web server scanner
```

## Next Steps

In the next lesson, we'll dive deep into authentication and authorization!
