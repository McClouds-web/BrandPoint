document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('js-enabled');
    // Header Scroll Effect
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Studios Dropdown Backdrop Effect
    const studiosNav = document.getElementById('studios-nav');
    const navBackdrop = document.getElementById('nav-backdrop');
    
    if (studiosNav && navBackdrop) {
        studiosNav.addEventListener('mouseenter', () => {
            if (window.innerWidth > 768) {
                navBackdrop.classList.add('active');
            }
        });
        
        studiosNav.addEventListener('mouseleave', () => {
            navBackdrop.classList.remove('active');
        });
    }

     else {
                mobileMenuBtn.innerHTML = '&#9776;'; // Hamburger
            }
        });
    }

    // Mobile Dropdown Accordion
    const dropdownTrigger = document.querySelector('.dropdown-trigger');
    const hasDropdown = document.getElementById('studios-nav');
    
    if (dropdownTrigger && hasDropdown && window.innerWidth <= 768) {
        dropdownTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            hasDropdown.classList.toggle('active');
        });
    }

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    mobileMenuBtn.innerHTML = '&#9776;';
                }

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Fade Up Animations
    const fadeElements = document.querySelectorAll('.fade-up');
    
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    if (!window.IntersectionObserver) { document.querySelectorAll(".fade-up").forEach(el => el.classList.add("visible")); return; }
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, fadeObserverOptions);

    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // ROBUST MOBILE MENU TOGGLE
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav-links');
    if (btn && nav) {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            nav.classList.toggle('active');
            if (nav.classList.contains('active')) {
                btn.innerHTML = '✕';
                document.body.style.overflow = 'hidden';
            } else {
                btn.innerHTML = '☰';
                document.body.style.overflow = '';
            }
        });

        // Close menu on link click
        const navItems = nav.querySelectorAll('a:not(.dropdown-trigger)');
        navItems.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                btn.innerHTML = '☰';
                document.body.style.overflow = '';
            });
        });
    }

});


// Number Counter Animation
document.addEventListener('DOMContentLoaded', () => {
    const counters = document.querySelectorAll('.counter');
    const duration = 2500; // Animation duration in milliseconds (2.5s)

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                let startTime = null;
                
                const updateCount = (timestamp) => {
                    if (!startTime) startTime = timestamp;
                    const progress = timestamp - startTime;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Ease out cubic formula for smooth deceleration
                    const easeOutCubic = 1 - Math.pow(1 - percentage, 3);
                    
                    counter.innerText = Math.floor(easeOutCubic * target);
                    
                    if (progress < duration) {
                        requestAnimationFrame(updateCount);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                requestAnimationFrame(updateCount);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
});



// ==========================================

// ==========================================
// NATIVE PREMIUM CUSTOM CALENDAR
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const dateInputs = document.querySelectorAll('.custom-premium-datepicker');
    if (dateInputs.length === 0) return;

    // 1. Inject Calendar HTML & Overlay
    const calendarHTML = `
        <div id="premium-calendar-overlay" class="premium-calendar-overlay">
            <div id="premium-calendar-modal" class="premium-calendar-modal">
                <div class="calendar-header">
                    <button id="cal-prev" class="cal-nav-btn">&larr;</button>
                    <h3 id="cal-month-year"></h3>
                    <button id="cal-next" class="cal-nav-btn">&rarr;</button>
                </div>
                <div class="calendar-weekdays">
                    <span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span>
                </div>
                <div id="calendar-days" class="calendar-days"></div>
                <div class="calendar-footer">
                    <button id="cal-close" class="btn btn-secondary" style="padding: 0.5rem 1.5rem; font-size: 0.9rem;">Cancel</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', calendarHTML);

    const overlay = document.getElementById('premium-calendar-overlay');
    const modal = document.getElementById('premium-calendar-modal');
    const daysContainer = document.getElementById('calendar-days');
    const monthYearText = document.getElementById('cal-month-year');
    
    let currentDate = new Date();
    let currentInput = null;

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    function renderCalendar(date) {
        daysContainer.innerHTML = '';
        const year = date.getFullYear();
        const month = date.getMonth();
        
        monthYearText.textContent = `${monthNames[month]} ${year}`;
        
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        
        const today = new Date();
        today.setHours(0,0,0,0);
        
        // Empty cells for alignment
        for (let i = 0; i < firstDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.classList.add('cal-day', 'empty');
            daysContainer.appendChild(emptyCell);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const dayCell = document.createElement('div');
            dayCell.classList.add('cal-day');
            dayCell.textContent = i;
            
            const cellDate = new Date(year, month, i);
            const dayOfWeek = cellDate.getDay();
            
            // Check if past or weekend
            if (cellDate < today) {
                dayCell.classList.add('disabled', 'past');
            } else if (dayOfWeek === 0 || dayOfWeek === 6) {
                dayCell.classList.add('disabled', 'weekend');
                dayCell.title = "Not available on weekends";
            } else {
                dayCell.classList.add('selectable');
                dayCell.addEventListener('click', () => {
                    const mm = String(month + 1).padStart(2, '0');
                    const dd = String(i).padStart(2, '0');
                    if(currentInput) currentInput.value = `${year}-${mm}-${dd}`;
                    closeCalendar();
                });
            }
            
            // Highlight today
            if (cellDate.getTime() === today.getTime()) {
                dayCell.classList.add('today');
            }
            
            daysContainer.appendChild(dayCell);
        }
    }

    function openCalendar(input) {
        currentInput = input;
        currentDate = new Date(); // Reset to current month on open
        renderCalendar(currentDate);
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function closeCalendar() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Event Listeners
    dateInputs.forEach(input => {
        input.addEventListener('click', () => openCalendar(input));
    });

    document.getElementById('cal-close').addEventListener('click', closeCalendar);
    
    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if(e.target === overlay) closeCalendar();
    });

    document.getElementById('cal-prev').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar(currentDate);
    });

    document.getElementById('cal-next').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar(currentDate);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const dropdownTriggers = document.querySelectorAll('.has-dropdown > a');
    dropdownTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                e.preventDefault();
                trigger.parentElement.classList.toggle('open');
            }
        });
    });
});
