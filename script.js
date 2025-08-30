// Mobile menu toggle
document.getElementById('menuToggle').addEventListener('click', function() {
    document.getElementById('navLinks').classList.toggle('active');
});

// Close mobile menu when clicking on links
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('navLinks').classList.remove('active');
    });
});

// Lazy loading images with better error handling
document.addEventListener("DOMContentLoaded", function() {
    const lazyImages = [].slice.call(document.querySelectorAll("img.lazy"));
    
    // Encode email addresses to prevent scraping
    const encodedEmails = document.querySelectorAll('.email-encoded');
    encodedEmails.forEach(function(element) {
        const encoded = element.getAttribute('data-email');
        if (encoded) {
            element.innerHTML = '<a href="mailto:' + atob(encoded) + '">' + atob(encoded) + '</a>';
        }
    });
    
    if ("IntersectionObserver" in window) {
        let lazyImageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    let lazyImage = entry.target;

                    // ✅ Always use the provided data-src (no .webp replacement)
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.remove("lazy");
                    lazyImage.classList.add("loaded");
                    lazyImageObserver.unobserve(lazyImage);
                    
                    // Add error handling for images
                    lazyImage.onerror = function() {
                        this.src = 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 800 500\'%3E%3Crect width=\'800\' height=\'500\' fill=\'%23e2e8f0\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-family=\'Arial\' font-size=\'20\' fill=\'%23334155\' text-anchor=\'middle\' dominant-baseline=\'middle\'%3EImage not available%3C/text%3E%3C/svg%3E';
                    };
                }
            });
        }, {
            rootMargin: '200px 0px' // Load images 200px before they enter viewport
        });

        lazyImages.forEach(function(lazyImage) {
            lazyImageObserver.observe(lazyImage);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        lazyImages.forEach(function(lazyImage) {
            lazyImage.src = lazyImage.dataset.src;
            lazyImage.classList.remove("lazy");
            lazyImage.classList.add("loaded");
        });
    }

    // EmailJS Form Submission
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    const submitBtn = document.getElementById('submit-btn');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simple form validation
            let valid = true;
            const requiredFields = contactForm.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'red';
                    valid = false;
                } else {
                    field.style.borderColor = '';
                }
            });
            
            if (!valid) {
                formMessage.textContent = 'Please fill in all required fields.';
                formMessage.className = 'form-message error';
                formMessage.style.display = 'block';
                return;
            }
            
            // Change button text and disable during submission
            submitBtn.disabled = true;
            submitBtn.textContent = 'Sending...';
            
            // Send form data via EmailJS
            emailjs.sendForm('service_y1a5cbx', 'template_q7tzjki', this)
                .then(function() {
                    // Show success message
                    formMessage.textContent = 'Thank you! Your message has been sent successfully. We will contact you soon.';
                    formMessage.className = 'form-message success';
                    formMessage.style.display = 'block';
                    
                    // Reset form
                    contactForm.reset();
                    
                    // Scroll to show message
                    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Track conversion in Facebook Pixel
                    if (typeof fbq !== 'undefined') {
                        fbq('track', 'Lead');
                    }
                }, function(error) {
                    // Show error message
                    formMessage.textContent = 'Oops! Something went wrong. Please try again later or contact us directly.';
                    formMessage.className = 'form-message error';
                    formMessage.style.display = 'block';
                    
                    console.error('EmailJS Error:', error);
                })
                .finally(function() {
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Submit';
                    
                    // Hide message after 5 seconds
                    setTimeout(function() {
                        formMessage.style.display = 'none';
                    }, 5000);
                });
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Add performance optimization
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}

// Preconnect to important origins
const preconnectUrls = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://cdnjs.cloudflare.com'
];

preconnectUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preconnect';
    link.href = url;
    link.crossOrigin = 'anonymous';
    document.head.appendChild(link);
});
