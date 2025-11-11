// ===== NAVIGATION =====
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Toggle mobile menu
if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ===== TYPING ANIMATION =====
const typedTextSpan = document.querySelector('.typed-text');
const cursorSpan = document.querySelector('.cursor');

const textArray = [
    'Blockchain Developer',
    'Web3 Architect',
    'DeFi Builder',
    'Rust Engineer',
    'Solana Expert',
    'Automation Specialist'
];

const typingDelay = 100;
const erasingDelay = 50;
const newTextDelay = 2000;
let textArrayIndex = 0;
let charIndex = 0;

function type() {
    if (charIndex < textArray[textArrayIndex].length) {
        if (typedTextSpan) {
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        }
        charIndex++;
        setTimeout(type, typingDelay);
    } else {
        setTimeout(erase, newTextDelay);
    }
}

function erase() {
    if (charIndex > 0) {
        if (typedTextSpan) {
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        }
        charIndex--;
        setTimeout(erase, erasingDelay);
    } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
    }
}

// Start typing animation
if (typedTextSpan) {
    setTimeout(type, newTextDelay + 250);
}

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');

const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const updateCounter = () => {
        current += increment;
        if (current < target) {
            counter.textContent = Math.floor(current).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            counter.textContent = target.toLocaleString();
        }
    };

    updateCounter();
};

// Intersection Observer for counters
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

counters.forEach(counter => {
    counterObserver.observe(counter);
});

// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.skill-progress');

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progress = entry.target.getAttribute('data-progress');
            entry.target.style.width = progress + '%';
            skillObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

skillBars.forEach(bar => {
    skillObserver.observe(bar);
});

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards and sections
const animatedElements = document.querySelectorAll(
    '.about-card, .project-card, .skill-category, .info-card'
);

animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== NAVBAR BACKGROUND ON SCROLL =====
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 10, 15, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 212, 255, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ===== PARTICLE ANIMATION =====
const heroParticles = document.querySelector('.hero-particles');

if (heroParticles) {
    const createParticle = () => {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 4 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(0, 212, 255, 0.5)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.pointerEvents = 'none';
        particle.style.animation = `float ${Math.random() * 10 + 5}s linear infinite`;

        heroParticles.appendChild(particle);

        setTimeout(() => {
            particle.remove();
        }, 15000);
    };

    // Create particles periodically
    setInterval(createParticle, 500);

    // Add floating animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes float {
            0%, 100% {
                transform: translate(0, 0);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            90% {
                opacity: 1;
            }
            100% {
                transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== CODE WINDOW ANIMATION =====
const codeWindow = document.querySelector('.code-content code');

if (codeWindow) {
    const codeText = codeWindow.textContent;
    codeWindow.textContent = '';
    let i = 0;

    const typeCode = () => {
        if (i < codeText.length) {
            codeWindow.textContent += codeText.charAt(i);
            i++;
            setTimeout(typeCode, 10);
        }
    };

    // Start animation when code window is visible
    const codeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(typeCode, 500);
                codeObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    codeObserver.observe(codeWindow);
}

// ===== MOUSE PARALLAX EFFECT =====
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.project-card, .about-card');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    cards.forEach(card => {
        const speed = 10;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;

        card.addEventListener('mouseenter', () => {
            card.style.transform = `translate(${moveX}px, ${moveY}px) translateY(-10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translate(0, 0) translateY(0)';
        });
    });
});

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink?.classList.add('active');
        } else {
            navLink?.classList.remove('active');
        }
    });
};

window.addEventListener('scroll', highlightNav);

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

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ===== THEME TOGGLE (Future Enhancement) =====
// You can add theme toggle functionality here

// ===== PERFORMANCE OPTIMIZATION =====
// Lazy load images
const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ===== CONSOLE EASTER EGG =====
console.log(`
%c██████╗  █████╗ ██╗   ██╗██╗     ███████╗███╗   ██╗██╗  ██╗ ██████╗ ████████╗███╗   ███╗
██╔══██╗██╔══██╗██║   ██║██║     ██╔════╝████╗  ██║██║ ██╔╝██╔═══██╗╚══██╔══╝████╗ ████║
██████╔╝███████║██║   ██║██║     █████╗  ██╔██╗ ██║█████╔╝ ██║   ██║   ██║   ██╔████╔██║
██╔═══╝ ██╔══██║╚██╗ ██╔╝██║     ██╔══╝  ██║╚██╗██║██╔═██╗ ██║   ██║   ██║   ██║╚██╔╝██║
██║     ██║  ██║ ╚████╔╝ ███████╗███████╗██║ ╚████║██║  ██╗╚██████╔╝   ██║   ██║ ╚═╝ ██║
╚═╝     ╚═╝  ╚═╝  ╚═══╝  ╚══════╝╚══════╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝    ╚═╝   ╚═╝     ╚═╝
`, 'color: #00d4ff; font-weight: bold;');

console.log('%c🚀 Hey there, fellow developer!', 'color: #00ff88; font-size: 20px; font-weight: bold;');
console.log('%cInterested in the code? Check out the GitHub repo!', 'color: #ff00ff; font-size: 14px;');
console.log('%c🔗 https://github.com/pavlenkotm', 'color: #00d4ff; font-size: 14px;');
console.log('%c💼 Let\'s collaborate: pavlenko.tm.dev@gmail.com', 'color: #00ff88; font-size: 14px;');

// ===== LOAD ANIMATION =====
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ===== SERVICE WORKER REGISTRATION (PWA Ready) =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment to enable PWA
        // navigator.serviceWorker.register('/sw.js')
        //     .then(reg => console.log('Service Worker registered'))
        //     .catch(err => console.log('Service Worker registration failed'));
    });
}
