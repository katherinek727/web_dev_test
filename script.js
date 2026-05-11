// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.querySelector('.nav-menu');
const navActions = document.querySelector('.nav-actions');
const navLinks = document.querySelectorAll('.nav-link');
const speakersCarousel = document.getElementById('speakersCarousel');
const scheduleCarousel = document.getElementById('scheduleCarousel');
const prevSpeakerBtn = document.getElementById('prevSpeaker');
const nextSpeakerBtn = document.getElementById('nextSpeaker');
const prevScheduleBtn = document.getElementById('prevSchedule');
const nextScheduleBtn = document.getElementById('nextSchedule');
const speakerDotsContainer = document.getElementById('speakerDots');
const scheduleDotsContainer = document.getElementById('scheduleDots');

// Data for speakers carousel (looping)
const speakers = [
    {
        id: 1,
        name: "Dr. Sarah Chen",
        role: "AI Research Director",
        company: "Google Brain",
        bio: "Leading researcher in machine learning with 50+ published papers. Focused on ethical AI development.",
        color: "#4361ee"
    },
    {
        id: 2,
        name: "Marcus Johnson",
        role: "CTO & Co-founder",
        company: "TechVision Inc.",
        bio: "Serial entrepreneur with 3 successful exits. Specializes in scalable cloud architecture.",
        color: "#3a0ca3"
    },
    {
        id: 3,
        name: "Priya Sharma",
        role: "Senior Software Engineer",
        company: "Microsoft",
        bio: "Expert in distributed systems and microservices. Open source contributor to Kubernetes.",
        color: "#f72585"
    },
    {
        id: 4,
        name: "David Kim",
        role: "Head of Product",
        company: "Slack",
        bio: "Product leader with 15+ years experience in SaaS. Focused on user-centered design.",
        color: "#4cc9f0"
    },
    {
        id: 5,
        name: "Elena Rodriguez",
        role: "Cybersecurity Expert",
        company: "Cisco",
        bio: "Award-winning security researcher. Specializes in threat intelligence and zero-trust architecture.",
        color: "#f8961e"
    },
    {
        id: 6,
        name: "James Wilson",
        role: "Blockchain Architect",
        company: "Coinbase",
        bio: "Pioneer in decentralized finance. Built scalable blockchain solutions for enterprise.",
        color: "#7209b7"
    }
];

// Data for schedule carousel (non-looping)
const scheduleItems = [
    {
        day: "Day 1",
        date: "October 15",
        sessions: [
            { time: "9:00 AM", title: "Opening Keynote", speaker: "Dr. Sarah Chen" },
            { time: "10:30 AM", title: "Future of AI", speaker: "Marcus Johnson" },
            { time: "1:00 PM", title: "Lunch & Networking", speaker: "All Speakers" },
            { time: "2:30 PM", title: "Cloud Native Workshop", speaker: "Priya Sharma" }
        ]
    },
    {
        day: "Day 2",
        date: "October 16",
        sessions: [
            { time: "9:00 AM", title: "Product Design Keynote", speaker: "David Kim" },
            { time: "10:30 AM", title: "Security in 2024", speaker: "Elena Rodriguez" },
            { time: "1:00 PM", title: "Startup Pitch Competition", speaker: "Judges Panel" },
            { time: "3:00 PM", title: "Blockchain Panel", speaker: "James Wilson" }
        ]
    },
    {
        day: "Day 3",
        date: "October 17",
        sessions: [
            { time: "9:00 AM", title: "Future of Work", speaker: "All Speakers" },
            { time: "11:00 AM", title: "Hands-on Coding Labs", speaker: "Technical Team" },
            { time: "2:00 PM", title: "Closing Ceremony", speaker: "Conference Chair" },
            { time: "4:00 PM", title: "Networking Party", speaker: "All Attendees" }
        ]
    }
];

// Carousel State
let currentSpeakerIndex = 0;
let currentScheduleIndex = 0;
let speakerInterval;
let scheduleInterval;
const SPEAKER_AUTO_CHANGE_INTERVAL = 4000; // 4 seconds
const ITEMS_PER_VIEW = 3;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initSpeakersCarousel();
    initScheduleCarousel();
    initAnimations();
    initSmoothScrolling();
    startSpeakerAutoChange();
});

// Navigation
function initNavigation() {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navActions.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });

    // Close mobile menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navActions.classList.remove('active');
            menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            
            // Update active link
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Speakers Carousel (Looping)
function initSpeakersCarousel() {
    renderSpeakers();
    renderSpeakerDots();
    updateCarousel();
    
    // Event listeners
    prevSpeakerBtn.addEventListener('click', () => {
        stopSpeakerAutoChange();
        currentSpeakerIndex = (currentSpeakerIndex - 1 + speakers.length) % speakers.length;
        updateCarousel();
        startSpeakerAutoChange();
    });
    
    nextSpeakerBtn.addEventListener('click', () => {
        stopSpeakerAutoChange();
        currentSpeakerIndex = (currentSpeakerIndex + 1) % speakers.length;
        updateCarousel();
        startSpeakerAutoChange();
    });
    
    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    
    speakersCarousel.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    speakersCarousel.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                // Swipe left - next
                nextSpeakerBtn.click();
            } else {
                // Swipe right - previous
                prevSpeakerBtn.click();
            }
        }
    }
}

function renderSpeakers() {
    speakersCarousel.innerHTML = '';
    
    speakers.forEach((speaker, index) => {
        const speakerCard = document.createElement('div');
        speakerCard.className = 'carousel-item speaker-card fade-in';
        speakerCard.style.animationDelay = `${index * 0.1}s`;
        
        // Generate initials for avatar
        const initials = speaker.name.split(' ').map(n => n[0]).join('');
        
        speakerCard.innerHTML = `
            <div class="speaker-avatar" style="background: linear-gradient(135deg, ${speaker.color}, ${darkenColor(speaker.color, 20)})">
                ${initials}
            </div>
            <h3 class="speaker-name">${speaker.name}</h3>
            <p class="speaker-role">${speaker.role}</p>
            <p class="speaker-company">${speaker.company}</p>
            <p class="speaker-bio">${speaker.bio}</p>
            <div class="speaker-social">
                <a href="#"><i class="fab fa-twitter"></i></a>
                <a href="#"><i class="fab fa-linkedin"></i></a>
                <a href="#"><i class="fab fa-github"></i></a>
            </div>
        `;
        
        speakersCarousel.appendChild(speakerCard);
    });
}

function renderSpeakerDots() {
    speakerDotsContainer.innerHTML = '';
    
    for (let i = 0; i < Math.ceil(speakers.length / ITEMS_PER_VIEW); i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        
        dot.addEventListener('click', () => {
            stopSpeakerAutoChange();
            currentSpeakerIndex = i * ITEMS_PER_VIEW;
            updateCarousel();
            startSpeakerAutoChange();
        });
        
        speakerDotsContainer.appendChild(dot);
    }
}

// Schedule Carousel (Non-looping)
function initScheduleCarousel() {
    renderSchedule();
    renderScheduleDots();
    updateScheduleCarousel();
    
    // Event listeners
    prevScheduleBtn.addEventListener('click', () => {
        if (currentScheduleIndex > 0) {
            currentScheduleIndex--;
            updateScheduleCarousel();
        }
        updateScheduleButtons();
    });
    
    nextScheduleBtn.addEventListener('click', () => {
        if (currentScheduleIndex < scheduleItems.length - 1) {
            currentScheduleIndex++;
            updateScheduleCarousel();
        }
        updateScheduleButtons();
    });
    
    // Disable auto-change for schedule carousel (as per requirements)
}

function renderSchedule() {
    scheduleCarousel.innerHTML = '';
    
    scheduleItems.forEach((day, index) => {
        const scheduleCard = document.createElement('div');
        scheduleCard.className = 'carousel-item schedule-card slide-up';
        scheduleCard.style.animationDelay = `${index * 0.1}s`;
        
        let sessionsHTML = '';
        day.sessions.forEach(session => {
            sessionsHTML += `
                <div class="session-item">
                    <span class="schedule-time">${session.time}</span>
                    <h4 class="schedule-title">${session.title}</h4>
                    <p class="schedule-speaker">${session.speaker}</p>
                </div>
            `;
        });
        
        scheduleCard.innerHTML = `
            <div class="day-header">
                <h3>${day.day}</h3>
                <p class="day-date">${day.date}</p>
            </div>
            <div class="sessions-list">
                ${sessionsHTML}
            </div>
            <button class="btn btn-outline" style="margin-top: 20px; width: 100%;">
                <i class="fas fa-calendar-plus"></i> Add to Calendar
            </button>
        `;
        
        scheduleCarousel.appendChild(scheduleCard);
    });
}

function renderScheduleDots() {
    scheduleDotsContainer.innerHTML = '';
    
    for (let i = 0; i < scheduleItems.length; i++) {
        const dot = document.createElement('button');
        dot.className = `carousel-dot ${i === 0 ? 'active' : ''}`;
        dot.setAttribute('data-index', i);
        
        dot.addEventListener('click', () => {
            currentScheduleIndex = i;
            updateScheduleCarousel();
            updateScheduleButtons();
        });
        
        scheduleDotsContainer.appendChild(dot);
    }
}

function updateCarousel() {
    const itemWidth = speakersCarousel.children[0].offsetWidth + 30; // width + gap
    const translateX = -currentSpeakerIndex * itemWidth;
    speakersCarousel.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    const activeDotIndex = Math.floor(currentSpeakerIndex / ITEMS_PER_VIEW);
    document.querySelectorAll('#speakerDots .carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDotIndex);
    });
}

function updateScheduleCarousel() {
    const itemWidth = scheduleCarousel.children[0].offsetWidth + 30; // width + gap
    const translateX = -currentScheduleIndex * itemWidth;
    scheduleCarousel.style.transform = `translateX(${translateX}px)`;
    
    // Update dots
    document.querySelectorAll('#scheduleDots .carousel-dot').forEach((dot, index) => {
        dot.classList.toggle('active', index === currentScheduleIndex);
    });
}

function updateScheduleButtons() {
    prevScheduleBtn.disabled = currentScheduleIndex === 0;
    nextScheduleBtn.disabled = currentScheduleIndex === scheduleItems.length - 1;
}

// Auto-change for speakers carousel
function startSpeakerAutoChange() {
    stopSpeakerAutoChange();
    speakerInterval = setInterval(() => {
        currentSpeakerIndex = (currentSpeakerIndex + ITEMS_PER_VIEW) % speakers.length;
        updateCarousel();
    }, SPEAKER_AUTO_CHANGE_INTERVAL);
}

function stopSpeakerAutoChange() {
    if (speakerInterval) {
        clearInterval(speakerInterval);
        speakerInterval = null;
    }
}

// Pause auto-change on hover
speakersCarousel.addEventListener('mouseenter', stopSpeakerAutoChange);
speakersCarousel.addEventListener('mouseleave', startSpeakerAutoChange);

// Animations
function initAnimations() {
    // Add animation classes to elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all sections and cards
    document.querySelectorAll('section, .carousel-item, .sponsor-card, .stat').forEach(el => {
        observer.observe(el);
    });
    
    // Running line animation is already in CSS
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Utility function to darken color
function darkenColor(color, percent) {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    
    return "#" + (
        0x1000000 +
        (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
        (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
        (B < 255 ? B < 1 ? 0 : B : 255)
    ).toString(16).slice(1);
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateCarousel();
        updateScheduleCarousel();
    }, 250);
});

// Add some interactive effects to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', () => {
        button.style.transform = 'scale(0.95)';
    });
    
    button.addEventListener('mouseup', () => {
        button.style.transform = '';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = '';
    });
});

// Initialize with animations
setTimeout(() => {
    document.body.classList.add('loaded');
}, 100);