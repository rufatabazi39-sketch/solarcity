/* =========================================================
   SolarCity — script.js
   Table of Contents:
   1. Navbar scroll effect
   2. Mobile hamburger menu
   3. Smooth scrolling for nav links
   4. Active link highlighting on scroll
   5. Scroll reveal animations
   6. Scroll progress bar
   7. Back to top button
   8. Contact form validation
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

    // Flag that JS is running successfully. The scroll-reveal animation
    // (see .reveal-up / .js-ready in style.css) only hides elements once
    // this class is present, so content never gets stuck invisible if
    // JavaScript fails to load.
    document.body.classList.add('js-ready');

    /* ============ 1. NAVBAR SCROLL EFFECT ============
       Adds a "scrolled" class to the navbar once the user scrolls
       past a small threshold, so the navbar can switch to a solid
       background via CSS. */
    const navbar = document.getElementById('navbar');

    function handleNavbarScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    handleNavbarScroll();
    window.addEventListener('scroll', handleNavbarScroll);


    /* ============ 2. MOBILE HAMBURGER MENU ============
       Toggles the mobile navigation panel open/closed and updates
       the aria-expanded attribute for accessibility. */
    const hamburger = document.getElementById('hamburger');
    const navbarLinks = document.getElementById('navbarLinks');

    function toggleMenu() {
        const isOpen = navbarLinks.classList.toggle('open');
        hamburger.classList.toggle('active', isOpen);
        hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    hamburger.addEventListener('click', toggleMenu);

    // Close the mobile menu whenever a nav link is clicked
    document.querySelectorAll('.navbar-links a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (navbarLinks.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ============ 3. SMOOTH SCROLLING FOR NAV LINKS ============
       Intercepts clicks on in-page anchor links and scrolls to the
       target section smoothly, offsetting for the fixed navbar. */
    const navHeight = navbar.offsetHeight;

    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId.length <= 1) return; // ignore bare "#" links

            const targetEl = document.querySelector(targetId);
            if (!targetEl) return;

            e.preventDefault();
            const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - (navHeight - 10);

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });


    /* ============ 4. ACTIVE LINK HIGHLIGHTING ON SCROLL ============
       Watches each page section and highlights the matching nav
       link once that section is roughly centered in the viewport. */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function highlightActiveLink() {
        let currentSectionId = '';
        const scrollPos = window.scrollY + navHeight + 40;

        sections.forEach(function (section) {
            if (scrollPos >= section.offsetTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(function (link) {
            link.classList.remove('active-link');
            if (link.getAttribute('href') === '#' + currentSectionId) {
                link.classList.add('active-link');
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink);
    highlightActiveLink();


    /* ============ 5. SCROLL REVEAL ANIMATIONS ============
       Uses IntersectionObserver to fade/slide elements into view
       the first time they enter the viewport. */
    const revealElements = document.querySelectorAll('.reveal-up');

    const revealObserver = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                // Small stagger so cards in the same grid don't pop in all at once
                const delay = (entry.target.dataset.revealIndex || 0) * 60;
                setTimeout(function () {
                    entry.target.classList.add('in-view');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(function (el, index) {
        el.dataset.revealIndex = index % 6; // keep stagger short and predictable per group
        revealObserver.observe(el);
    });


    /* ============ 6. SCROLL PROGRESS BAR ============
       Fills a thin bar across the top of the page based on how far
       the user has scrolled through the document. */
    const scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollProgress.style.width = progress + '%';
    }

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();


    /* ============ 7. BACK TO TOP BUTTON ============
       Shows a floating button once the user scrolls down the page,
       and scrolls smoothly back to the top when clicked. */
    const backToTopBtn = document.getElementById('backToTop');

    function toggleBackToTop() {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    backToTopBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ============ 8. CONTACT FORM VALIDATION ============
       Validates the contact form fields on submit and shows inline
       error messages, then displays a success message.
  
       NOTE: There is no backend connected to this form. This is where
       a real integration would be added later, for example:
  
         fetch('https://your-api.com/api/contact', {
           method: 'POST',
           headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify(formData)
         })
         .then(response => response.json())
         .then(data => { ... })
         .catch(error => { ... });
  
       Or connecting to a third-party email service such as
       EmailJS, Formspree, or a custom backend/API endpoint. */

    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    const fields = {
        fullName: {
            input: document.getElementById('fullName'),
            error: document.getElementById('fullNameError'),
            validate: function (value) {
                return value.trim().length >= 2 ? '' : 'Please enter your full name.';
            }
        },
        email: {
            input: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: function (value) {
                const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (value.trim() === '') return 'Please enter your email address.';
                return emailPattern.test(value.trim()) ? '' : 'Please enter a valid email address.';
            }
        },
        phone: {
            input: document.getElementById('phone'),
            error: document.getElementById('phoneError'),
            validate: function (value) {
                // Phone is optional, but if provided it should look reasonable
                if (value.trim() === '') return '';
                const phonePattern = /^[0-9+\-\s()]{6,20}$/;
                return phonePattern.test(value.trim()) ? '' : 'Please enter a valid phone number.';
            }
        },
        subject: {
            input: document.getElementById('subject'),
            error: document.getElementById('subjectError'),
            validate: function (value) {
                return value.trim().length >= 3 ? '' : 'Please enter a subject.';
            }
        },
        message: {
            input: document.getElementById('message'),
            error: document.getElementById('messageError'),
            validate: function (value) {
                return value.trim().length >= 10 ? '' : 'Please enter a message (at least 10 characters).';
            }
        }
    };

    // Validate a single field and update its UI state
    function validateField(fieldKey) {
        const field = fields[fieldKey];
        const errorText = field.validate(field.input.value);

        if (errorText) {
            field.input.classList.add('input-error');
            field.error.textContent = errorText;
            return false;
        } else {
            field.input.classList.remove('input-error');
            field.error.textContent = '';
            return true;
        }
    }

    // Live validation as the user types/leaves a field
    Object.keys(fields).forEach(function (fieldKey) {
        fields[fieldKey].input.addEventListener('blur', function () {
            validateField(fieldKey);
        });
        fields[fieldKey].input.addEventListener('input', function () {
            if (fields[fieldKey].input.classList.contains('input-error')) {
                validateField(fieldKey);
            }
        });
    });

    // Your Formspree form endpoint. Replace YOUR_FORM_ID with the ID
    // Formspree gives you after you create a form at formspree.io
    // (Dashboard -> New Form -> copy the endpoint URL, e.g.
    // "https://formspree.io/f/abcdwxyz").
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

    const submitBtn = contactForm.querySelector('.btn-submit');
    const formError = document.createElement('p');
    formError.className = 'form-submit-error';
    formError.style.color = '#d94848';
    formError.style.fontSize = '0.85rem';
    formError.style.marginTop = '12px';
    formError.style.display = 'none';
    contactForm.appendChild(formError);

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isFormValid = true;
        Object.keys(fields).forEach(function (fieldKey) {
            const fieldIsValid = validateField(fieldKey);
            if (!fieldIsValid) isFormValid = false;
        });

        if (!isFormValid) {
            formSuccess.classList.remove('visible');
            // Scroll to the first invalid field for better UX
            const firstInvalid = contactForm.querySelector('.input-error');
            if (firstInvalid) {
                firstInvalid.focus();
            }
            return;
        }

        // Collect form data and send it to Formspree so submissions
        // reach your dashboard/email instead of only staying in the browser.
        const formData = {
            fullName: fields.fullName.input.value.trim(),
            email: fields.email.input.value.trim(),
            phone: fields.phone.input.value.trim(),
            subject: fields.subject.input.value.trim(),
            message: fields.message.input.value.trim()
        };

        formError.style.display = 'none';
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        fetch(FORMSPREE_ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(function (response) {
                if (!response.ok) throw new Error('Submission failed');

                // Show success message and reset the form
                formSuccess.classList.add('visible');
                contactForm.reset();

                setTimeout(function () {
                    formSuccess.classList.remove('visible');
                }, 6000);
            })
            .catch(function () {
                formError.textContent = 'Something went wrong sending your message. Please try again or contact us by phone.';
                formError.style.display = 'block';
            })
            .finally(function () {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Send Message';
            });
    });

});