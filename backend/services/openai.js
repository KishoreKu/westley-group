const OpenAI = require('openai');

class OpenAIService {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        });
        this.model = process.env.OPENAI_MODEL || 'gpt-4';
    }

    async generateRecommendation(userProfile) {
        const systemPrompt = `You are a US consumer finance decision expert.

Your job is to recommend the best credit card for the user based strictly on their financial profile.

Be decisive, practical, and personalized.
Avoid generic explanations.
Do not overwhelm the user.`;

        const userPrompt = `User profile:
- Credit score range: ${userProfile.creditScore}
- Monthly income: ${userProfile.income}
- Spending categories: ${userProfile.spending.join(', ')}
- Primary goal: ${userProfile.goal}
- Carries balance: ${userProfile.carriesBalance}
- Annual fee comfort: ${userProfile.annualFee}
- Credit history length: ${userProfile.creditHistory}

Task:
1. Rank the top 3 US credit cards for this user.
2. Clearly state which card is #1 and why it is the best fit.
3. Explain why the other options are weaker.
4. Warn the user about bad choices for their situation.
5. End with a clear recommended next action.

Be confident and specific.`;

        try {
            const completion = await this.client.chat.completions.create({
                model: this.model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 1500
            });

            const recommendation = completion.choices[0].message.content;

            return {
                recommendation: recommendation,
                tokensUsed: completion.usage.total_tokens,
                model: this.model
            };
        } catch (error) {
            console.error('OpenAI API error:', error);

            if (error.status === 401) {
                throw new Error('Invalid OpenAI API key');
            } else if (error.status === 429) {
                throw new Error('OpenAI rate limit exceeded. Please try again later.');
            } else if (error.status === 500) {
                throw new Error('OpenAI service is temporarily unavailable');
            }

            throw new Error('Failed to generate recommendation: ' + error.message);
        }
    }

    formatUserProfile(formData) {
        return {
            creditScore: formData.creditScore,
            income: formData.income,
            spending: formData.spending || [],
            goal: formData.goal,
            carriesBalance: formData.carriesBalance,
            annualFee: formData.annualFee,
            creditHistory: formData.creditHistory
        };
    }
}

module.exports = new OpenAIService();
