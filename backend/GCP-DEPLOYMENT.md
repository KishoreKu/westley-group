# GCP Deployment Guide - Backend API

## 🎯 Recommended: Google Cloud Run

Cloud Run is perfect for this backend because it:
- **Serverless**: No server management needed
- **Auto-scaling**: Scales to zero when not in use (saves money)
- **Pay-per-use**: Only pay when requests are being processed
- **Fully managed**: Handles HTTPS, load balancing, monitoring
- **Cost-efficient**: ~$5-10/month for moderate traffic

---

## 📋 Prerequisites

1. **Google Cloud Account**: https://cloud.google.com/
2. **gcloud CLI installed**: https://cloud.google.com/sdk/docs/install
3. **Project created** in GCP Console

---

## 🚀 Quick Deploy to Cloud Run

### Step 1: Prepare Backend for Cloud Run

Already done! The backend is Cloud Run ready. Just verify:

```bash
cd backend
# Check if PORT is correctly used (it is in server.js)
```

### Step 2: Create Dockerfile

Create `backend/Dockerfile`:

```dockerfile
FROM node:18-slim

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application files
COPY . .

# Cloud Run will set PORT environment variable
EXPOSE 8080

# Start server
CMD ["npm", "start"]
```

### Step 3: Create .dockerignore

Create `backend/.dockerignore`:

```
node_modules
.env
.env.*
*.log
.git
.gitignore
README.md
```

### Step 4: Authenticate with GCP

```bash
# Login to Google Cloud
gcloud auth login

# Set project ID (replace with your project ID)
gcloud config set project YOUR_PROJECT_ID
```

### Step 5: Deploy to Cloud Run

```bash
cd backend

# Deploy (this builds and deploys in one command)
gcloud run deploy westley-backend \
  --source . \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --memory 512Mi \
  --cpu 1 \
  --timeout 60s
```

**Important**: When prompted:
- Service name: `westley-backend`
- Region: Choose closest to your users (e.g., `us-central1`)
- Allow unauthenticated invocations: `Y` (yes)

### Step 6: Set Environment Variables

After deployment, add environment variables:

```bash
gcloud run services update westley-backend \
  --region us-central1 \
  --set-env-vars "NODE_ENV=production,FRONTEND_URL=https://westley-group.com" \
  --set-secrets "STRIPE_SECRET_KEY=stripe-secret:latest,OPENAI_API_KEY=openai-key:latest,EMAIL_PASSWORD=email-password:latest"
```

Or use the GCP Console:
1. Go to Cloud Run → Select your service
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add all environment variables from `.env.example`

### Step 7: Get Your API URL

```bash
gcloud run services describe westley-backend \
  --region us-central1 \
  --format 'value(status.url)'
```

Copy this URL and update `credit-card-finder/script.js`:
```javascript
const API_URL = 'https://westley-backend-xxxxx-uc.a.run.app';
```

---

## 🔐 Managing Secrets (Recommended)

Instead of plain environment variables, use Google Secret Manager for sensitive data:

### Create Secrets

```bash
# Stripe Secret Key
echo -n "sk_live_your_key" | gcloud secrets create stripe-secret --data-file=-

# OpenAI API Key
echo -n "sk-your_openai_key" | gcloud secrets create openai-key --data-file=-

# Email Password
echo -n "your_email_password" | gcloud secrets create email-password --data-file=-
```

### Grant Access to Cloud Run

```bash
gcloud secrets add-iam-policy-binding stripe-secret \
  --member="serviceAccount:YOUR_PROJECT_NUMBER-compute@developer.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Repeat for other secrets
```

---

## 🔄 Auto-Deploy with GitHub Actions

Create `.github/workflows/deploy-backend-gcp.yml`:

```yaml
name: Deploy Backend to Cloud Run

on:
  push:
    branches:
      - main
    paths:
      - 'backend/**'
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy to Cloud Run
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
      
      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}
      
      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2
      
      - name: Deploy to Cloud Run
        run: |
          cd backend
          gcloud run deploy westley-backend \
            --source . \
            --region us-central1 \
            --platform managed \
            --allow-unauthenticated \
            --min-instances 0 \
            --max-instances 10
```

### Setup GitHub Secrets

1. Create a service account in GCP:
```bash
gcloud iam service-accounts create github-deploy \
  --display-name="GitHub Deploy Service Account"

# Grant necessary permissions
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
  --member="serviceAccount:github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"

# Create key
gcloud iam service-accounts keys create key.json \
  --iam-account=github-deploy@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

2. Add to GitHub Secrets:
   - Go to your GitHub repo → Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `GCP_SA_KEY`
   - Value: Contents of `key.json`

---

## 💰 Cost Estimate

**Cloud Run Pricing** (us-central1):
- First 2 million requests/month: FREE
- CPU: $0.00002400 per vCPU-second
- Memory: $0.00000250 per GiB-second

**Example Monthly Cost** (100 recommendations/day):
- ~3,000 requests/month
- ~10 seconds per request
- **Total: ~$2-5/month**

Much cheaper than dedicated VPS!

---

## 📊 Monitoring & Logs

### View Logs
```bash
gcloud run services logs read westley-backend \
  --region us-central1 \
  --limit 50
```

Or use GCP Console:
- Cloud Run → Select service → Logs tab

### Metrics
- Cloud Run → Select service → Metrics tab
- See request count, latency, error rate

---

## 🧪 Testing Deployment

```bash
# Get service URL
BACKEND_URL=$(gcloud run services describe westley-backend \
  --region us-central1 \
  --format 'value(status.url)')

# Test health endpoint
curl $BACKEND_URL/api/health

# Should return: {"status":"ok","timestamp":"..."}
```

---

## 🔧 Updating Environment Variables

```bash
gcloud run services update westley-backend \
  --region us-central1 \
  --update-env-vars EMAIL_HOST=smtp.gmail.com,EMAIL_PORT=587
```

Or delete a variable:
```bash
gcloud run services update westley-backend \
  --region us-central1 \
  --remove-env-vars OLD_VAR_NAME
```

---

## 🐛 Troubleshooting

**Container fails to start**:
- Check logs: `gcloud run services logs read westley-backend`
- Verify all environment variables are set
- Ensure PORT is read from environment (already done in server.js)

**"Service Unavailable"**:
- Check if min-instances is set to 0 (cold start delay)
- Increase timeout if needed
- Check memory limits

**Cannot connect to backend**:
- Verify `--allow-unauthenticated` flag was used
- Check CORS settings in server.js
- Ensure FRONTEND_URL environment variable is correct

---

## ✅ Deployment Checklist

- [ ] GCP project created
- [ ] gcloud CLI installed and authenticated
- [ ] Dockerfile created in `backend/`
- [ ] `.dockerignore` created in `backend/`
- [ ] Backend deployed to Cloud Run
- [ ] Environment variables configured
- [ ] Secrets configured (optional but recommended)
- [ ] API URL obtained
- [ ] Frontend `script.js` updated with API URL
- [ ] Health endpoint tested
- [ ] GitHub Actions configured (optional)
- [ ] Stripe webhook URL updated (if using webhooks)

---

## 🚀 Alternative: Google App Engine

If you prefer App Engine instead of Cloud Run:

Create `backend/app.yaml`:
```yaml
runtime: nodejs18
env: standard
instance_class: F1

automatic_scaling:
  min_instances: 0
  max_instances: 10

env_variables:
  NODE_ENV: 'production'
  FRONTEND_URL: 'https://westley-group.com'
```

Deploy:
```bash
cd backend
gcloud app deploy
```

---

**Recommended**: Stick with **Cloud Run** for this use case - it's simpler, cheaper, and more flexible.
