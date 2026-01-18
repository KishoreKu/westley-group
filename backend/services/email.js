const nodemailer = require('nodemailer');

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT),
            secure: process.env.EMAIL_SECURE === 'true',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    async sendRecommendation(recipientEmail, recommendation, userProfile) {
        const htmlContent = this.formatRecommendationEmail(recommendation, userProfile);

        const mailOptions = {
            from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`,
            to: recipientEmail,
            subject: '✅ Your Personalized Credit Card Recommendation',
            html: htmlContent,
            text: this.formatRecommendationText(recommendation)
        };

        try {
            const info = await this.transporter.sendMail(mailOptions);
            console.log('Email sent successfully:', info.messageId);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Email send error:', error);
            throw new Error('Failed to send email: ' + error.message);
        }
    }

    formatRecommendationEmail(recommendation, userProfile) {
        return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      line-height: 1.6;
      color: #1e293b;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
      color: white;
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 700;
    }
    .content {
      padding: 32px 24px;
    }
    .card {
      background: #f1f5f9;
      border-left: 4px solid #6366F1;
      padding: 20px;
      margin: 24px 0;
      border-radius: 8px;
    }
    .card h2 {
      margin: 0 0 12px 0;
      font-size: 18px;
      color: #6366F1;
    }
    .card p {
      margin: 8px 0;
      color: #475569;
    }
    .footer {
      background: #f8fafc;
      padding: 24px;
      text-align: center;
      font-size: 14px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    .badge {
      display: inline-block;
      background: #10B981;
      color: white;
      padding: 4px 12px;
      border-radius: 16px;
      font-size: 12px;
      font-weight: 600;
      margin: 8px 4px 0 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎯 Your Personalized Credit Card Recommendation</h1>
      <p style="margin: 8px 0 0 0; opacity: 0.9;">Based on your financial profile</p>
    </div>
    
    <div class="content">
      <p>Thank you for using our Credit Card Finder tool! Based on your profile, here's our expert recommendation:</p>
      
      <div class="card">
        ${recommendation}
      </div>
      
      <h3 style="color: #1e293b; margin-top: 32px;">Your Profile:</h3>
      <ul style="color: #475569;">
        <li>Credit Score: ${userProfile.creditScore}</li>
        <li>Monthly Income: ${userProfile.income}</li>
        <li>Primary Goal: ${userProfile.goal}</li>
        <li>Top Spending: ${userProfile.spending.join(', ')}</li>
      </ul>
      
      <p style="margin-top: 32px; padding: 16px; background: #fef3c7; border-radius: 8px; border-left: 4px solid #f59e0b;">
        <strong>⚠️ Important:</strong> This is a decision-support tool, not financial advice. Please review card terms before applying.
      </p>
    </div>
    
    <div class="footer">
      <p><strong>Westley Group</strong></p>
      <p>© ${new Date().getFullYear()} Westley Group. All rights reserved.</p>
      <p style="margin-top: 16px; font-size: 12px;">
        Questions? Contact us at <a href="mailto:hello@westley-group.com">hello@westley-group.com</a>
      </p>
    </div>
  </div>
</body>
</html>
    `.trim();
    }

    formatRecommendationText(recommendation) {
        // Plain text version for email clients that don't support HTML
        return `
YOUR PERSONALIZED CREDIT CARD RECOMMENDATION
============================================

${recommendation}

---
This is a decision-support tool, not financial advice.
Please review card terms before applying.

© ${new Date().getFullYear()} Westley Group
    `.trim();
    }

    async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ Email server connection verified');
            return true;
        } catch (error) {
            console.error('❌ Email server connection failed:', error);
            return false;
        }
    }
}

module.exports = new EmailService();
