# AGENTS.md - Westley Group Development Guide

This file contains development guidelines and commands for agentic coding agents working on the Westley Group enterprise fintech website.

## 📋 Project Overview

**Westley Group** is a premium enterprise fintech website showcasing:
- Modern dark theme with glassmorphism effects
- Interactive animations and parallax scrolling
- Responsive design with mobile optimization
- Canvas-based data visualizations
- Modal dialogs and smooth transitions

**Tech Stack**: HTML5, CSS3, Vanilla JavaScript (no dependencies)

---

## 🚀 Build & Development Commands

### Development Workflow
```bash
# No build process required - this is a static website
# Simply open index.html in a browser for development

# For local development with live reload (optional)
npx serve . --port 3000 --cors
```

### Testing Commands
```bash
# No automated test framework is currently configured
# Manual testing checklist:

# 1. Visual Testing
open index.html

# 2. Responsive Testing
# Test at these breakpoints:
# - Desktop: 1024px+
# - Tablet: 768px - 1023px  
# - Mobile: < 768px

# 3. Interactive Testing
# Test all interactive elements:
# - Navigation smooth scroll
# - Mobile menu toggle
# - Hero CTA modals
# - Solution card hover effects
# - Platform feature tabs
# - Testimonial auto-rotation
# - Parallax gradient orbs

# 4. Performance Testing
# Use browser DevTools:
# - Lighthouse audit
# - Network throttling
# - Memory usage
```

### Validation Commands
```bash
# HTML Validation
npx html-validate index.html

# CSS Validation  
npx stylelint index.css

# JavaScript Linting
npx eslint script.js

# Accessibility Testing
npx pa11y index.html
```

### Deployment Commands
```bash
# Deployment is handled via GitHub Actions
# Push to main/master branch triggers automatic FTP deployment

git add .
git commit -m "Your commit message"
git push origin main
```

---

## 🎨 Code Style Guidelines

### HTML Structure & Conventions

#### Document Structure
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`)
- Maintain proper heading hierarchy (h1 → h2 → h3)
- Include comprehensive meta tags for SEO
- Use proper ARIA labels for accessibility

#### Naming Conventions
- Use kebab-case for IDs and classes: `hero-section`, `nav-link`
- Use descriptive names: `schedule-demo-btn` not `btn-1`
- Prefix JavaScript hooks with `js-` if needed: `js-modal-trigger`

#### Code Organization
- Group related elements with comments
- Indent consistently (2 spaces)
- Place scripts before closing `</body>` tag
- Use external CSS and JS files (no inline styles/scripts except where necessary)

### CSS Architecture & Standards

#### CSS Custom Properties (Variables)
- Define all design tokens in `:root` at top of stylesheet
- Group variables by type (colors, spacing, typography, etc.)
- Use semantic naming: `--color-text-primary` not `--color-blue`

#### Class Naming (BEM-inspired)
```css
/* Block */
.hero {}

/* Element */
.hero__title {}
.hero__content {}

/* Modifier */
.hero--scrolled {}
.solution-card--featured {}
```

#### Selector Guidelines
- Avoid deeply nested selectors (max 3 levels)
- Use class selectors over ID selectors for reusability
- Prefer direct child selectors (`>`) for performance
- Use attribute selectors for state: `[aria-expanded="true"]`

#### Responsive Design
- Use mobile-first approach
- Define breakpoints in CSS variables
- Use `min-width` media queries
- Test at standard breakpoints: 768px, 1024px

#### Animation & Transitions
- Use CSS variables for timing functions: `--transition-base`
- Prefer `transform` and `opacity` for performance
- Use `cubic-bezier` easing functions
- Add `will-change` property for complex animations

### JavaScript Standards & Patterns

#### Code Organization
- Use functional programming patterns
- Group related functionality with comment headers
- Use descriptive function names: `animateCounter()` not `anim()`
- Initialize event listeners in `DOMContentLoaded`

#### Variable Naming
- Use camelCase for variables and functions
- Use PascalCase for constructors/classes
- Use UPPER_SNAKE_CASE for constants
- Use descriptive names: `testimonialIndex` not `i`

#### DOM Manipulation
- Cache DOM queries in variables
- Use `querySelector` and `querySelectorAll`
- Prefer `addEventListener` over inline event handlers
- Use event delegation for dynamic content

#### Performance Best Practices
- Debounce scroll and resize events
- Use `IntersectionObserver` for scroll animations
- Implement lazy loading for images
- Use `requestAnimationFrame` for animations

#### Error Handling
- Use optional chaining for safe property access: `element?.classList`
- Wrap critical code in try-catch blocks
- Provide fallbacks for unsupported features
- Log errors with context information

#### Accessibility
- Ensure keyboard navigation support
- Add ARIA labels and roles
- Manage focus for modals and dynamic content
- Provide semantic HTML structure

---

## 🎯 Development Priorities

### When Making Changes

1. **Performance First**
   - Test on mobile devices
   - Check animation performance
   - Validate with Lighthouse

2. **Accessibility Always**
   - Test keyboard navigation
   - Verify screen reader compatibility
   - Check color contrast ratios

3. **Responsive by Default**
   - Test on all breakpoints
   - Ensure touch targets are adequate
   - Verify text readability

4. **Cross-Browser Compatibility**
   - Test in Chrome, Firefox, Safari
   - Check mobile browsers
   - Provide graceful degradation

### Code Review Checklist

#### HTML
- [ ] Semantic structure maintained
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] ARIA labels where needed

#### CSS  
- [ ] CSS variables used consistently
- [ ] Responsive design implemented
- [ ] Performance optimizations applied
- [ ] Cross-browser compatibility tested

#### JavaScript
- [ ] Event listeners properly managed
- [ ] Performance optimizations implemented
- [ ] Error handling included
- [ ] Accessibility features maintained

---

## 🔧 Common Development Tasks

### Adding New Sections
1. Add semantic HTML in appropriate location
2. Follow existing class naming patterns
3. Add responsive breakpoints
4. Include scroll animations if needed
5. Update navigation if section is linkable

### Modifying Styles
1. Check if CSS variable exists first
2. Use existing utility classes
3. Maintain responsive behavior
4. Test on all breakpoints

### Adding Interactions
1. Use existing event listener patterns
2. Implement proper error handling
3. Add accessibility features
4. Include loading states if needed

### Performance Optimization
1. Use `IntersectionObserver` for lazy loading
2. Debounce expensive operations
3. Optimize animations with `transform`
4. Minimize DOM queries

---

## 📱 Testing Guidelines

### Manual Testing Checklist
- [ ] All navigation links work
- [ ] Mobile menu functions correctly
- [ ] Forms validate properly
- [ ] Modals open/close correctly
- [ ] Animations are smooth
- [ ] Responsive design works
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility

### Browser Testing
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)  
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile Safari (iOS)
- Mobile Chrome (Android)

### Performance Targets
- Lighthouse score: 90+
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1

---

## 🚨 Important Notes

### File Structure
```
westley-group/
├── index.html          # Main HTML file
├── index.css           # All styles
├── script.js           # All interactions
├── logo.png            # Company logo
├── README.md           # Project documentation
├── DEPLOYMENT.md       # Deployment guide
├── CPANEL-SETUP.md     # cPanel setup
└── .github/
    └── workflows/
        └── deploy.yml  # Auto-deployment
```

### Deployment
- Automatic deployment via GitHub Actions
- FTP deployment to cPanel hosting
- No build process required
- Push to main/master branch triggers deployment

### Dependencies
- **None** - Pure HTML/CSS/JavaScript
- Google Fonts loaded externally
- No npm packages or build tools
- No framework dependencies

---

## 🎨 Design System Reference

### Color Palette
- Primary: Indigo to Purple gradient
- Background: Deep navy with layered surfaces
- Text: High-contrast white with gray tones
- Success: Green gradient
- Info: Blue gradient

### Typography
- Primary: Inter (clean, modern)
- Display: Space Grotesk (bold, distinctive)
- Fluid scaling with responsive breakpoints

### Spacing Scale
- XS: 0.5rem (8px)
- SM: 1rem (16px)  
- MD: 1.5rem (24px)
- LG: 2rem (32px)
- XL: 3rem (48px)
- 2XL: 4rem (64px)

### Animation Timing
- Fast: 150ms (micro-interactions)
- Base: 250ms (standard interactions)
- Slow: 350ms (complex animations)

---

**Built with ❤️ for enterprise fintech excellence**