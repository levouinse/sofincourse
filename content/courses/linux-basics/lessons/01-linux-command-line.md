---
title: "Linux Command Line Basics"
order: 1
videoUrl: "https://www.youtube.com/embed/ZtqBQ68cfJc"
videoProvider: "youtube"
---

# Linux Command Line Basics

Master the Linux terminal - the most powerful tool for developers and system administrators.

## Why Learn Linux?

- **Industry Standard**: Powers 90% of servers and cloud infrastructure
- **Developer Essential**: Most development tools are Linux-first
- **Automation**: Shell scripting for task automation
- **Career Boost**: High demand skill in DevOps and SysAdmin roles

## Basic Commands

### Navigation
```bash
# Print working directory
pwd

# List files
ls
ls -la  # Detailed list with hidden files
ls -lh  # Human-readable file sizes

# Change directory
cd /home/user
cd ..        # Go up one level
cd ~         # Go to home directory
cd -         # Go to previous directory
```

### File Operations
```bash
# Create file
touch file.txt
echo "Hello" > file.txt

# Create directory
mkdir mydir
mkdir -p path/to/nested/dir

# Copy
cp file.txt backup.txt
cp -r dir1 dir2  # Copy directory recursively

# Move/Rename
mv file.txt newname.txt
mv file.txt /path/to/destination/

# Delete
rm file.txt
rm -r directory  # Remove directory
rm -rf directory # Force remove (be careful!)
```

### Viewing Files
```bash
# Display file content
cat file.txt

# Page through file
less file.txt
more file.txt

# First/last lines
head file.txt      # First 10 lines
head -n 20 file.txt # First 20 lines
tail file.txt      # Last 10 lines
tail -f log.txt    # Follow file (live updates)
```

### File Permissions
```bash
# View permissions
ls -l file.txt
# -rw-r--r-- 1 user group 1234 Jan 1 12:00 file.txt

# Change permissions
chmod 755 script.sh  # rwxr-xr-x
chmod +x script.sh   # Add execute permission
chmod -w file.txt    # Remove write permission

# Change owner
chown user:group file.txt
```

### Searching
```bash
# Find files
find /path -name "*.txt"
find . -type f -name "config*"

# Search in files
grep "error" log.txt
grep -r "TODO" .  # Recursive search
grep -i "error" log.txt  # Case insensitive
```

### Process Management
```bash
# List processes
ps aux
ps aux | grep nginx

# Top processes
top
htop  # Better alternative

# Kill process
kill PID
kill -9 PID  # Force kill
killall process_name
```

### System Information
```bash
# Disk usage
df -h
du -sh directory

# Memory usage
free -h

# System info
uname -a
lsb_release -a

# Who is logged in
who
w
```

### Networking
```bash
# Check connectivity
ping google.com
ping -c 4 8.8.8.8

# Network interfaces
ip addr
ifconfig

# Download files
wget https://example.com/file.zip
curl -O https://example.com/file.zip

# Check ports
netstat -tuln
ss -tuln
```

### Package Management

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt upgrade
sudo apt install package-name
sudo apt remove package-name
```

**CentOS/RHEL:**
```bash
sudo yum update
sudo yum install package-name
```

**Arch:**
```bash
sudo pacman -Syu
sudo pacman -S package-name
```

## Useful Shortcuts

- `Ctrl + C` - Cancel current command
- `Ctrl + D` - Exit terminal
- `Ctrl + L` - Clear screen
- `Ctrl + R` - Search command history
- `Tab` - Auto-complete
- `!!` - Repeat last command
- `sudo !!` - Repeat last command with sudo

## Pipes and Redirection

```bash
# Redirect output
command > file.txt   # Overwrite
command >> file.txt  # Append

# Pipe output
ls -la | grep ".txt"
cat file.txt | wc -l  # Count lines

# Chain commands
command1 && command2  # Run if first succeeds
command1 || command2  # Run if first fails
command1 ; command2   # Run both regardless
```

## Practice Exercises

1. Create a directory structure: `projects/web/frontend`
2. Create 5 text files with different names
3. Find all `.txt` files in your home directory
4. Check disk usage of your home directory
5. View running processes and find your terminal

## Next Steps

In the next lesson, we'll learn shell scripting to automate tasks!
