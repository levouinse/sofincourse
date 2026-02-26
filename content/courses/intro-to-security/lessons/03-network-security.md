---
title: "Network Security Fundamentals"
order: 3
videoUrl: "https://www.youtube.com/embed/qiQR5rTSshw"
videoProvider: "youtube"
pdfUrl: "https://www.cloudflare.com/learning/security/glossary/what-is-zero-trust/"
contentType: "mixed"
---

# Network Security Fundamentals

Network security is the practice of protecting computer networks from intruders, whether targeted attackers or opportunistic malware.

## 🔐 Key Concepts

### Firewalls
A firewall is a network security device that monitors incoming and outgoing network traffic and permits or blocks data packets based on security rules.

**Types of Firewalls:**
- **Packet-filtering firewalls** - Examine packets and prohibit them from passing through if they don't match security rules
- **Stateful inspection firewalls** - Track active connections and use this information to determine which packets to allow
- **Proxy firewalls** - Filter network traffic at the application level
- **Next-generation firewalls (NGFW)** - Combine traditional firewall with other network device filtering functions

### VPN (Virtual Private Network)
A VPN creates a secure, encrypted connection over a less secure network, such as the internet.

**Benefits:**
- 🔒 Encrypts your internet traffic
- 🌍 Masks your IP address
- 🛡️ Protects against hackers on public Wi-Fi
- 🚫 Bypasses geo-restrictions

### Network Segmentation
Dividing a network into multiple segments or subnets to improve security and performance.

---

## 🛠️ Practical Example: Basic Firewall Rules

```bash
# Allow SSH from specific IP
sudo ufw allow from 192.168.1.100 to any port 22

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Deny all other incoming traffic
sudo ufw default deny incoming

# Allow all outgoing traffic
sudo ufw default allow outgoing

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

---

## 🔍 Network Scanning with Nmap

```bash
# Scan a single host
nmap 192.168.1.1

# Scan a range of IPs
nmap 192.168.1.1-254

# Scan specific ports
nmap -p 80,443 192.168.1.1

# OS detection
nmap -O 192.168.1.1

# Service version detection
nmap -sV 192.168.1.1

# Aggressive scan
nmap -A 192.168.1.1
```

---

## 📊 Common Network Attacks

### 1. Man-in-the-Middle (MITM)
Attacker intercepts communication between two parties.

**Prevention:**
- Use HTTPS everywhere
- Implement certificate pinning
- Use VPN on public networks

### 2. DDoS (Distributed Denial of Service)
Overwhelming a target with traffic from multiple sources.

**Mitigation:**
- Use CDN services (Cloudflare, Akamai)
- Implement rate limiting
- Deploy DDoS protection services

### 3. Port Scanning
Attackers probe for open ports to find vulnerabilities.

**Defense:**
- Close unnecessary ports
- Use firewall rules
- Implement intrusion detection systems (IDS)

---

## ✅ Best Practices

1. **Implement Defense in Depth** - Multiple layers of security
2. **Regular Security Audits** - Scan for vulnerabilities regularly
3. **Keep Systems Updated** - Patch management is critical
4. **Use Strong Authentication** - Multi-factor authentication (MFA)
5. **Monitor Network Traffic** - Use SIEM tools for real-time monitoring
6. **Encrypt Sensitive Data** - Both in transit and at rest
7. **Principle of Least Privilege** - Grant minimum necessary access

---

## 🎯 Lab Exercise

**Setup a Basic Firewall:**

1. Install UFW (Uncomplicated Firewall)
```bash
sudo apt update
sudo apt install ufw
```

2. Configure basic rules
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow http
sudo ufw allow https
```

3. Enable and verify
```bash
sudo ufw enable
sudo ufw status numbered
```

4. Test your configuration
```bash
# From another machine, try to connect
nmap -p 1-1000 YOUR_SERVER_IP
```

---

## 📚 Additional Resources

- **PDF Material:** Check the PDF viewer above for detailed network diagrams
- **Video Tutorial:** Watch the embedded video for visual demonstrations
- **Practice:** Set up a home lab with VirtualBox or VMware

---

## 🔑 Key Takeaways

✅ Firewalls are your first line of defense  
✅ VPNs encrypt your traffic and protect privacy  
✅ Network segmentation limits attack surface  
✅ Regular monitoring is essential  
✅ Defense in depth provides multiple security layers

---

## Next Steps

In the next lesson, we'll dive into **Web Application Security** and learn about OWASP Top 10 vulnerabilities.

💡 **Challenge:** Set up a firewall on your system and document the rules you implemented!
