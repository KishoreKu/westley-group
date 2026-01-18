require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const stripeService = require('./services/stripe');
const openaiService = require('./services/openai');
const emailService = require('./services/email');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());

// CORS configuration
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:8000',
    optionsSuccessStatus: 200,
    credentials: true
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Stricter rate limit for payment endpoints
const paymentLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10 // limit each IP to 10 payment attempts per hour
});

// =====================================================
// ROUTES
// =====================================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Create Stripe payment intent
app.post('/api/create-payment-intent', paymentLimiter, async (req, res) => {
    try {
        const { email, metadata } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                error: 'Invalid email format'
            });
        }

        const amount = parseInt(process.env.PAYMENT_AMOUNT) || 1900;
        const currency = process.env.PAYMENT_CURRENCY || 'usd';

        const paymentData = await stripeService.createPaymentIntent(
            amount,
            currency,
            {
                customerEmail: email,
                ...metadata
            }
        );

        res.json({
            clientSecret: paymentData.clientSecret,
            paymentIntentId: paymentData.paymentIntentId,
            amount: amount,
            currency: currency
        });

    } catch (error) {
        console.error('Payment intent creation error:', error);
        res.status(500).json({
            error: 'Failed to create payment intent',
            message: error.message
        });
    }
});

// Generate credit card recommendation
app.post('/api/generate-recommendation', async (req, res) => {
    try {
        const { paymentIntentId, email, userProfile } = req.body;

        // Validate required fields
        if (!paymentIntentId) {
            return res.status(400).json({
                error: 'Payment intent ID is required'
            });
        }

        if (!email) {
            return res.status(400).json({
                error: 'Email is required'
            });
        }

        if (!userProfile) {
            return res.status(400).json({
                error: 'User profile data is required'
            });
        }

        // Validate user profile completeness
        const requiredFields = ['creditScore', 'income', 'spending', 'goal', 'carriesBalance', 'annualFee', 'creditHistory'];
        const missingFields = requiredFields.filter(field => !userProfile[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Incomplete user profile',
                missingFields: missingFields
            });
        }

        // 1. Verify payment was successful
        console.log('Verifying payment:', paymentIntentId);
        const paymentVerification = await stripeService.verifyPayment(paymentIntentId);

        if (!paymentVerification.paid) {
            return res.status(402).json({
                error: 'Payment not completed',
                status: paymentVerification.status
            });
        }

        console.log('Payment verified successfully');

        // 2. Generate AI recommendation
        console.log('Generating AI recommendation...');
        const formattedProfile = openaiService.formatUserProfile(userProfile);
        const aiResult = await openaiService.generateRecommendation(formattedProfile);

        console.log('AI recommendation generated, tokens used:', aiResult.tokensUsed);

        // 3. Send email with recommendation
        console.log('Sending email to:', email);
        await emailService.sendRecommendation(email, aiResult.recommendation, formattedProfile);

        console.log('Email sent successfully');

        // 4. Return recommendation to frontend
        res.json({
            success: true,
            recommendation: aiResult.recommendation,
            metadata: {
                tokensUsed: aiResult.tokensUsed,
                model: aiResult.model,
                emailSent: true
            }
        });

    } catch (error) {
        console.error('Recommendation generation error:', error);

        // More specific error messages
        if (error.message.includes('payment')) {
            res.status(402).json({
                error: 'Payment verification failed',
                message: error.message
            });
        } else if (error.message.includes('OpenAI')) {
            res.status(503).json({
                error: 'AI service temporarily unavailable',
                message: 'Please try again in a moment'
            });
        } else if (error.message.includes('email')) {
            // Still return recommendation even if email fails
            res.status(207).json({
                success: true,
                recommendation: error.recommendation || 'Recommendation generated but email failed',
                emailError: 'Email delivery failed. Please contact support.',
                message: error.message
            });
        } else {
            res.status(500).json({
                error: 'Failed to generate recommendation',
                message: error.message
            });
        }
    }
});

// Stripe webhook handler (optional for production)
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = await stripeService.handleWebhook(req.body, sig);

        // Handle different event types
        switch (event.type) {
            case 'payment_intent.succeeded':
                console.log('Payment succeeded:', event.data.object.id);
                // You could store this in a database for record-keeping
                break;
            case 'payment_intent.payment_failed':
                console.log('Payment failed:', event.data.object.id);
                break;
            default:
                console.log('Unhandled event type:', event.type);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        path: req.path
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
    try {
        // Verify email connection on startup
        const emailConnected = await emailService.verifyConnection();
        if (!emailConnected) {
            console.warn('⚠️  Email service not properly configured. Emails will fail.');
        }

        app.listen(PORT, () => {
            console.log('='.repeat(50));
            console.log('🚀 Westley Group Backend Server');
            console.log('='.repeat(50));
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`💳 Stripe: ${process.env.STRIPE_SECRET_KEY ? 'Configured' : '❌ NOT CONFIGURED'}`);
            console.log(`🤖 OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : '❌ NOT CONFIGURED'}`);
            console.log(`📧 Email: ${emailConnected ? 'Connected' : '❌ NOT CONNECTED'}`);
            console.log('='.repeat(50));
            console.log(`\n💡 API endpoints:`);
            console.log(`   GET  /api/health`);
            console.log(`   POST /api/create-payment-intent`);
            console.log(`   POST /api/generate-recommendation`);
            console.log(`   POST /api/webhook`);
            console.log('');
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received, shutting down gracefully...');
    process.exit(0);
});

startServer();
