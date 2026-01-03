# Quick Reference: cPanel FTP Directory Path

## 🎯 Answer to Your Question

For a subdomain under **westleyresource.com**, here's what to configure:

### In cPanel (Subdomain Setup):
- **Subdomain**: `group` (or `fintech`, `enterprise`, etc.)
- **Parent Domain**: `westleyresource.com`
- **Document Root**: `public_html/group`

### In GitHub Secrets (FTP_SERVER_DIR):
```
/public_html/group/
```

## 📝 Complete Path Examples

| Subdomain URL | cPanel Document Root | GitHub FTP_SERVER_DIR |
|---------------|---------------------|----------------------|
| `group.westleyresource.com` | `public_html/group` | `/public_html/group/` |
| `fintech.westleyresource.com` | `public_html/fintech` | `/public_html/fintech/` |
| `enterprise.westleyresource.com` | `public_html/enterprise` | `/public_html/enterprise/` |

## ⚠️ Important Notes

1. **Always include the leading slash**: `/public_html/...`
2. **Always include the trailing slash**: `.../group/`
3. **Match the subdomain's document root exactly**
4. **Parent domain root is**: `~/public_html` (your main westleyresource.com site)

## 🔐 GitHub Secrets Summary

Add these 4 secrets to your GitHub repository:

```
FTP_SERVER: ftp.westleyresource.com
FTP_USERNAME: your-cpanel-username@westleyresource.com
FTP_PASSWORD: your-ftp-password
FTP_SERVER_DIR: /public_html/group/
```

## ✅ Recommended Setup

**Best Option**: Use `group.westleyresource.com`

- **Why**: Short, memorable, clearly indicates the Westley Group brand
- **cPanel Document Root**: `public_html/group`
- **GitHub FTP_SERVER_DIR**: `/public_html/group/`
- **Final URL**: `https://group.westleyresource.com`

---

**Status**: ✅ Code pushed to GitHub successfully!
**Next Step**: Configure the 4 GitHub secrets, then deployment will happen automatically on next push.
