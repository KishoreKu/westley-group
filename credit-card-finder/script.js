// Configuration
const API_URL = 'https://westley-backend-202527262438.us-central1.run.app';
const STRIPE_PUBLIC_KEY = 'pk_test_51SrDKzH8t0qEFzSPMDw0UQPOKp8px2NNF9BylxeLYhmFw6H042AVUD6fknzyDQ2CMz5UOgggtkBulrf8zOdQnBDp00AY5mh49g';

let currentStep = 1;
const totalSteps = 8; // 7 questions + email
let stripe;
let elements;
let paymentIntentId;

// Form data storage
const formData = {
    creditScore: null,
    income: null,
    spending: [],
    goal: null,
    carriesBalance: null,
    annualFee: null,
    creditHistory: null,
    email: null
};

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
    //initializeStripe();
});

function initializeEventListeners() {
    // CTA Buttons
    const mainCta = document.getElementById('mainCta');
    const pricingCta = document.getElementById('pricingCta');

    if (mainCta) mainCta.addEventListener('click', openQuestionnaire);
    if (pricingCta) pricingCta.addEventListener('click', openQuestionnaire);

    // Questionnaire navigation
    const nextBtn = document.getElementById('nextBtn');
    const prevBtn = document.getElementById('prevBtn');
    const payBtn = document.getElementById('payBtn');
    const closeBtn = document.getElementById('closeQuestionnaire');

    if (nextBtn) nextBtn.addEventListener('click', nextStep);
    if (prevBtn) prevBtn.addEventListener('click', prevStep);
    if (payBtn) payBtn.addEventListener('click', handlePayment);
    if (closeBtn) closeBtn.addEventListener('click', closeQuestionnaire);

    // Close results
    const closeResults = document.getElementById('closeResults');
    if (closeResults) closeResults.addEventListener('click', () => {
        document.getElementById('resultsOverlay').style.display = 'none';
    });

    // Radio button auto-advance
    setupRadioAutoAdvance();

    // Checkbox validation
    setupCheckboxValidation();
}

// ===================================
// QUESTIONNAIRE FLOW
// ===================================

function openQuestionnaire() {
    const overlay = document.getElementById('questionnaireOverlay');
    overlay.classList.add('active');
    updateProgress();
}

function closeQuestionnaire() {
    const overlay = document.getElementById('questionnaireOverlay');
    overlay.classList.remove('active');
    resetQuestionnaire();
}

function nextStep() {
    if (!validateCurrentStep()) {
        return;
    }

    saveCurrentStepData();

    if (currentStep < totalSteps) {
        currentStep++;
        updateStepDisplay();
        updateProgress();
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        updateStepDisplay();
        updateProgress();
    }
}

function updateStepDisplay() {
    const steps = document.querySelectorAll('.question-step');
    steps.forEach((step, index) => {
        step.classList.remove('active');
        if (index + 1 === currentStep) {
            step.classList.add('active');
        }
    });

    // Update navigation buttons
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const payBtn = document.getElementById('payBtn');

    if (currentStep === 1) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-flex';
    }

    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        payBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        payBtn.style.display = 'none';
    }
}

function updateProgress() {
    const progressFill = document.getElementById('progressFill');
    const currentStepDisplay = document.getElementById('currentStep');

    const progress = (currentStep / totalSteps) * 100;
    progressFill.style.width = `${progress}%`;
    currentStepDisplay.textContent = currentStep;
}

function validateCurrentStep() {
    const currentStepEl = document.querySelector(`.question-step[data-step="${currentStep}"]`);

    if (!currentStepEl) return true;

    // For radio buttons (questions 1, 2, 4, 5, 6, 7)
    const radioInputs = currentStepEl.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
        const name = radioInputs[0].name;
        const checked = currentStepEl.querySelector(`input[name="${name}"]:checked`);
        if (!checked) {
            alert('Please select an option to continue.');
            return false;
        }
    }

    // For checkboxes (question 3 - spending)
    const checkboxInputs = currentStepEl.querySelectorAll('input[type="checkbox"]');
    if (checkboxInputs.length > 0) {
        const checked = currentStepEl.querySelectorAll('input[type="checkbox"]:checked');
        if (checked.length === 0) {
            showError('spendingError', 'Please select at least one spending category.');
            return false;
        }
        if (checked.length > 3) {
            showError('spendingError', 'Please select up to 3 categories only.');
            return false;
        }
        hideError('spendingError');
    }

    // For email input (step 8)
    const emailInput = currentStepEl.querySelector('#emailInput');
    if (emailInput) {
        if (!emailInput.value || !isValidEmail(emailInput.value)) {
            alert('Please enter a valid email address.');
            return false;
        }
    }

    return true;
}

function saveCurrentStepData() {
    const currentStepEl = document.querySelector(`.question-step[data-step="${currentStep}"]`);

    if (!currentStepEl) return;

    // Save radio button data
    const radioInputs = currentStepEl.querySelectorAll('input[type="radio"]');
    if (radioInputs.length > 0) {
        const name = radioInputs[0].name;
        const checked = currentStepEl.querySelector(`input[name="${name}"]:checked`);
        if (checked && formData.hasOwnProperty(name)) {
            formData[name] = checked.value;
        }
    }

    // Save checkbox data
    const checkboxInputs = currentStepEl.querySelectorAll('input[type="checkbox"]');
    if (checkboxInputs.length > 0) {
        const checked = currentStepEl.querySelectorAll('input[type="checkbox"]:checked');
        formData.spending = Array.from(checked).map(cb => cb.value);
    }

    // Save email
    const emailInput = currentStepEl.querySelector('#emailInput');
    if (emailInput) {
        formData.email = emailInput.value;
    }
}

// ===================================
// UI HELPERS
// ===================================

function setupRadioAutoAdvance() {
    const radioInputs = document.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(radio => {
        radio.addEventListener('change', () => {
            // Auto-advance after a short delay
            setTimeout(() => {
                if (currentStep < 7 && currentStep !== 3) { // Skip auto-advance for spending question
                    nextStep();
                }
            }, 300);
        });
    });
}

function setupCheckboxValidation() {
    const checkboxes = document.querySelectorAll('input[name="spending"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            const checked = document.querySelectorAll('input[name="spending"]:checked');
            if (checked.length > 3) {
                checkbox.checked = false;
                showError('spendingError', 'Maximum 3 categories allowed');
            } else {
                hideError('spendingError');
            }
        });
    });
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.add('show');
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.remove('show');
    }
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function resetQuestionnaire() {
    currentStep = 1;
    updateStepDisplay();
    updateProgress();

    // Clear form
    document.getElementById('questionnaireForm').reset();

    // Reset formData
    Object.keys(formData).forEach(key => {
        if (key === 'spending') {
            formData[key] = [];
        } else {
            formData[key] = null;
        }
    });
}

// ===================================
// PAYMENT HANDLING
// ===================================

async function handlePayment() {
    if (!validateCurrentStep()) {
        return;
    }

    saveCurrentStepData();

    // Show loading
    showLoading('Processing payment and generating recommendation...');

    try {
        // Create payment intent
        const paymentResponse = await fetch(`${API_URL}/api/create-payment-intent`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: formData.email,
                metadata: {
                    source: 'credit-card-finder',
                    timestamp: new Date().toISOString()
                }
            })
        });

        if (!paymentResponse.ok) {
            throw new Error('Failed to create payment');
        }

        const paymentData = await paymentResponse.json();
        paymentIntentId = paymentData.paymentIntentId;

        // For testing: Skip Stripe UI and directly generate recommendation
        // In production, you would redirect to Stripe Checkout here
        const recommendationResponse = await fetch(`${API_URL}/api/generate-recommendation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentIntentId: paymentIntentId,
                email: formData.email,
                userProfile: {
                    creditScore: formData.creditScore,
                    income: formData.income,
                    spending: formData.spending,
                    goal: formData.goal,
                    carriesBalance: formData.carriesBalance,
                    annualFee: formData.annualFee,
                    creditHistory: formData.creditHistory
                }
            })
        });

        if (!recommendationResponse.ok) {
            const errorData = await recommendationResponse.json();
            throw new Error(errorData.message || 'Failed to generate recommendation');
        }

        const data = await recommendationResponse.json();

        hideLoading();
        closeQuestionnaire();
        showResults(data.recommendation);

    } catch (error) {
        hideLoading();
        console.error('Payment error:', error);
        alert(`Error: ${error.message}\n\nPlease try again or contact support at hello@westley-group.com`);
    }
}

async function handleSuccessfulPayment(paymentId) {
    showLoading('Generating your personalized recommendation...');

    try {
        const response = await fetch(`${API_URL}/api/generate-recommendation`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                paymentIntentId: paymentId,
                email: formData.email,
                userProfile: {
                    creditScore: formData.creditScore,
                    income: formData.income,
                    spending: formData.spending,
                    goal: formData.goal,
                    carriesBalance: formData.carriesBalance,
                    annualFee: formData.annualFee,
                    creditHistory: formData.creditHistory
                }
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to generate recommendation');
        }

        const data = await response.json();

        hideLoading();
        closeQuestionnaire();
        showResults(data.recommendation);

    } catch (error) {
        hideLoading();
        console.error('Recommendation error:', error);
        alert(`Failed to generate recommendation: ${error.message}\n\nPlease contact support with your payment confirmation.`);
    }
}

// ===================================
// RESULTS DISPLAY
// ===================================

function showResults(recommendation) {
    const resultsOverlay = document.getElementById('resultsOverlay');
    const resultsContent = document.getElementById('resultsContent');

    resultsContent.innerHTML = formatRecommendation(recommendation);
    resultsOverlay.style.display = 'flex';
}

function formatRecommendation(text) {
    // Format the AI response for better readability
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/^#{1,3}\s(.*)$/gm, '<h3>$1</h3>') // Headers
        .replace(/\n\n/g, '</p><p>') // Paragraphs
        .replace(/^(.*)$/gm, '<p>$1</p>'); // Wrap in paragraphs
}

// ===================================
// LOADING STATE
// ===================================

function showLoading(message = 'Processing...') {
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingMessage = document.getElementById('loadingMessage');

    loadingMessage.textContent = message;
    loadingOverlay.style.display = 'flex';
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.style.display = 'none';
}

// ===================================
// STRIPE INITIALIZATION (For Production)
// ===================================

async function initializeStripe() {
    // TODO: Load Stripe public key from environment or backend
    // stripe = Stripe(STRIPE_PUBLIC_KEY);
}
