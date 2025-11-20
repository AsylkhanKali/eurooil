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
    function animateCounter(element, target, duration = 1500) {
        let start = 0;
        const increment = target / (duration / 16);
        
        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString('ru-RU');
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString('ru-RU');
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
                if (numberElement) {
                const target = parseInt(numberElement.getAttribute('data-target'));
                animateCounter(numberElement, target);
                numberObserver.unobserve(entry.target);
                }
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
                navbar.style.backgroundColor = 'rgba(10, 25, 41, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(10, 25, 41, 1)';
            }
        }
    });

    // PDF Modal - Image viewer implementation
    const pdfModal = document.getElementById('pdfModal');
    const openPassportBtn = document.getElementById('openPassportBtn');
    const closePdfModal = document.getElementById('closePdfModal');
    const passportImage = document.getElementById('passportImage');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageNum = document.getElementById('currentPageNum');
    const totalPagesNum = document.getElementById('totalPagesNum');

    // Passport pages configuration
    let currentPage = 1;
    let totalPages = 5; // Будет определено автоматически
    const passportPages = [];
    let pagesDetected = false;

    // Initialize passport pages array
    function initPassportPages() {
        // Автоматически определяем количество страниц
        // Пробуем два формата именования
        let foundPages = 0;
        let checkCount = 0;
        const maxPagesToCheck = 20;

        function checkPage(pageNum) {
            // Формат 1: Паспорт качества ДТ-Е-К4_page-0001.jpg
            const pageNumStr = String(pageNum).padStart(4, '0');
            const filename1 = `images/passport_pages/Паспорт качества ДТ-Е-К4_page-${pageNumStr}.jpg`;
            
            // Формат 2: passport_page_1.jpg
            const filename2 = `images/passport_pages/passport_page_${pageNum}.jpg`;

            const img = new Image();
            let filename = filename1;

            img.onload = function() {
                foundPages = pageNum;
                totalPages = foundPages;
                pagesDetected = true;
                updatePageDisplay();
                checkCount++;
                if (pageNum < maxPagesToCheck) {
                    checkPage(pageNum + 1);
                }
            };

            img.onerror = function() {
                // Пробуем второй формат
                if (filename === filename1) {
                    filename = filename2;
                    img.src = filename;
                    return;
                }
                // Если оба формата не сработали, проверяем следующую страницу
                checkCount++;
                if (pageNum < maxPagesToCheck && foundPages === pageNum - 1) {
                    checkPage(pageNum + 1);
                }
            };

            img.src = filename;
        }

        // Начинаем проверку с первой страницы
        checkPage(1);
    }

    // Load passport page
    function loadPassportPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        if (passportImage) {
            // Пробуем первый формат
            const pageNumStr = String(page).padStart(4, '0');
            const filename1 = `images/passport_pages/Паспорт качества ДТ-Е-К4_page-${pageNumStr}.jpg`;
            const filename2 = `images/passport_pages/passport_page_${page}.jpg`;
            
            // Пробуем загрузить первый формат
            passportImage.src = filename1;
            passportImage.onerror = function() {
                // Если не сработало, пробуем второй формат
                passportImage.src = filename2;
                passportImage.onerror = function() {
                    console.log(`Страница ${page} не найдена`);
                };
            };
        }
        updatePageDisplay();
    }

    // Update page display
    function updatePageDisplay() {
        if (currentPageNum) currentPageNum.textContent = currentPage;
        if (totalPagesNum) totalPagesNum.textContent = totalPages;
        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    }

    // Open PDF modal
    if (openPassportBtn) {
        openPassportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (pdfModal) {
                pdfModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                currentPage = 1;
                loadPassportPage(1);
            }
        });
    }

    // Navigation buttons
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                loadPassportPage(currentPage - 1);
                // Scroll to top of image
                const container = document.querySelector('.passport-image-container');
                if (container) container.scrollTop = 0;
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                loadPassportPage(currentPage + 1);
                // Scroll to top of image
                const container = document.querySelector('.passport-image-container');
                if (container) container.scrollTop = 0;
            }
        });
    }

    // Close PDF modal
    function closeModal() {
        if (pdfModal) {
            pdfModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closePdfModal) {
        closePdfModal.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) {
                closeModal();
            }
        });
    }

    // Close modal on Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && pdfModal && pdfModal.classList.contains('active')) {
            closeModal();
        }
        // Arrow keys for navigation
        if (pdfModal && pdfModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft' && currentPage > 1) {
                loadPassportPage(currentPage - 1);
            }
            if (e.key === 'ArrowRight' && currentPage < totalPages) {
                loadPassportPage(currentPage + 1);
            }
        }
    });

    // Initialize passport pages on load
    initPassportPages();
    updatePageDisplay();

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

    const debouncedScrollHandler = debounce(updateActiveNavLink, 50);
    window.addEventListener('scroll', debouncedScrollHandler);

    // Initialize tooltips for service tags
    document.querySelectorAll('.service-tag').forEach(tag => {
        tag.title = 'Доступно на этой станции';
    });

    console.log('Сайт EuroOil успешно загружен!');
});
 