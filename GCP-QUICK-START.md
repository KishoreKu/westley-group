# GCP Deployment - Quick Reference

## ✅ Ready-to-Deploy Files Created

- ✅ `backend/Dockerfile` - Container configuration
- ✅ `backend/.dockerignore` - Build optimization
- ✅ `backend/GCP-DEPLOYMENT.md` - Complete deployment guide
- ✅ `.github/workflows/deploy-backend-gcp.yml` - Auto-deployment

---

## 🚀 Deploy in 3 Steps

### 1. Prerequisites
```bash
# Install gcloud CLI (if not installed)
# Visit: https://cloud.google.com/sdk/docs/install

# Login to Google Cloud
gcloud auth login

# Create/select project
gcloud projects create westley-backend-prod
gcloud config set project westley-backend-prod

# Enable required services
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
```

### 2. Deploy Backend
```bash
cd backend

# Single command deployment
gcloud run deploy westley-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi
```

**When prompted:**
- Allow unauthenticated invocations? **Y**
- Service name: **westley-backend** (or press Enter)
- Region: **us-central1** (or your preferred region)

### 3. Configure Environment Variables

Get the service URL first:
```bash
SERVICE_URL=$(gcloud run services describe westley-backend \
  --region us-central1 \
  --format 'value(status.url)')

echo "Your API URL: $SERVICE_URL"
```

Add environment variables via GCP Console:
1. Visit: https://console.cloud.google.com/run
2. Click on **westley-backend** service
3. Click **Edit & Deploy New Revision**
4. Click **Variables & Secrets** tab
5. Add these variables:

```
NODE_ENV=production
FRONTEND_URL=https://westley-group.com
PORT=8080

# Stripe
STRIPE_SECRET_KEY=sk_test_... (or sk_live_...)
STRIPE_PUBLISHABLE_KEY=pk_test_... (or pk_live_...)

# OpenAI
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4

# Email SMTP
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Westley Group
EMAIL_FROM_ADDRESS=noreply@westley-group.com

# Pricing
PAYMENT_AMOUNT=1900
PAYMENT_CURRENCY=usd
```

6. Click **Deploy**

---

## 🔄 Auto-Deploy Setup (Optional)

Enable pushes to `main` branch to auto-deploy:

### 1. Create Service Account
```bash
# Create service account
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Deploy"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)

# Grant permissions
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:github-deploy@$PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-deploy@$PROJECT_ID.iam.gserviceaccount.com
```

### 2. Add GitHub Secrets

1. Go to your GitHub repo: https://github.com/KishoreKu/westley-group
2. Settings → Secrets and variables → Actions
3. Click **New repository secret**

Add these two secrets:

**Secret 1: GCP_PROJECT_ID**
- Name: `GCP_PROJECT_ID`
- Value: Your project ID (run `gcloud config get-value project`)

**Secret 2: GCP_SA_KEY**
- Name: `GCP_SA_KEY`
- Value: Contents of `key.json` file (entire JSON)

Now every push to `main` that changes `backend/` will auto-deploy!

---

## 🧪 Test Deployment

```bash
# Get service URL
SERVICE_URL=$(gcloud run services describe westley-backend \
  --region us-central1 \
  --format 'value(status.url)')

# Test health endpoint
curl $SERVICE_URL/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 📝 Update Frontend

Edit `credit-card-finder/script.js`:

```javascript
// Change this line:
const API_URL = 'https://westley-backend-xxxxx-uc.a.run.app';
```

Replace with your actual Cloud Run URL from above.

---

## 💰 Cost Estimate

**Free Tier:**
- 2 million requests/month
- 360,000 GB-seconds/month
- 180,000 vCPU-seconds/month

**Your Expected Usage** (100 recommendations/day):
- ~3,000 requests/month
- ~30,000 GB-seconds/month
- ~15,000 vCPU-seconds/month

**Monthly Cost: ~$2-5** (well within free tier initially!)

---

## 📊 View Logs & Metrics

**View Logs:**
```bash
gcloud run services logs read westley-backend \
  --region us-central1 \
  --limit 100
```

**Or visit:**
- GCP Console → Cloud Run → westley-backend → Logs tab

**Metrics:**
- GCP Console → Cloud Run → westley-backend → Metrics tab

---

## 🔧 Common Commands

**Update environment variable:**
```bash
gcloud run services update westley-backend \
  --region us-central1 \
  --update-env-vars EMAIL_HOST=smtp.gmail.com
```

**Redeploy:**
```bash
cd backend
gcloud run deploy westley-backend \
  --source . \
  --region us-central1
```

**View service details:**
```bash
gcloud run services describe westley-backend --region us-central1
```

**Delete service:**
```bash
gcloud run services delete westley-backend --region us-central1
```

---

## ✅ Deployment Checklist

- [ ] gcloud CLI installed
- [ ] GCP project created
- [ ] gcloud authenticated (`gcloud auth login`)
- [ ] Backend deployed to Cloud Run
- [ ] Environment variables configured
- [ ] Health endpoint tested
- [ ] Service URL copied
- [ ] Frontend `script.js` updated with API URL
- [ ] GitHub secrets added (optional, for auto-deploy)
- [ ] Full end-to-end test completed

---

## 🆘 Troubleshooting

**"Permission denied"**
- Run: `gcloud auth login`
- Verify project: `gcloud config get-value project`

**Container fails to build**
- Check Dockerfile syntax
- Ensure all files are committed
- Check `.dockerignore` isn't excluding needed files

**Service won't start**
- Check logs: `gcloud run services logs read westley-backend`
- Verify PORT environment variable is used (already done in server.js)
- Check all required env vars are set

**Email not sending**
- Use Gmail App Password, not regular password
- Verify SMTP settings in env vars

---

📖 **Full Documentation**: [backend/GCP-DEPLOYMENT.md](file:///Users/kishorekumar/CascadeProjects/westley-group/backend/GCP-DEPLOYMENT.md)
