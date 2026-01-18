# Credit Card Finder Tool

AI-powered credit card recommendation system integrated into the Westley Group website.

## 📁 Project Structure

```
westley-group/
├── backend/                  # Node.js API server
│   ├── services/            # OpenAI, Stripe, Email services
│   ├── server.js            # Express server
│   ├── package.json         #Dependencies
│   └── README.md            # Backend documentation
├── credit-card-finder/      # Frontend application
│   ├── index.html           # Landing page
│   ├── style.css            # Styling
│   └── script.js            # Interactive functionality
└── README.md                # This file
```

## 🚀 Quick Start

### Backend Setup

1.Navigate to backend directory:
```bash
cd backend
npm install
```

2. Configure environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. Start the server:
```bash
npm start
```

See [backend/README.md](backend/README.md) for detailed setup instructions.

### Frontend

The frontend is a static HTML/CSS/JS page that can be accessed at:
- Local: `/credit-card-finder/index.html`
- Production: `https://westley-group.com/credit-card-finder/`

Update the API_URL in `credit-card-finder/script.js` to point to your backend server.

## 🔧 Configuration

### Required API Keys

1. **Stripe**: https://dashboard.stripe.com/apikeys
2. **OpenAI**: https://platform.openai.com/api-keys
3. **Email SMTP**: Your email provider SMTP credentials

### Important URLs to Update

- `credit-card-finder/script.js`: Update `API_URL` constant
- `backend/.env`: Set`FRONTEND_URL` to your production domain

## 📦 Deployment

### Frontend Deployment

The frontend deploys automatically via GitHub Actions to cPanel when you push to `main` branch.

### Backend Deployment

See [backend/README.md](backend/README.md) for cPanel Node.js app setup instructions.

## 💳 Features

- **7-Question Questionnaire**: Collect user financial profile
- **Stripe Payment Integration**: Secure $19 one-time payment
- **AI Recommendations**: GPT-4 powered credit card suggestions
- **Email Delivery**: Results sent via SMTP
- **Instant Results**: On-screen display after payment

## 🧪 Testing

Use Stripe test mode:
- Test card: `4242 4242 4242 4242`
- Any future expiry date
- Any CVC

## 📞 Support

For issues or questions, contact: hello@westley-group.com

## 📝 License

Proprietary - Westley Group
