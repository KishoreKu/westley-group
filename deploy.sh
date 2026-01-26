#!/bin/bash

# Westley Group - Deploy Credit Card Finder to Production
# This script commits and pushes all changes to trigger auto-deployment

echo "=================================================="
echo "🚀 Deploying Credit Card Finder Tool"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: Must run from westley-group root directory"
    exit 1
fi

echo "📋 Files to deploy:"
echo "  - Frontend: credit-card-finder/"
echo "  - Backend: backend/"
echo "  - GitHub Actions: .github/workflows/deploy-backend-gcp.yml"
echo "  - Documentation: CREDIT-CARD-FINDER.md, GCP-QUICK-START.md"
echo ""

# Stage all new files
echo "📦 Staging files..."
git add .gitignore
git add .github/workflows/deploy-backend-gcp.yml
git add backend/
git add credit-card-finder/
git add CREDIT-CARD-FINDER.md
git add GCP-QUICK-START.md

echo ""
echo "📝 Git status:"
git status

echo ""
read -p "Ready to commit and push? (y/N): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Deployment cancelled"
    exit 1
fi

# Commit
echo ""
echo "💾 Committing changes..."
git commit -m "feat: Add AI-powered credit card recommendation tool

- Add complete backend API (Node.js + Express)
  - Stripe payment integration ($19 one-time fee)
  - OpenAI GPT-4 recommendations
  - SMTP email delivery
  - Rate limiting and security
  
- Add frontend landing page
  - Conversion-optimized copy
  - 7-question interactive questionnaire
  - Stripe Checkout integration
  - Results display with email delivery
  
- Add GCP Cloud Run deployment support
  - Dockerfile for containerization
  - GitHub Actions auto-deployment
  - Comprehensive deployment documentation
  
- Add comprehensive documentation
  - Setup guides
  - Testing procedures
  - Deployment walkthroughs"

# Push
echo ""
echo "⬆️  Pushing to GitHub..."
git push origin main

echo ""
echo "=================================================="
echo "✅ Deployment Complete!"
echo "=================================================="
echo ""
echo "📍 Frontend will be live at:"
echo "   https://westley-group.com/credit-card-finder/"
echo ""
echo "🔄 Auto-deployment status:"
echo "   Check: https://github.com/KishoreKu/westley-group/actions"
echo ""
echo "⏳ Frontend deploys in ~1-2 minutes via GitHub Actions"
echo ""
echo "🔧 Next steps:"
echo "   1. Deploy backend to Google Cloud Run (see GCP-QUICK-START.md)"
echo "   2. Update credit-card-finder/script.js with backend API URL"
echo "   3. Commit and push API URL update"
echo "   4. Test full flow end-to-end"
echo ""
echo "📖 Documentation:"
echo "   - GCP-QUICK-START.md - Backend deployment"
echo "   - CREDIT-CARD-FINDER.md - Project overview"
echo "   - backend/GCP-DEPLOYMENT.md - Detailed GCP guide"
echo ""
