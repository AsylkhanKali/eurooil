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

    // PDF Modal functionality
    const pdfModal = document.getElementById('pdfModal');
    const openPassportBtn = document.getElementById('openPassportBtn');
    const closePdfModal = document.getElementById('closePdfModal');
    const pdfViewer = document.getElementById('pdfViewer');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const zoomInBtn = document.getElementById('zoomIn');
    const zoomOutBtn = document.getElementById('zoomOut');
    const fitWidthBtn = document.getElementById('fitWidth');
    const currentPageSpan = document.getElementById('currentPage');
    const totalPagesSpan = document.getElementById('totalPages');
    const zoomLevelSpan = document.getElementById('zoomLevel');
    const openNewWindowBtn = document.getElementById('openNewWindow');

    let currentPage = 1;
    let totalPages = 10; // Примерное количество страниц, можно увеличить при необходимости
    let currentZoom = 100;

    // Open PDF modal
    if (openPassportBtn) {
        openPassportBtn.addEventListener('click', function(e) {
            e.preventDefault();
            if (pdfModal) {
                pdfModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                currentPage = 1;
                currentZoom = 100;
                loadPdf();
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
    });

    // Load PDF
    function loadPdf() {
        const pdfUrl = 'images/Паспорт качества ДТ-Е-К4.pdf';
        if (pdfViewer) {
            // Используем object тег для просмотра PDF
            // Формируем URL с параметрами страницы и масштаба
            let viewerUrl = pdfUrl;
            
            // Добавляем параметры для навигации
            const params = [];
            if (currentPage > 1) {
                params.push('page=' + currentPage);
            }
            if (currentZoom !== 100) {
                params.push('zoom=' + currentZoom);
            }
            
            if (params.length > 0) {
                viewerUrl += '#' + params.join('&');
            }
            
            // Устанавливаем data атрибут для object тега
            pdfViewer.data = viewerUrl;
            
            updatePageControls();
            updateZoom();
        }
    }

    // Update page controls
    function updatePageControls() {
        if (currentPageSpan) {
            currentPageSpan.textContent = currentPage;
        }
        if (totalPagesSpan) {
            totalPagesSpan.textContent = totalPages;
        }
        
        // Update mobile page info
        const currentPageMobile = document.getElementById('currentPageMobile');
        const totalPagesMobile = document.getElementById('totalPagesMobile');
        if (currentPageMobile) {
            currentPageMobile.textContent = currentPage;
        }
        if (totalPagesMobile) {
            totalPagesMobile.textContent = totalPages;
        }
        
        if (prevPageBtn) {
            prevPageBtn.disabled = currentPage <= 1;
        }
        if (nextPageBtn) {
            nextPageBtn.disabled = currentPage >= totalPages;
        }
    }

    // Navigate to previous page
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                loadPdf();
            }
        });
    }

    // Navigate to next page
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                currentPage++;
                loadPdf();
            }
        });
    }

    // Zoom in
    if (zoomInBtn) {
        zoomInBtn.addEventListener('click', function() {
            currentZoom = Math.min(currentZoom + 25, 200);
            updateZoom();
            loadPdf();
        });
    }

    // Zoom out
    if (zoomOutBtn) {
        zoomOutBtn.addEventListener('click', function() {
            currentZoom = Math.max(currentZoom - 25, 50);
            updateZoom();
            loadPdf();
        });
    }

    // Fit to width
    if (fitWidthBtn) {
        fitWidthBtn.addEventListener('click', function() {
            currentZoom = 100;
            updateZoom();
            loadPdf();
        });
    }

    // Open PDF in new window
    if (openNewWindowBtn) {
        openNewWindowBtn.addEventListener('click', function() {
            const pdfUrl = 'images/Паспорт качества ДТ-Е-К4.pdf';
            window.open(pdfUrl, '_blank');
        });
    }

    // Update zoom display
    function updateZoom() {
        if (zoomLevelSpan) {
            zoomLevelSpan.textContent = currentZoom;
        }
    }

    // Initialize PDF controls
    updatePageControls();
    updateZoom();

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
