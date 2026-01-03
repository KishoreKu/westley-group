# Deployment Guide - Westley Group

## 📋 Overview

This guide will help you deploy the Westley Group website as a subdomain under the parent domain **westleyresource.com** using cPanel FTP auto-deployment with GitHub Actions.

## 🌐 Subdomain Setup

### Recommended Subdomain Options:
- `group.westleyresource.com`
- `fintech.westleyresource.com`
- `enterprise.westleyresource.com`
- `solutions.westleyresource.com`

## 📁 cPanel Directory Structure

### For Parent Domain (westleyresource.com):
- **Root Directory**: `~/public_html`

### For Subdomain (e.g., group.westleyresource.com):
- **Recommended Directory**: `~/public_html/group`
- **Alternative**: `~/public_html/westley-group`

## ⚙️ cPanel Configuration Steps

### Step 1: Create Subdomain in cPanel

1. Log into your cPanel
2. Navigate to **Domains** → **Subdomains**
3. Create new subdomain:
   - **Subdomain**: `group` (or your preferred name)
   - **Domain**: `westleyresource.com`
   - **Document Root**: `public_html/group`
4. Click **Create**

### Step 2: FTP Server Directory Path

For GitHub Actions FTP deployment, use one of these paths in your secrets:

#### Option 1: Subdomain in subfolder (Recommended)
```
/public_html/group/
```

#### Option 2: Alternative subfolder name
```
/public_html/westley-group/
```

#### Option 3: If using addon domain
```
/public_html/westleygroup.com/
```

**Important Notes:**
- The path should start with `/public_html/`
- Include the trailing slash `/`
- The folder name should match your subdomain's document root

## 🔐 GitHub Secrets Configuration

You need to add these secrets to your GitHub repository:

### Navigate to GitHub Repository Settings:
1. Go to `https://github.com/KishoreKu/westley-group`
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### Add These 4 Secrets:

#### 1. FTP_SERVER
```
ftp.westleyresource.com
```
*Or your hosting provider's FTP server address*

#### 2. FTP_USERNAME
```
your-cpanel-username@westleyresource.com
```
*Your cPanel FTP username*

#### 3. FTP_PASSWORD
```
your-ftp-password
```
*Your FTP password (keep this secure!)*

#### 4. FTP_SERVER_DIR
```
/public_html/group/
```
*The exact path where files should be deployed*

## 🚀 Deployment Process

### Automatic Deployment:
Once configured, every push to the `main` or `master` branch will automatically:
1. Trigger GitHub Actions workflow
2. Connect to your cPanel via FTP
3. Upload all website files to the specified directory
4. Your site will be live at `https://group.westleyresource.com`

### Manual Deployment:
You can also trigger deployment manually:
1. Go to **Actions** tab in GitHub
2. Select **Deploy to cPanel via FTP**
3. Click **Run workflow**

## 📝 Quick Setup Checklist

- [ ] Create subdomain in cPanel (e.g., `group.westleyresource.com`)
- [ ] Note the document root path (e.g., `public_html/group`)
- [ ] Add FTP_SERVER secret to GitHub
- [ ] Add FTP_USERNAME secret to GitHub
- [ ] Add FTP_PASSWORD secret to GitHub
- [ ] Add FTP_SERVER_DIR secret to GitHub (e.g., `/public_html/group/`)
- [ ] Push code to GitHub
- [ ] Verify deployment in Actions tab
- [ ] Visit your subdomain to confirm

## 🔍 Troubleshooting

### Common Issues:

**Issue**: Deployment fails with "Permission denied"
- **Solution**: Verify FTP credentials and ensure the directory exists in cPanel

**Issue**: Files upload but site shows 404
- **Solution**: Check that FTP_SERVER_DIR matches the subdomain's document root exactly

**Issue**: SSL certificate error
- **Solution**: In cPanel, go to **SSL/TLS Status** and enable AutoSSL for the subdomain

**Issue**: Old files remain after deployment
- **Solution**: The FTP action syncs files. Manually delete old files via cPanel File Manager if needed

## 📧 Support

If you encounter issues:
1. Check GitHub Actions logs for error messages
2. Verify cPanel subdomain configuration
3. Test FTP credentials using an FTP client (FileZilla, etc.)
4. Contact your hosting provider for FTP access issues

## 🎯 Expected Result

After successful deployment:
- **URL**: `https://group.westleyresource.com` (or your chosen subdomain)
- **Files Location**: `~/public_html/group/`
- **Auto-deployment**: Enabled on every push to main/master

---

**Note**: Replace `group` with your actual subdomain name throughout this guide.
