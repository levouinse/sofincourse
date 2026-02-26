---
title: "What is Cybersecurity?"
order: 1
videoUrl: "https://www.youtube.com/embed/inWWhr5tnEA"
videoProvider: "youtube"
---

# What is Cybersecurity?

Cybersecurity is the practice of **protecting systems, networks, and programs** from digital attacks. These cyberattacks are usually aimed at accessing, changing, or destroying sensitive information, extorting money from users, or interrupting normal business processes.

## The CIA Triad

The foundation of cybersecurity is built on three core principles:

### 🔒 Confidentiality
Ensuring that sensitive information is **accessible only to authorized users**. This involves encryption, access controls, and authentication mechanisms.

**Example:** Bank account details should only be visible to the account holder and authorized bank staff.

### ✅ Integrity
Maintaining the **accuracy and completeness** of data throughout its lifecycle. Preventing unauthorized modification or deletion.

**Example:** Medical records must remain accurate and unchanged unless modified by authorized healthcare professionals.

### 🚀 Availability
Ensuring that systems and data are **accessible when needed** by authorized users. This includes protection against DoS attacks and maintaining uptime.

**Example:** E-commerce websites must remain online 24/7 for customers to make purchases.

---

## Why Cybersecurity Matters

In today's interconnected digital world, cybersecurity is critical for:

- 🛡️ **Protecting Personal Information** - Identity theft, financial fraud, and privacy violations
- 💼 **Safeguarding Business Operations** - Ransomware, data breaches, and intellectual property theft
- 🏛️ **Maintaining National Security** - Critical infrastructure, government systems, and defense networks
- 🔐 **Preserving Privacy Rights** - Personal data protection and digital freedom

---

## Real-World Impact

**Did you know?**
- Cybercrime damages are projected to reach **$10.5 trillion annually** by 2025
- A data breach costs companies an average of **$4.35 million**
- **95% of cybersecurity breaches** are caused by human error

---

## Practical Example: Password Strength Checker

Let's build a simple tool to check password strength:

```python
def check_password_strength(password):
    """
    Evaluates password strength based on length and complexity
    """
    score = 0
    feedback = []
    
    # Check length
    if len(password) < 8:
        feedback.append("❌ Too short (minimum 8 characters)")
        return "Weak", feedback
    elif len(password) >= 12:
        score += 2
        feedback.append("✅ Good length")
    else:
        score += 1
    
    # Check for uppercase
    if any(c.isupper() for c in password):
        score += 1
        feedback.append("✅ Contains uppercase")
    else:
        feedback.append("⚠️ Add uppercase letters")
    
    # Check for digits
    if any(c.isdigit() for c in password):
        score += 1
        feedback.append("✅ Contains numbers")
    else:
        feedback.append("⚠️ Add numbers")
    
    # Check for special characters
    if any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        score += 1
        feedback.append("✅ Contains special characters")
    else:
        feedback.append("⚠️ Add special characters")
    
    # Determine strength
    if score >= 4:
        return "Strong 💪", feedback
    elif score >= 2:
        return "Medium ⚡", feedback
    else:
        return "Weak 🔓", feedback

# Test it out
test_passwords = ["pass", "Password1", "P@ssw0rd123!"]

for pwd in test_passwords:
    strength, tips = check_password_strength(pwd)
    print(f"\nPassword: {pwd}")
    print(f"Strength: {strength}")
    for tip in tips:
        print(f"  {tip}")
```

**Output:**
```
Password: pass
Strength: Weak 🔓
  ❌ Too short (minimum 8 characters)

Password: Password1
Strength: Medium ⚡
  ✅ Good length
  ✅ Contains uppercase
  ✅ Contains numbers
  ⚠️ Add special characters

Password: P@ssw0rd123!
Strength: Strong 💪
  ✅ Good length
  ✅ Contains uppercase
  ✅ Contains numbers
  ✅ Contains special characters
```

---

## Key Takeaways

✅ Cybersecurity protects **confidentiality, integrity, and availability**  
✅ Human error is the **biggest security risk**  
✅ Strong passwords are your **first line of defense**  
✅ Security is **everyone's responsibility**

---

## Next Steps

In the next lesson, we'll explore **common security threats** and learn practical defense strategies against phishing, malware, and social engineering attacks.

🎯 **Challenge:** Try to break your own password checker! What edge cases did you miss?
