---
title: "Common Security Threats"
order: 2
videoUrl: "https://www.youtube.com/embed/Dk-ZqQ-bfy4"
videoProvider: "youtube"
---

# Common Security Threats

Understanding threats is the **first step in building effective defenses**. In this lesson, we'll explore the most common cyberattacks and learn how to protect against them.

---

## 🦠 1. Malware (Malicious Software)

Malware is any software intentionally designed to cause damage to a computer, server, client, or network.

### Types of Malware:

**🔴 Viruses**
- Attaches to clean files and spreads throughout a system
- Can corrupt or delete data
- Requires user action to execute

**🐴 Trojans**
- Disguises itself as legitimate software
- Creates backdoors for attackers
- Example: Fake antivirus programs

**🔒 Ransomware**
- Encrypts your files and demands payment
- Average ransom: $200,000+
- Famous examples: WannaCry, NotPetya

**👁️ Spyware**
- Secretly monitors user activity
- Steals passwords, credit card info
- Often bundled with free software

**🪱 Worms**
- Self-replicating malware
- Spreads without user interaction
- Can consume bandwidth and resources

---

## 🎣 2. Phishing Attacks

**Phishing** is a social engineering attack where attackers impersonate trusted entities to steal sensitive information.

### Red Flags to Watch For:

```
❌ Suspicious sender: support@paypa1.com (notice the "1")
❌ Urgent language: "Your account will be closed in 24 hours!"
❌ Generic greetings: "Dear Customer" instead of your name
❌ Suspicious links: hover to see real URL
❌ Requests for sensitive info: passwords, SSN, credit cards
❌ Poor grammar/spelling: "We has detected suspicious activity"
❌ Unexpected attachments: invoice.pdf.exe
```

### Real Example:

```
From: security@paypal-verify.com
Subject: URGENT: Verify Your Account Now!

Dear User,

We has detected unusual activity on your account. 
Click here to verify your identity immediately or 
your account will be suspended within 24 hours.

[Verify Now] <-- Links to fake site
```

**🚨 This is a phishing email!** Notice the fake domain, poor grammar, and urgency tactics.

---

## 💥 3. DDoS Attacks (Distributed Denial of Service)

Overwhelming a system with traffic to make it **unavailable to legitimate users**.

### How It Works:

```
Attacker → Botnet (1000s of infected devices)
              ↓
         Target Server
              ↓
         Server Crashes
```

**Famous Attacks:**
- GitHub (2018): 1.35 Tbps attack
- Dyn DNS (2016): Took down Twitter, Netflix, Reddit

---

## 🕵️ 4. Social Engineering

Manipulating people into divulging confidential information.

**Common Tactics:**
- **Pretexting:** Creating fake scenarios ("I'm from IT support...")
- **Baiting:** Offering something enticing (free USB drives with malware)
- **Tailgating:** Following authorized person into secure area
- **Quid Pro Quo:** Offering service in exchange for info

---

## 🛡️ Defense Strategies

### Essential Security Practices:

#### 1. Keep Software Updated
```bash
# Linux: Update all packages
sudo apt update && sudo apt upgrade -y

# Check for security updates
sudo unattended-upgrades --dry-run
```

#### 2. Use Strong, Unique Passwords
```python
# Password manager example
import secrets
import string

def generate_password(length=16):
    alphabet = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(alphabet) for i in range(length))
    return password

# Generate secure password
print(generate_password())
# Output: 'K9$mP2@xL5#nQ8&r'
```

#### 3. Enable Two-Factor Authentication (2FA)
- Something you know (password)
- Something you have (phone, security key)
- Something you are (fingerprint, face)

#### 4. Regular Backups
```bash
# Automated backup script
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

# Backup important directories
tar -czf $BACKUP_DIR/documents.tar.gz ~/Documents
tar -czf $BACKUP_DIR/projects.tar.gz ~/Projects

echo "Backup completed: $BACKUP_DIR"
```

#### 5. Network Security Scanning
```bash
# Check for open ports on your system
nmap -sV localhost

# Scan for vulnerabilities
nmap -sV --script vuln 192.168.1.1

# Check listening services
sudo netstat -tulpn | grep LISTEN
```

---

## 🔍 Practical Exercise: Phishing Detection

**Analyze this email:**

```
From: admin@amaz0n-security.com
Subject: Your order #8472947 has been cancelled

Hello,

Your recent order for $899.99 has been cancelled due to 
payment verification failure. Please click the link below 
to update your payment method within 12 hours.

[Update Payment Method]

Thank you,
Amazon Security Team
```

**What's wrong?**
1. ❌ Fake domain: `amaz0n` (zero instead of 'o')
2. ❌ No order details or personalization
3. ❌ Urgency tactic (12 hours)
4. ❌ Suspicious link
5. ❌ Amazon doesn't send payment updates via email

---

## 📊 Threat Statistics

- **43%** of cyberattacks target small businesses
- **91%** of cyberattacks start with a phishing email
- **68%** of breaches take months to discover
- **$4.35M** average cost of a data breach

---

## ✅ Key Takeaways

✅ **Malware** comes in many forms - viruses, trojans, ransomware  
✅ **Phishing** exploits human psychology, not technical vulnerabilities  
✅ **DDoS attacks** overwhelm systems with traffic  
✅ **Social engineering** is the art of human hacking  
✅ **Defense is layered** - no single solution protects everything

---

## 🎯 Challenge

1. **Scan your system** for open ports using `nmap`
2. **Enable 2FA** on your most important accounts
3. **Create a backup** of your important files
4. **Test yourself:** Can you spot phishing emails in your inbox?

---

## Next Steps

In the next lesson, we'll dive into **network security fundamentals** and learn how to secure your home network and understand how firewalls work.

💡 **Pro Tip:** The best defense is awareness. Stay informed about new threats!
