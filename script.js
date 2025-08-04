// All code wrapped in DOMContentLoaded to ensure DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        if (hamburger && navMenu) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }));

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Number Counter Animation
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }
        
        updateCounter();
    }

    // Intersection Observer for number counters
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -100px 0px'
    };

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const numberElement = entry.target.querySelector('.number-value');
                const target = parseInt(numberElement.getAttribute('data-target'));
                animateCounter(numberElement, target);
                numberObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all number cards
    document.querySelectorAll('.number-card').forEach(card => {
        numberObserver.observe(card);
    });

    // Navbar background change on scroll
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.background = 'rgba(15, 23, 42, 0.98)';
            } else {
                navbar.style.background = 'rgba(15, 23, 42, 0.95)';
            }
        }
    });

    // Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        // Add validation styles
        addValidationStyles();
        
        // Add real-time validation
        addRealTimeValidation(contactForm);
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Форма отправлена!');
            
            // Validate form
            console.log('Начинаем валидацию...');
            if (!validateForm(contactForm)) {
                console.log('Валидация не прошла');
                showFormNotification('Пожалуйста, исправьте ошибки в форме', 'error');
                return;
            }
            console.log('Валидация прошла успешно');
            
            // Get form data BEFORE clearing
            const formData = new FormData(contactForm);
            const messageData = {
                name: formData.get('name').trim(),
                email: formData.get('email').trim(),
                phone: formData.get('phone').trim(),
                message: formData.get('message').trim(),
                timestamp: new Date().toISOString(),
                id: Date.now() // Unique ID for each message
            };
            
            // Get submit button and show loading state
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.textContent = 'Отправляется...';
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            
            // Clear form IMMEDIATELY after getting data
            contactForm.reset();
            clearValidationStates(contactForm);
            
            // Show success message
            showFormNotification('Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', 'success');
            
            // Save message to localStorage AFTER clearing form
            saveMessage(messageData);
            
            // Reset button after a short delay
            setTimeout(() => {
                submitButton.textContent = originalText;
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }, 1000);
        });
    }
});

// Validation functions
function validateForm(form) {
    console.log('validateForm вызвана');
    let isValid = true;
    
    // Validate name
    const name = form.querySelector('#name');
    console.log('Имя:', name.value);
    if (!name.value.trim()) {
        console.log('Ошибка: имя пустое');
        showFieldError(name, 'Имя обязательно для заполнения');
        isValid = false;
    } else if (name.value.trim().length < 2) {
        console.log('Ошибка: имя слишком короткое');
        showFieldError(name, 'Имя должно содержать минимум 2 символа');
        isValid = false;
    } else {
        console.log('Имя валидно');
        clearFieldError(name);
    }
    
    // Validate email
    const email = form.querySelector('#email');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        showFieldError(email, 'Email обязателен для заполнения');
        isValid = false;
    } else if (!emailRegex.test(email.value.trim())) {
        showFieldError(email, 'Введите корректный email адрес');
        isValid = false;
    } else {
        clearFieldError(email);
    }
    
    // Validate phone (optional but if provided, must be valid)
    const phone = form.querySelector('#phone');
    if (phone.value.trim()) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(phone.value.trim())) {
            showFieldError(phone, 'Введите корректный номер телефона');
            isValid = false;
        } else {
            clearFieldError(phone);
        }
    }
    
    // Validate message
    const message = form.querySelector('#message');
    if (!message.value.trim()) {
        showFieldError(message, 'Сообщение обязательно для заполнения');
        isValid = false;
    } else if (message.value.trim().length < 10) {
        showFieldError(message, 'Сообщение должно содержать минимум 10 символов');
        isValid = false;
    } else {
        clearFieldError(message);
    }
    
    return isValid;
}

function addRealTimeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
        
        input.addEventListener('input', function() {
            if (this.classList.contains('error')) {
                validateField(this);
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    switch (field.id) {
        case 'name':
            if (!value) {
                showFieldError(field, 'Имя обязательно для заполнения');
            } else if (value.length < 2) {
                showFieldError(field, 'Имя должно содержать минимум 2 символа');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!value) {
                showFieldError(field, 'Email обязателен для заполнения');
            } else if (!emailRegex.test(value)) {
                showFieldError(field, 'Введите корректный email адрес');
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'phone':
            if (value) {
                const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
                if (!phoneRegex.test(value)) {
                    showFieldError(field, 'Введите корректный номер телефона');
                } else {
                    clearFieldError(field);
                }
            } else {
                clearFieldError(field);
            }
            break;
            
        case 'message':
            if (!value) {
                showFieldError(field, 'Сообщение обязательно для заполнения');
            } else if (value.length < 10) {
                showFieldError(field, 'Сообщение должно содержать минимум 10 символов');
            } else {
                clearFieldError(field);
            }
            break;
    }
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.classList.remove('error');
    
    // Remove error message
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function clearValidationStates(form) {
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        clearFieldError(input);
    });
}

function addValidationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: #dc2626 !important;
            box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important;
        }
        
        .field-error {
            color: #dc2626;
            font-size: 0.875rem;
            margin-top: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .field-error::before {
            content: "⚠";
            font-size: 1rem;
        }
        
        .form-notification {
            padding: 1rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideDown 0.3s ease;
        }
        
        .form-notification.success {
            background: #d1fae5;
            color: #065f46;
            border: 1px solid #a7f3d0;
        }
        
        .form-notification.error {
            background: #fee2e2;
            color: #991b1b;
            border: 1px solid #fca5a5;
        }
        
        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
}

function showFormNotification(message, type = 'info') {
    console.log('showFormNotification вызвана:', message, type);
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        console.error('Контактная форма не найдена!');
        return;
    }
    
    // Remove existing notification
    const existingNotification = contactForm.parentNode.querySelector('.form-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `form-notification ${type}`;
    notification.innerHTML = `
        <span>${type === 'success' ? '✅' : '❌'}</span>
        <span>${message}</span>
    `;
    
    // Insert before form
    contactForm.parentNode.insertBefore(notification, contactForm);
    
    // Auto remove after 5 seconds for success messages
    if (type === 'success') {
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideUp 0.3s ease';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
}

// Save message to localStorage
function saveMessage(messageData) {
    console.log('saveMessage вызвана с данными:', messageData);
    try {
        let messages = JSON.parse(localStorage.getItem('eurooil_messages') || '[]');
        console.log('Существующие сообщения:', messages);
        messages.push(messageData);
        localStorage.setItem('eurooil_messages', JSON.stringify(messages));
        console.log('Сообщение успешно сохранено в localStorage');
        console.log('Всего сообщений:', messages.length);
    } catch (error) {
        console.error('Ошибка при сохранении сообщения:', error);
    }
    
    // Also save to a more permanent storage (you can replace this with a real backend)
    console.log('New message saved:', messageData);
    
    // Optionally send to a server endpoint
    // sendMessageToServer(messageData);
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    if (type === 'success') {
        notification.style.background = '#10b981';
    } else if (type === 'error') {
        notification.style.background = '#ef4444';
    } else {
        notification.style.background = '#3b82f6';
    }
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Function to get all messages (for admin panel)
function getAllMessages() {
    return JSON.parse(localStorage.getItem('eurooil_messages') || '[]');
}

// Function to export messages as JSON
function exportMessages() {
    const messages = getAllMessages();
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `eurooil_messages_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
}

// Admin panel functions (you can access these from browser console)
window.EuroOilAdmin = {
    getAllMessages: getAllMessages,
    exportMessages: exportMessages,
    clearMessages: function() {
        localStorage.removeItem('eurooil_messages');
        console.log('All messages cleared');
    }
};

console.log('EuroOil Admin Panel loaded. Use EuroOilAdmin.getAllMessages() to view messages.');

// Lazy loading for images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

// Add loading animation for fleet images
document.querySelectorAll('.fleet-image img').forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.style.opacity = '0.8';
    });
    
    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add active class to navigation links based on scroll position
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);

    // Add CSS for active navigation link
    const navStyle = document.createElement('style');
    navStyle.textContent = `
        .nav-link.active {
            color: var(--accent-orange) !important;
            font-weight: 600;
        }
    `;
    document.head.appendChild(navStyle);

    // Performance optimization: Debounce scroll events
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

    // Apply debouncing to scroll events
    const debouncedScrollHandler = debounce(() => {
        updateActiveNavLink();
    }, 10);

    window.addEventListener('scroll', debouncedScrollHandler);

    // Add loading state to buttons
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.type === 'submit') {
                this.style.opacity = '0.7';
                this.disabled = true;
                
                setTimeout(() => {
                    this.style.opacity = '1';
                    this.disabled = false;
                }, 2000);
            }
        });
    });

    // Initialize tooltips for service tags
    document.querySelectorAll('.service-tag').forEach(tag => {
        tag.title = `Доступно на этой станции`;
    });

    // Add hover effect for fleet cards
    document.querySelectorAll('.fleet-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Console log for debugging
    console.log('Сайт EuroOil успешно загружен!');
    console.log('Функции: Мобильная навигация, счетчики чисел, контактная форма, плавная прокрутка');
    
    // Debug contact form
    console.log('Контактная форма найдена:', !!contactForm);
    if (contactForm) {
        console.log('ID формы:', contactForm.id);
        console.log('Элементы формы:', contactForm.elements.length);
    }
}); 