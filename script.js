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

    // PHP Contact Form Handling
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        addDebugLog('Форма найдена, добавляем PHP обработчик');
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            addDebugLog('=== НАЧАЛО ОТПРАВКИ ФОРМЫ НА PHP ===');
            
            // Get form elements
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const messageInput = document.getElementById('message');
            const submitButton = contactForm.querySelector('button[type="submit"]');
            const notification = document.getElementById('formNotification');
            
            addDebugLog('Элементы формы найдены');
            
            // Get values
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const phone = phoneInput.value.trim();
            const message = messageInput.value.trim();
            
            addDebugLog('Получены значения:');
            addDebugLog('- Имя: ' + name);
            addDebugLog('- Email: ' + email);
            addDebugLog('- Телефон: ' + phone);
            addDebugLog('- Сообщение: ' + message);
            
            // Simple validation
            if (!name || name.length < 2) {
                addDebugLog('ОШИБКА: Имя слишком короткое');
                showNotification('Пожалуйста, введите имя (минимум 2 символа)', 'error');
                return;
            }
            
            if (!email || !email.includes('@')) {
                addDebugLog('ОШИБКА: Неверный email');
                showNotification('Пожалуйста, введите корректный email', 'error');
                return;
            }
            
            if (!message || message.length < 10) {
                addDebugLog('ОШИБКА: Сообщение слишком короткое');
                showNotification('Пожалуйста, введите сообщение (минимум 10 символов)', 'error');
                return;
            }
            
            addDebugLog('Валидация прошла успешно');
            
            // Create message object
            const messageData = {
                name: name,
                email: email,
                phone: phone,
                message: message
            };
            
            addDebugLog('Создан объект сообщения для PHP');
            
            // Show loading state
            submitButton.textContent = 'Отправляется...';
            submitButton.disabled = true;
            
            // Send to PHP
            fetch('process_form.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageData)
            })
            .then(response => {
                addDebugLog('Получен ответ от PHP: ' + response.status);
                return response.json();
            })
            .then(data => {
                addDebugLog('Данные от PHP: ' + JSON.stringify(data));
                
                if (data.success) {
                    // Clear form on success
                    contactForm.reset();
                    addDebugLog('Форма очищена после успешной отправки');
                    showNotification(data.message, 'success');
                } else {
                    addDebugLog('ОШИБКА от PHP: ' + data.message);
                    showNotification(data.message, 'error');
                }
            })
            .catch(error => {
                addDebugLog('ОШИБКА при отправке на PHP: ' + error.message);
                showNotification('Ошибка при отправке сообщения. Попробуйте еще раз.', 'error');
            })
            .finally(() => {
                // Reset button
                submitButton.textContent = 'Отправить сообщение';
                submitButton.disabled = false;
                addDebugLog('Кнопка сброшена');
            });
            
            addDebugLog('=== ОТПРАВКА НА PHP ЗАВЕРШЕНА ===');
        });
        
        addDebugLog('PHP обработчик формы добавлен');
    } else {
        addDebugLog('ОШИБКА: Форма не найдена!');
    }
    
    // Show notification function
    function showNotification(message, type) {
        const notification = document.getElementById('formNotification');
        if (notification) {
            notification.textContent = message;
            notification.style.display = 'block';
            notification.style.backgroundColor = type === 'success' ? '#d1fae5' : '#fee2e2';
            notification.style.color = type === 'success' ? '#065f46' : '#991b1b';
            notification.style.border = type === 'success' ? '1px solid #a7f3d0' : '1px solid #fca5a5';
            
            // Auto hide after 5 seconds
            setTimeout(() => {
                notification.style.display = 'none';
            }, 5000);
        }
    }
});

// Simple form functions
function showFormNotification(message, type = 'info') {
    addDebugLog('showFormNotification вызвана: ' + message + ' (' + type + ')');
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) {
        addDebugLog('Ошибка: контактная форма не найдена!');
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

// Simple save function (kept for compatibility)
function saveMessage(messageData) {
    addDebugLog('saveMessage вызвана с данными: ' + JSON.stringify(messageData, null, 2));
    try {
        let messages = JSON.parse(localStorage.getItem('eurooil_messages') || '[]');
        addDebugLog('Существующие сообщения: ' + messages.length);
        messages.push(messageData);
        localStorage.setItem('eurooil_messages', JSON.stringify(messages));
        addDebugLog('Сообщение успешно сохранено в localStorage');
        addDebugLog('Всего сообщений: ' + messages.length);
    } catch (error) {
        addDebugLog('Ошибка при сохранении сообщения: ' + error.message);
        console.error('Ошибка при сохранении сообщения:', error);
    }
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
    
    // Add debug panel to the page
    addDebugPanel();
});

// Debug panel functions
function addDebugPanel() {
    const debugPanel = document.createElement('div');
    debugPanel.id = 'debugPanel';
    debugPanel.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: rgba(0, 0, 0, 0.9);
        color: white;
        padding: 15px;
        border-radius: 8px;
        font-family: monospace;
        font-size: 12px;
        max-width: 400px;
        max-height: 300px;
        overflow-y: auto;
        z-index: 10000;
        display: none;
    `;
    
    debugPanel.innerHTML = `
        <div style="margin-bottom: 10px;">
            <strong>🔧 Отладка формы</strong>
            <button onclick="toggleDebugPanel()" style="float: right; background: #333; color: white; border: none; padding: 2px 8px; border-radius: 4px; cursor: pointer;">X</button>
        </div>
        <div id="debugLog" style="white-space: pre-wrap;"></div>
    `;
    
    document.body.appendChild(debugPanel);
    
    // Add toggle button
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🔧';
    toggleButton.style.cssText = `
        position: fixed;
        top: 10px;
        left: 10px;
        background: #1e3a8a;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 50%;
        cursor: pointer;
        z-index: 9999;
        font-size: 16px;
    `;
    toggleButton.onclick = toggleDebugPanel;
    document.body.appendChild(toggleButton);
}

function toggleDebugPanel() {
    const panel = document.getElementById('debugPanel');
    if (panel.style.display === 'none' || !panel.style.display) {
        panel.style.display = 'block';
    } else {
        panel.style.display = 'none';
    }
}

function addDebugLog(message) {
    const debugLog = document.getElementById('debugLog');
    if (debugLog) {
        const timestamp = new Date().toLocaleTimeString();
        debugLog.innerHTML += `[${timestamp}] ${message}\n`;
        debugLog.scrollTop = debugLog.scrollHeight;
    }
    console.log(message); // Also log to console
} 