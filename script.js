// ===================================
// NAVIGATION
// ===================================

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
mobileMenuBtn?.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileMenuBtn.classList.toggle('active');
});

// Smooth scroll for navigation links
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const offset = 80;
                const targetPosition = target.offsetTop - offset;
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active link
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Close mobile menu
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
            }
        }
    });
});

// ===================================
// HERO STATS COUNTER
// ===================================

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Intersection Observer for counter animation
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            const target = parseFloat(entry.target.getAttribute('data-target'));
            animateCounter(entry.target, target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-value').forEach(stat => {
    counterObserver.observe(stat);
});

// ===================================
// HERO CHART
// ===================================

const heroChart = document.getElementById('heroChart');
if (heroChart) {
    const ctx = heroChart.getContext('2d');
    const width = heroChart.width = heroChart.offsetWidth;
    const height = heroChart.height = heroChart.offsetHeight;
    
    // Generate sample data
    const dataPoints = 30;
    const data = [];
    for (let i = 0; i < dataPoints; i++) {
        data.push({
            x: i,
            y: Math.sin(i / 3) * 30 + 50 + Math.random() * 20
        });
    }
    
    // Animation variables
    let animationProgress = 0;
    const animationDuration = 2000;
    let startTime = null;
    
    function drawChart(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        animationProgress = Math.min(elapsed / animationDuration, 1);
        
        ctx.clearRect(0, 0, width, height);
        
        // Draw gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, 'rgba(99, 102, 241, 0.3)');
        gradient.addColorStop(1, 'rgba(99, 102, 241, 0)');
        
        // Draw area
        ctx.beginPath();
        ctx.moveTo(0, height);
        
        const pointsToShow = Math.floor(dataPoints * animationProgress);
        for (let i = 0; i <= pointsToShow; i++) {
            const x = (i / (dataPoints - 1)) * width;
            const y = height - (data[i].y / 100) * height;
            
            if (i === 0) {
                ctx.lineTo(x, y);
            } else {
                const prevX = ((i - 1) / (dataPoints - 1)) * width;
                const prevY = height - (data[i - 1].y / 100) * height;
                const cpX = (prevX + x) / 2;
                ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
                ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
            }
        }
        
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();
        
        // Draw line
        ctx.beginPath();
        for (let i = 0; i <= pointsToShow; i++) {
            const x = (i / (dataPoints - 1)) * width;
            const y = height - (data[i].y / 100) * height;
            
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                const prevX = ((i - 1) / (dataPoints - 1)) * width;
                const prevY = height - (data[i - 1].y / 100) * height;
                const cpX = (prevX + x) / 2;
                ctx.quadraticCurveTo(prevX, prevY, cpX, (prevY + y) / 2);
                ctx.quadraticCurveTo(cpX, (prevY + y) / 2, x, y);
            }
        }
        
        ctx.strokeStyle = '#6366F1';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw points
        for (let i = 0; i <= pointsToShow; i++) {
            const x = (i / (dataPoints - 1)) * width;
            const y = height - (data[i].y / 100) * height;
            
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#6366F1';
            ctx.fill();
        }
        
        if (animationProgress < 1) {
            requestAnimationFrame(drawChart);
        }
    }
    
    // Start animation when chart is visible
    const chartObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                requestAnimationFrame(drawChart);
                chartObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    chartObserver.observe(heroChart);
}

// ===================================
// PLATFORM FEATURES INTERACTION
// ===================================

const featureItems = document.querySelectorAll('.feature-item');

featureItems.forEach(item => {
    item.addEventListener('click', () => {
        featureItems.forEach(f => f.classList.remove('active'));
        item.classList.add('active');
    });
});

// ===================================
// SCROLL ANIMATIONS
// ===================================

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Add animation to cards
document.querySelectorAll('.solution-card, .insight-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    animateOnScroll.observe(card);
});

// ===================================
// BUTTON INTERACTIONS
// ===================================

const scheduleDemoBtn = document.getElementById('scheduleDemo');
const watchVideoBtn = document.getElementById('watchVideo');
const ctaDemoBtn = document.getElementById('ctaDemo');
const ctaContactBtn = document.getElementById('ctaContact');

function showModal(title, message) {
    // Create modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: linear-gradient(135deg, hsl(222, 47%, 16%) 0%, hsl(222, 47%, 18%) 100%);
        padding: 3rem;
        border-radius: 1.5rem;
        max-width: 500px;
        width: 90%;
        border: 1px solid hsl(222, 47%, 25%);
        box-shadow: 0 20px 25px rgba(0, 0, 0, 0.5);
        animation: slideUp 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h2 style="font-family: 'Space Grotesk', sans-serif; font-size: 2rem; margin-bottom: 1rem; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">${title}</h2>
        <p style="color: hsl(220, 17%, 75%); margin-bottom: 2rem; line-height: 1.7;">${message}</p>
        <button id="closeModal" style="
            width: 100%;
            padding: 1rem 2rem;
            background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
            color: white;
            border: none;
            border-radius: 0.75rem;
            font-weight: 600;
            cursor: pointer;
            font-size: 1rem;
            transition: transform 0.25s ease;
        ">Close</button>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes slideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        #closeModal:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    // Close modal
    const closeBtn = document.getElementById('closeModal');
    const closeModal = () => {
        modal.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }, 300);
    };
    
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    
    // Add fadeOut animation
    style.textContent += `
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
}

scheduleDemoBtn?.addEventListener('click', () => {
    showModal(
        'Schedule a Demo',
        'Thank you for your interest! Our enterprise solutions team will contact you within 24 hours to schedule a personalized demo of our fintech platform.'
    );
});

watchVideoBtn?.addEventListener('click', () => {
    showModal(
        'Platform Overview',
        'Our comprehensive video walkthrough showcases how Westley Group\'s enterprise fintech solutions can transform your financial operations. Contact our team to receive the full demo video.'
    );
});

ctaDemoBtn?.addEventListener('click', () => {
    showModal(
        'Schedule a Demo',
        'Thank you for your interest! Our enterprise solutions team will contact you within 24 hours to schedule a personalized demo of our fintech platform.'
    );
});

ctaContactBtn?.addEventListener('click', () => {
    showModal(
        'Contact Sales',
        'Our sales team is ready to discuss how Westley Group can help transform your financial operations. We\'ll reach out to you within one business day.'
    );
});

// ===================================
// PARALLAX EFFECT FOR GRADIENT ORBS
// ===================================

window.addEventListener('mousemove', (e) => {
    const orbs = document.querySelectorAll('.gradient-orb');
    const mouseX = e.clientX / window.innerWidth;
    const mouseY = e.clientY / window.innerHeight;
    
    orbs.forEach((orb, index) => {
        const speed = (index + 1) * 20;
        const x = (mouseX - 0.5) * speed;
        const y = (mouseY - 0.5) * speed;
        orb.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ===================================
// TESTIMONIALS AUTO-SCROLL
// ===================================

let testimonialIndex = 0;
const testimonialCards = document.querySelectorAll('.testimonial-card');

function rotateTestimonials() {
    testimonialCards.forEach((card, index) => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        if (index === testimonialIndex) {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0.6';
            card.style.transform = 'scale(0.95)';
        }
    });
    
    testimonialIndex = (testimonialIndex + 1) % testimonialCards.length;
}

// Auto-rotate testimonials every 5 seconds
if (testimonialCards.length > 0) {
    setInterval(rotateTestimonials, 5000);
    rotateTestimonials(); // Initial call
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================

// Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================

// Keyboard navigation for cards
document.querySelectorAll('.solution-card, .insight-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = card.querySelector('a');
            if (link) link.click();
        }
    });
});

// Focus trap for modal (when implemented)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.querySelector('[style*="z-index: 10000"]');
        if (modal) {
            const closeBtn = modal.querySelector('#closeModal');
            if (closeBtn) closeBtn.click();
        }
    }
});

// ===================================
// CONSOLE EASTER EGG
// ===================================

console.log('%c🚀 Westley Group', 'font-size: 24px; font-weight: bold; background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%); -webkit-background-clip: text; color: transparent;');
console.log('%cEnterprise Fintech Solutions', 'font-size: 14px; color: #8B5CF6;');
console.log('%cInterested in joining our team? Email: careers@westleygroup.com', 'font-size: 12px; color: #6366F1;');

// ===================================
// INITIALIZATION
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Westley Group website initialized');
    
    // Add loading animation complete class
    document.body.classList.add('loaded');
});
