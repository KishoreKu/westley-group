const Stripe = require('stripe');

class StripeService {
    constructor() {
        this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    }

    async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.create({
                amount: amount, // Amount in cents
                currency: currency,
                metadata: metadata,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            return {
                clientSecret: paymentIntent.client_secret,
                paymentIntentId: paymentIntent.id
            };
        } catch (error) {
            console.error('Stripe payment intent creation error:', error);
            throw new Error('Failed to create payment intent: ' + error.message);
        }
    }

    async verifyPayment(paymentIntentId) {
        try {
            const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

            return {
                paid: paymentIntent.status === 'succeeded',
                amount: paymentIntent.amount,
                currency: paymentIntent.currency,
                status: paymentIntent.status,
                metadata: paymentIntent.metadata
            };
        } catch (error) {
            console.error('Stripe payment verification error:', error);
            throw new Error('Failed to verify payment: ' + error.message);
        }
    }

    async handleWebhook(payload, signature) {
        try {
            const event = this.stripe.webhooks.constructEvent(
                payload,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );

            return event;
        } catch (error) {
            console.error('Stripe webhook error:', error);
            throw new Error('Webhook signature verification failed: ' + error.message);
        }
    }
}

module.exports = new StripeService();
