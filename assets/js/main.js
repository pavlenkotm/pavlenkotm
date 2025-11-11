// =====================================
//   MODERN PORTFOLIO - 2025 JAVASCRIPT
// =====================================

'use strict';

// ===== CUSTOM CURSOR =====
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
let followerX = 0;
let followerY = 0;

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Animate cursor
function animateCursor() {
    // Smooth cursor movement
    const speed = 0.2;

    cursorX += (mouseX - cursorX) * speed;
    cursorY += (mouseY - cursorY) * speed;

    followerX += (mouseX - followerX) * 0.1;
    followerY += (mouseY - followerY) * 0.1;

    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';

    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';

    requestAnimationFrame(animateCursor);
}

animateCursor();

// Expand cursor on hover
const hoverElements = document.querySelectorAll('a, button, .project-card, .social-link');
hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(1.5)';
        cursorFollower.style.transform = 'scale(1.5)';
    });

    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        cursorFollower.style.transform = 'scale(1)';
    });
});

// ===== ANIMATED BACKGROUND CANVAS =====
const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Particle system
class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = `rgba(0, 217, 255, ${Math.random() * 0.5 + 0.2})`;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Create particles
const particles = [];
const particleCount = 100;

for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 217, 255, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();

// Resize canvas on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// ===== LOADING SCREEN =====
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');

    setTimeout(() => {
        loader.classList.add('hidden');

        // Trigger animations after loading
        initScrollAnimations();
    }, 1500);
});

// ===== NAVIGATION =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

// Navbar scroll effect
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Mobile menu toggle
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close mobile menu on link click
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navToggle?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');

function setActiveNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', setActiveNav);

// ===== TYPING ANIMATION =====
const typingText = document.getElementById('typingText');

const phrases = [
    'Blockchain Developer',
    'Solana Architect',
    'DeFi Builder',
    'Smart Contract Expert',
    'Web3 Engineer',
    'Rust Developer'
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typingSpeed = 100;

function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
    } else {
        typingText.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
        isDeleting = true;
        typingSpeed = 2000; // Pause at end
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
}

// Start typing animation after page load
setTimeout(typeEffect, 1000);

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let counterAnimated = false;

function animateCounters() {
    if (counterAnimated) return;

    const heroSection = document.querySelector('.hero');
    const heroPosition = heroSection.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (heroPosition < screenPosition) {
        counterAnimated = true;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const increment = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += increment;

                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });
    }
}

window.addEventListener('scroll', animateCounters);

// ===== SCROLL ANIMATIONS (AOS) =====
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-aos]');

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');

                // Animate skill progress bars
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.skill-progress');
                    progressBars.forEach(bar => {
                        const progress = bar.style.getPropertyValue('--progress');
                        bar.style.width = progress;
                    });
                }
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));
}

// ===== SCROLL TO TOP BUTTON =====
const scrollTopBtn = document.getElementById('scrollTop');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
        scrollTopBtn.classList.add('visible');
    } else {
        scrollTopBtn.classList.remove('visible');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);

        console.log('Form submitted:', data);

        // Show success message
        alert('Thank you for your message! I will get back to you soon.');

        // Reset form
        contactForm.reset();
    });
}

// ===== PROJECT CARD TILT EFFECT =====
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');

        // Only prevent default for internal links
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();

            const target = document.querySelector(href);
            const offsetTop = target.offsetTop - 80;

            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-visual');

    parallaxElements.forEach(el => {
        const speed = 0.5;
        el.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== EASTER EGG: KONAMI CODE =====
let konamiCode = [];
const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    konamiCode = konamiCode.slice(-10);

    if (konamiCode.join('') === konamiSequence.join('')) {
        // Easter egg activated!
        document.body.style.filter = 'hue-rotate(180deg)';

        setTimeout(() => {
            document.body.style.filter = 'none';
        }, 3000);

        console.log('🎉 Konami code activated! You found the easter egg!');
    }
});

// ===== PERFORMANCE: REDUCE MOTION FOR ACCESSIBILITY =====
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (prefersReducedMotion.matches) {
    // Disable animations for users who prefer reduced motion
    document.documentElement.style.setProperty('--transition-fast', '0s');
    document.documentElement.style.setProperty('--transition-base', '0s');
    document.documentElement.style.setProperty('--transition-slow', '0s');

    // Stop particle animation
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===== UTILITY: DEBOUNCE FUNCTION =====
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== LAZY LOAD IMAGES (if any added later) =====
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== CONSOLE MESSAGE =====
console.log('%c👋 Hello, curious developer!', 'color: #00D9FF; font-size: 20px; font-weight: bold;');
console.log('%c🚀 Welcome to my portfolio. Built with ❤️ using vanilla JS, CSS, and HTML.', 'color: #7B2FFF; font-size: 14px;');
console.log('%c📧 Want to get in touch? Scroll down to the contact section!', 'color: #00FF88; font-size: 14px;');

// ===== PREVENT CONTEXT MENU ON CERTAIN ELEMENTS (OPTIONAL) =====
// Uncomment if you want to protect images or other elements
/*
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
});
*/

console.log('✅ Portfolio fully loaded and interactive!');
