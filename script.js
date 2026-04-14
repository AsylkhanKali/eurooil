document.addEventListener('DOMContentLoaded', function() {
    // ========== MOBILE NAVIGATION ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    // ========== SMOOTH SCROLLING ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ========== NAVBAR SCROLL EFFECT ==========
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        if (navbar) {
            navbar.classList.toggle('scrolled', window.scrollY > 50);
        }
    }, { passive: true });

    // ========== ACTIVE NAV LINK ==========
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.pageYOffset >= top) {
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

    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNavLink, 60);
    }, { passive: true });

    // ========== NUMBER COUNTER ANIMATION ==========
    function animateCounter(element, target, suffix, duration) {
        duration = duration || 1500;
        suffix = suffix || '';
        let start = 0;
        const increment = target / (duration / 16);

        function update() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start).toLocaleString('ru-RU') + suffix;
                requestAnimationFrame(update);
            } else {
                element.textContent = target.toLocaleString('ru-RU') + suffix;
            }
        }
        update();
    }

    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target.querySelector('.number-value');
                if (el) {
                    const target = parseInt(el.getAttribute('data-target'));
                    const suffix = el.getAttribute('data-suffix') || '';
                    animateCounter(el, target, suffix);
                    numberObserver.unobserve(entry.target);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.number-card').forEach(card => {
        numberObserver.observe(card);
    });

    // ========== SCROLL ANIMATIONS ==========
    const animObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

    const animElements = document.querySelectorAll(
        '.product-card, .price-card, .delivery-card, .service-card, .fleet-card, .station-card, .depot-image-card, .faq-item'
    );

    // Add CSS for animation
    const style = document.createElement('style');
    style.textContent = `
        .anim-ready { opacity: 0; transform: translateY(24px); transition: opacity 0.5s ease, transform 0.5s ease; }
        .animate-in { opacity: 1 !important; transform: translateY(0) !important; }
    `;
    document.head.appendChild(style);

    animElements.forEach((el, i) => {
        el.classList.add('anim-ready');
        el.style.transitionDelay = (i % 4) * 0.08 + 's';
        animObserver.observe(el);
    });

    // ========== FAQ ACCORDION ==========
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            const answer = item.querySelector('.faq-answer');
            const isActive = item.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item.active').forEach(activeItem => {
                if (activeItem !== item) {
                    activeItem.classList.remove('active');
                    activeItem.querySelector('.faq-answer').style.maxHeight = '0';
                }
            });

            if (isActive) {
                item.classList.remove('active');
                answer.style.maxHeight = '0';
            } else {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    // ========== CALLBACK MODAL ==========
    const callbackBtn = document.getElementById('callbackBtn');
    const callbackModal = document.getElementById('callbackModal');
    const closeCallbackModal = document.getElementById('closeCallbackModal');

    if (callbackBtn && callbackModal) {
        callbackBtn.addEventListener('click', () => {
            callbackModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeCallbackModal && callbackModal) {
        closeCallbackModal.addEventListener('click', () => {
            callbackModal.classList.remove('active');
            document.body.style.overflow = '';
        });

        callbackModal.addEventListener('click', (e) => {
            if (e.target === callbackModal) {
                callbackModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========== PHONE FORMATTING ==========
    function formatPhone(input) {
        input.addEventListener('input', function() {
            let val = this.value.replace(/\D/g, '');
            if (val.startsWith('8')) val = '7' + val.slice(1);
            if (!val.startsWith('7')) val = '7' + val;
            val = val.slice(0, 11);
            let formatted = '+7';
            if (val.length > 1) formatted += ' (' + val.slice(1, 4);
            if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
            if (val.length >= 7) formatted += '-' + val.slice(7, 9);
            if (val.length >= 9) formatted += '-' + val.slice(9, 11);
            this.value = formatted;
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value === '+7') {
                e.preventDefault();
            }
        });
        input.addEventListener('focus', function() {
            if (!this.value) this.value = '+7 ';
        });
    }

    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(formatPhone);

    // ========== FORM SUBMISSIONS ==========
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name    = document.getElementById('formName').value.trim();
            const phone   = document.getElementById('formPhone').value.trim();
            const company = document.getElementById('formCompany').value.trim();
            const product = document.getElementById('formProduct').value;
            const volume  = document.getElementById('formVolume') ? document.getElementById('formVolume').value : '';
            const address = document.getElementById('formAddress') ? document.getElementById('formAddress').value.trim() : '';
            const message = document.getElementById('formMessage').value.trim();

            if (!name || !phone || phone.replace(/\D/g,'').length < 11) {
                const phoneEl = document.getElementById('formPhone');
                phoneEl.style.borderColor = '#e53e3e';
                phoneEl.focus();
                return;
            }

            let waText = `🛢 Заявка с сайта EuroOil\n`;
            waText += `━━━━━━━━━━━━━━━\n`;
            waText += `👤 Имя: ${name}\n`;
            waText += `📞 Телефон: ${phone}\n`;
            if (company) waText += `🏢 Компания: ${company}\n`;
            if (product) waText += `⛽ Продукт: ${product}\n`;
            if (volume)  waText += `📦 Объём: ${volume}\n`;
            if (address) waText += `📍 Адрес доставки: ${address}\n`;
            if (message) waText += `💬 Комментарий: ${message}\n`;
            waText += `━━━━━━━━━━━━━━━`;

            window.open(`https://wa.me/77080075007?text=${encodeURIComponent(waText)}`, '_blank');

            const btn = contactForm.querySelector('button[type="submit"]');
            btn.innerHTML = '<i class="fas fa-check"></i> Заявка отправлена!';
            btn.style.background = '#38a169';
            setTimeout(() => {
                contactForm.reset();
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить заявку';
                btn.style.background = '';
            }, 3000);
        });

        // Remove red border on input
        document.getElementById('formPhone').addEventListener('input', function() {
            this.style.borderColor = '';
        });
    }

    const callbackForm = document.getElementById('callbackForm');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const inputs = callbackForm.querySelectorAll('input');
            const name = inputs[0].value;
            const phone = inputs[1].value;

            let waText = `Заказ обратного звонка с сайта EuroOil.\nИмя: ${name}\nТелефон: ${phone}`;
            window.open(`https://wa.me/77080075007?text=${encodeURIComponent(waText)}`, '_blank');

            callbackForm.reset();
            if (callbackModal) {
                callbackModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    // ========== PDF MODAL (PASSPORT VIEWER) ==========
    const pdfModal = document.getElementById('pdfModal');
    const openPassportDieselBtn = document.getElementById('openPassportDieselBtn');
    const openPassportAi92Btn = document.getElementById('openPassportAi92Btn');
    const closePdfModal = document.getElementById('closePdfModal');
    const passportImage = document.getElementById('passportImage');
    const prevPageBtn = document.getElementById('prevPageBtn');
    const nextPageBtn = document.getElementById('nextPageBtn');
    const currentPageNum = document.getElementById('currentPageNum');
    const totalPagesNum = document.getElementById('totalPagesNum');
    const passportModalTitle = document.getElementById('passportModalTitle');
    const passportDownloadLink = document.getElementById('passportDownloadLink');

    let currentPage = 1;
    let totalPages = 5;
    let currentPassportType = null;

    function initPassportPages(passportType) {
        let foundPages = 0;
        const maxPagesToCheck = 20;

        function checkPage(pageNum) {
            const pageNumStr = String(pageNum).padStart(4, '0');
            let filename;
            if (passportType === 'diesel') {
                filename = `images/passport_pages/Паспорт качества ДТ-Е-К4_page-${pageNumStr}.jpg`;
            } else if (passportType === 'ai92') {
                filename = `images/passport2_pages/АИ-92-К4 ПАСПОРТ № 114.01 (1)_page-${pageNumStr}.jpg`;
            } else return;

            const img = new Image();
            img.onload = function() {
                foundPages = pageNum;
                totalPages = foundPages;
                updatePageDisplay();
                if (pageNum < maxPagesToCheck) checkPage(pageNum + 1);
            };
            img.onerror = function() {
                if (foundPages > 0) {
                    totalPages = foundPages;
                    updatePageDisplay();
                }
            };
            img.src = filename;
        }
        checkPage(1);
    }

    function loadPassportPage(page) {
        if (page < 1 || page > totalPages) return;
        currentPage = page;
        if (passportImage) {
            const pageNumStr = String(page).padStart(4, '0');
            let filename;
            if (currentPassportType === 'diesel') {
                filename = `images/passport_pages/Паспорт качества ДТ-Е-К4_page-${pageNumStr}.jpg`;
            } else if (currentPassportType === 'ai92') {
                filename = `images/passport2_pages/АИ-92-К4 ПАСПОРТ № 114.01 (1)_page-${pageNumStr}.jpg`;
            }
            if (filename) passportImage.src = filename;
        }
        updatePageDisplay();
    }

    function openPassportModal(passportType) {
        currentPassportType = passportType;
        currentPage = 1;

        if (passportType === 'diesel') {
            if (passportModalTitle) passportModalTitle.textContent = 'Паспорт качества — Дизельное топливо';
            if (passportDownloadLink) {
                passportDownloadLink.href = 'images/Паспорт качества ДТ-Е-К4.pdf';
                passportDownloadLink.download = 'Паспорт качества ДТ-Е-К4.pdf';
                passportDownloadLink.style.display = '';
            }
            totalPages = 5;
        } else if (passportType === 'ai92') {
            if (passportModalTitle) passportModalTitle.textContent = 'Паспорт качества — Бензин АИ-92';
            if (passportDownloadLink) {
                passportDownloadLink.href = '#';
                passportDownloadLink.style.display = 'none';
            }
            totalPages = 6;
        }

        if (pdfModal) {
            pdfModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            loadPassportPage(1);
            initPassportPages(passportType);
        }
    }

    function updatePageDisplay() {
        if (currentPageNum) currentPageNum.textContent = currentPage;
        if (totalPagesNum) totalPagesNum.textContent = totalPages;
        if (prevPageBtn) prevPageBtn.disabled = currentPage <= 1;
        if (nextPageBtn) nextPageBtn.disabled = currentPage >= totalPages;
    }

    if (openPassportDieselBtn) {
        openPassportDieselBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openPassportModal('diesel');
        });
    }

    if (openPassportAi92Btn) {
        openPassportAi92Btn.addEventListener('click', function(e) {
            e.preventDefault();
            openPassportModal('ai92');
        });
    }

    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', function() {
            if (currentPage > 1) {
                loadPassportPage(currentPage - 1);
                const container = document.querySelector('.passport-image-container');
                if (container) container.scrollTop = 0;
            }
        });
    }

    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', function() {
            if (currentPage < totalPages) {
                loadPassportPage(currentPage + 1);
                const container = document.querySelector('.passport-image-container');
                if (container) container.scrollTop = 0;
            }
        });
    }

    function closePdfModalFn() {
        if (pdfModal) {
            pdfModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    if (closePdfModal) closePdfModal.addEventListener('click', closePdfModalFn);
    if (pdfModal) {
        pdfModal.addEventListener('click', function(e) {
            if (e.target === pdfModal) closePdfModalFn();
        });
    }

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (pdfModal && pdfModal.classList.contains('active')) closePdfModalFn();
            if (callbackModal && callbackModal.classList.contains('active')) {
                callbackModal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
        if (pdfModal && pdfModal.classList.contains('active')) {
            if (e.key === 'ArrowLeft' && currentPage > 1) loadPassportPage(currentPage - 1);
            if (e.key === 'ArrowRight' && currentPage < totalPages) loadPassportPage(currentPage + 1);
        }
    });

    updatePageDisplay();
});
