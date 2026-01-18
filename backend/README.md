# Westley Group Backend API

Backend server for the Credit Card Finder tool - AI-powered credit card recommendations with Stripe payment processing.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- API keys for:  - Stripe (test & live keys)
  - OpenAI
  - Email SMTP credentials

### Installation

```bash
cd backend
npm install
```

### Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your API keys:

```env
# Stripe Keys (get from https://dashboard.stripe.com/apikeys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# OpenAI Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-...

# Email SMTP Settings
# For Gmail/Google Workspace:
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# For Microsoft/Outlook:
# EMAIL_HOST=smtp.office365.com
# EMAIL_PORT=587

# For Namecheap:
# EMAIL_HOST=mail.privateemail.com
# EMAIL_PORT=587
```

**Important for Gmail:**
- Use an [App Password](https://support.google.com/accounts/answer/185833), not your regular password
- Enable 2-Step Verification first
- Generate App Password at: https://myaccount.google.com/apppasswords

### Running the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## 📡 API Endpoints

### `GET /api/health`
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2026-01-18T12:00:00.000Z",
  "environment": "production"
}
```

### `POST /api/create-payment-intent`
Create a Stripe payment intent for $19 charge.

**Request:**
```json
{
  "email": "user@example.com",
  "metadata": {
    "source": "credit-card-finder"
  }
}
```

**Response:**
```json
{
  "clientSecret": "pi_xxx_secret_xxx",
  "paymentIntentId": "pi_xxx",
  "amount": 1900,
  "currency": "usd"
}
```

### `POST /api/generate-recommendation`
Generate AI credit card recommendation (requires completed payment).

**Request:**
```json
{
  "paymentIntentId": "pi_xxx",
  "email": "user@example.com",
  "userProfile": {
    "creditScore": "740+",
    "income": "$5,000–$10,000",
    "spending": ["Groceries", "Gas", "Dining"],
    "goal": "Cashback",
    "carriesBalance": "No",
    "annualFee": "Under $95",
    "creditHistory": "3+ years"
  }
}
```

**Response:**
```json
{
  "success": true,
  "recommendation": "AI-generated recommendation text...",
  "metadata": {
    "tokensUsed": 850,
    "model": "gpt-4",
    "emailSent": true
  }
}
```

### `POST /api/webhook`
Stripe webhook endpoint (for production tracking).

## 🚀 Deployment

### Option 1: Google Cloud Run (Recommended)

**Easiest and most scalable option!**

See [GCP-DEPLOYMENT.md](GCP-DEPLOYMENT.md) for complete instructions.

**Quick Deploy:**
```bash
cd backend

# Authenticate with GCP
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy (builds and deploys automatically)
gcloud run deploy westley-backend \
  --source . \
  --region us-central1 \
  --allow-unauthenticated
```

Then set environment variables in GCP Console or via CLI.

**Benefits:**
- ✅ Serverless (auto-scaling, pay-per-use)
- ✅ ~$2-5/month for moderate traffic
- ✅ No server management
- ✅ Auto HTTPS and load balancing

---

### Option 2: cPanel Node.js App

### Step 1: Upload Files

Upload the `backend` folder to your cPanel account via:
- FTP
- cPanel File Manager
- Git deployment

Recommended location: `~/westley-group-backend/`

### Step 2: Setup Node.js App in cPanel

1. **Login to cPanel**
2. **Navigate to "Setup Node.js App"**
3. **Create Application:**
   - **Node.js version**: 18.x or higher
   - **Application mode**: Production
   - **Application root**: `westley-group-backend`
   - **Application URL**: Choose subdomain (e.g., `api.westley-group.com`)
   - **Application startup file**: `server.js`
   - **Environment variables**: Add all from `.env` file

4. **Install Dependencies:**
   - Click "Run NPM Install" button
   - Or via terminal: `npm install --production`

5. **Start Application:**
   - Click "Restart" button
   - Server should now be running

### Step 3: Configure Environment Variables

In cPanel Node.js App settings, add all environment variables:

```
PORT=3000
NODE_ENV=production
FRONTEND_URL=https://westley-group.com
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
OPENAI_API_KEY=sk-...
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM_NAME=Westley Group
EMAIL_FROM_ADDRESS=noreply@westley-group.com
PAYMENT_AMOUNT=1900
PAYMENT_CURRENCY=usd
```

### Step 4: Test the Deployment

```bash
curl https://api.westley-group.com/api/health
```

Should return:
```json
{"status":"ok","timestamp":"...","environment":"production"}
```

## 🧪 Testing

### Test Payment Flow

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **Requires authentication**: `4000 0025 0000 3155`

### Test Email Delivery

Send a test request to the recommendation endpoint with a valid payment.

## 🔐 Security

- Rate limiting: 100 requests per 15 minutes
- Payment rate limiting: 10 attempts per hour
- CORS configured for frontend domain only
- Helmet.js security headers
- Environment variables for all sensitive data

## 📊 Monitoring

Check logs in cPanel:
1. Go to "Setup Node.js App"
2. Click on your application
3. View "Application logs" section

## 🆘 Troubleshooting

**Server won't start:**
- Check Node.js version (must be 18+)
- Verify all environment variables are set
- Check application logs in cPanel

**Payment failures:**
- Verify Stripe keys are correct (test vs live)
- Check Stripe Dashboard for error details

**Email not sending:**
- Verify SMTP credentials
- Check email server allows SMTP connections
- Test with `npm run dev` locally first

**OpenAI errors:**
- Verify API key is valid
- Check OpenAI account has credits
- Review rate limits

## 📝 License

Proprietary - Westley Group
