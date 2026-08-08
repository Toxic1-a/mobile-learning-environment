/**
 * 🧭 UNIFIED NAVIGATION SYSTEM - نظام التنقل الموحد
 * 
 * نظام تنقل موحد لجميع صفحات الموقع
 * يضمن التناسق في التصميم والوظائف
 * 
 * @version 1.0 - Kids Learning Platform
 * @date December 2024
 */

class UnifiedNavigation {
    constructor() {
        this.currentPage = this.detectCurrentPage();
        this.studentData = this.loadStudentData();
        this.init();
    }

    /**
     * Initialize navigation system
     */
    init() {
        this.createNavigationBar();
        this.createFooter();
        this.setupEventListeners();
        this.updateActiveStates();
        this.displayStudentInfo();
    }

    /**
     * Detect current page
     */
    detectCurrentPage() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        const pageMap = {
            'index': 'home',
            'instructions': 'instructions',
            'objectives': 'objectives',
            'about': 'about',
            'contact': 'contact',
            'admin-login': 'admin-login',
            'login': 'login',
            'student-home': 'student-home',
            'group1': 'group1',
            'group2': 'group2',
            'group3': 'group3',
            'group4': 'group4'
        };

        // Check for lesson pages
        const lessonMatch = filename.match(/group(\d+)-lesson(\d+)/);
        if (lessonMatch) {
            return {
                type: 'lesson',
                group: parseInt(lessonMatch[1]),
                lesson: parseInt(lessonMatch[2])
            };
        }

        return pageMap[filename] || 'home';
    }

    /**
     * Load student data from localStorage
     */
    loadStudentData() {
        const studentData = localStorage.getItem('studentData');
        if (studentData) {
            try {
                return JSON.parse(studentData);
            } catch (error) {
                console.error('Error loading student data:', error);
            }
        }
        return null;
    }

    /**
     * Create navigation bar
     */
    createNavigationBar() {
        // Check if navbar already exists
        if (document.querySelector('.navbar')) {
            return;
        }

        const navbar = document.createElement('nav');
        navbar.className = 'navbar navbar-expand-lg navbar-kids fixed-top';
        navbar.innerHTML = this.getNavbarHTML();

        // Insert at the beginning of body
        document.body.insertBefore(navbar, document.body.firstChild);

        // Add padding to body to account for fixed navbar
        document.body.style.paddingTop = '80px';
    }

    /**
     * Get navbar HTML
     */
    getNavbarHTML() {
        const isLessonPage = this.currentPage.type === 'lesson';
        const currentGroup = isLessonPage ? this.currentPage.group : null;

        return `
            <div class="container">
                <div class="navbar-brand-container">
                    <a href="index.html" class="navbar-brand-text">
                        <i class="bi bi-mortarboard me-2"></i>
                        بيئة التعلم النقال
                    </a>
                </div>
                
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                
                <div class="collapse navbar-collapse" id="mainNav">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a href="index.html" class="nav-link ${this.isActivePage('home') ? 'active' : ''}">
                                <i class="bi bi-house me-2"></i>الرئيسية
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="instructions.html" class="nav-link ${this.isActivePage('instructions') ? 'active' : ''}">
                                <i class="bi bi-book me-2"></i>التعليمات
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="objectives.html" class="nav-link ${this.isActivePage('objectives') ? 'active' : ''}">
                                <i class="bi bi-bullseye me-2"></i>الأهداف
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="about.html" class="nav-link ${this.isActivePage('about') ? 'active' : ''}">
                                <i class="bi bi-people me-2"></i>من نحن
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="contact.html" class="nav-link ${this.isActivePage('contact') ? 'active' : ''}">
                                <i class="bi bi-envelope me-2"></i>اتصل بنا
                            </a>
                        </li>
                        ${this.getGroupNavigation(currentGroup)}
                    </ul>
                    
                    <div class="d-flex flex-column flex-lg-row gap-2 align-items-center">
                        ${this.getStudentInfo()}
                        ${this.getAdminLink()}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get group navigation for lesson pages
     */
    getGroupNavigation(currentGroup) {
        if (!currentGroup) return '';

        return `
            <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                    <i class="bi bi-collection me-2"></i>المجموعة ${currentGroup}
                </a>
                <ul class="dropdown-menu">
                    <li><a href="group${currentGroup}.html" class="dropdown-item">
                        <i class="bi bi-list-ul me-2"></i>فهرس الدروس
                    </a></li>
                    ${this.getLessonLinks(currentGroup)}
                </ul>
            </li>
        `;
    }

    /**
     * Get lesson links for current group
     */
    getLessonLinks(group) {
        let links = '';
        for (let i = 1; i <= 7; i++) {
            const isActive = this.currentPage.type === 'lesson' && 
                           this.currentPage.group === group && 
                           this.currentPage.lesson === i;
            
            links += `
                <li>
                    <a href="group${group}-lesson${i}.html" 
                       class="dropdown-item ${isActive ? 'active' : ''}">
                        <i class="bi bi-play-circle me-2"></i>الدرس ${i}
                    </a>
                </li>
            `;
        }
        return links;
    }

    /**
     * Get student info display
     */
    getStudentInfo() {
        if (!this.studentData) {
            return `
                <a href="login.html" class="btn btn-outline-light btn-sm">
                    <i class="bi bi-person me-1"></i>تسجيل الدخول
                </a>
            `;
        }

        return `
            <span class="nav-link text-white">
                <i class="bi bi-person-circle me-1"></i>
                مرحباً ${this.studentData.name}
            </span>
        `;
    }

    /**
     * Get admin link
     */
    getAdminLink() {
        const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
        
        if (isAdminLoggedIn) {
            return `
                <a href="dashboard.html" class="btn btn-outline-light btn-sm">
                    <i class="bi bi-graph-up me-1"></i>لوحة المتابعة
                </a>
            `;
        }

        return `
            <a href="admin-login.html" class="btn btn-outline-light btn-sm">
                <i class="bi bi-shield-lock me-1"></i>الإدارة
            </a>
        `;
    }

    /**
     * Create footer
     */
    createFooter() {
        // Check if footer already exists
        if (document.querySelector('footer')) {
            return;
        }

        const footer = document.createElement('footer');
        footer.className = 'bg-light py-4 mt-5';
        footer.innerHTML = this.getFooterHTML();

        // Insert before closing body tag
        document.body.appendChild(footer);
    }

    /**
     * Get footer HTML
     */
    getFooterHTML() {
        return `
            <div class="container">
                <div class="row">
                    <div class="col-md-6">
                        <h5 class="text-primary mb-3">
                            <i class="bi bi-mortarboard me-2"></i>
                            بيئة التعلم النقال
                        </h5>
                        <p class="text-muted">
                            منصة تعليمية تفاعلية مصممة خصيصاً للأطفال لتسهيل عملية التعلم
                            وجعلها أكثر متعة وفعالية.
                        </p>
                    </div>
                    <div class="col-md-6">
                        <h6 class="text-primary mb-3">روابط سريعة</h6>
                        <div class="d-flex flex-wrap gap-3">
                            <a href="index.html" class="text-decoration-none">
                                <i class="bi bi-house me-1"></i>الرئيسية
                            </a>
                            <a href="instructions.html" class="text-decoration-none">
                                <i class="bi bi-book me-1"></i>التعليمات
                            </a>
                            <a href="contact.html" class="text-decoration-none">
                                <i class="bi bi-envelope me-1"></i>اتصل بنا
                            </a>
                            <a href="admin-login.html" class="text-decoration-none">
                                <i class="bi bi-shield-lock me-1"></i>الإدارة
                            </a>
                        </div>
                    </div>
                </div>
                <hr class="my-4">
                <div class="text-center">
                    <p class="text-muted mb-0">
                        <i class="bi bi-c-circle me-1"></i>
                        جميع الحقوق محفوظة - بيئة التعلم النقال ${new Date().getFullYear()}
                    </p>
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Handle navbar toggler on mobile
        const navbarToggler = document.querySelector('.navbar-toggler');
        if (navbarToggler) {
            navbarToggler.addEventListener('click', () => {
                this.handleMobileToggle();
            });
        }

        // Handle navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.nav-link, .dropdown-item')) {
                this.handleNavigationClick(e);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Handle scroll for navbar effects
        window.addEventListener('scroll', () => {
            this.handleScroll();
        });
    }

    /**
     * Handle mobile navbar toggle
     */
    handleMobileToggle() {
        const navbar = document.querySelector('.navbar');
        navbar.classList.toggle('navbar-mobile-open');
    }

    /**
     * Handle navigation clicks
     */
    handleNavigationClick(e) {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        
        // Don't handle external links or anchors
        if (href.startsWith('http') || href.startsWith('#')) {
            return;
        }

        // Add loading state
        this.showLoadingState(link);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        const navbar = document.querySelector('.navbar');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        if (window.innerWidth >= 992) {
            navbar.classList.remove('navbar-mobile-open');
            navbarCollapse.classList.remove('show');
        }
    }

    /**
     * Handle scroll for navbar effects
     */
    handleScroll() {
        const navbar = document.querySelector('.navbar');
        const scrollTop = window.pageYOffset;
        
        if (scrollTop > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    }

    /**
     * Show loading state for navigation
     */
    showLoadingState(element) {
        const originalText = element.innerHTML;
        element.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>جاري التحميل...';
        element.style.pointerEvents = 'none';
        
        // Restore after a short delay
        setTimeout(() => {
            element.innerHTML = originalText;
            element.style.pointerEvents = 'auto';
        }, 1000);
    }

    /**
     * Update active navigation states
     */
    updateActiveStates() {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page
        const currentLink = this.getCurrentPageLink();
        if (currentLink) {
            currentLink.classList.add('active');
        }
    }

    /**
     * Get current page navigation link
     */
    getCurrentPageLink() {
        const path = window.location.pathname;
        const filename = path.split('/').pop().replace('.html', '');
        
        // Handle lesson pages
        if (filename.includes('lesson')) {
            return document.querySelector(`a[href="${filename}.html"]`);
        }
        
        // Handle regular pages
        return document.querySelector(`a[href="${filename}.html"]`);
    }

    /**
     * Check if page is active
     */
    isActivePage(pageType) {
        if (typeof this.currentPage === 'string') {
            return this.currentPage === pageType;
        }
        
        if (this.currentPage.type === 'lesson') {
            return pageType === `group${this.currentPage.group}`;
        }
        
        return false;
    }

    /**
     * Display student information
     */
    displayStudentInfo() {
        const studentInfoElement = document.getElementById('studentInfo');
        if (studentInfoElement && this.studentData) {
            studentInfoElement.innerHTML = `
                <span class="badge bg-primary">
                    <i class="bi bi-person me-1"></i>${this.studentData.name}
                </span>
            `;
        }
    }

    /**
     * Get navigation statistics
     */
    getNavigationStats() {
        const stats = {
            totalPages: 0,
            visitedPages: 0,
            currentSessionPages: []
        };

        // Count total pages
        const pageTypes = ['home', 'instructions', 'objectives', 'about', 'contact', 'login', 'admin-login'];
        stats.totalPages = pageTypes.length + 28; // 28 lessons

        // Count visited pages
        const visitedPages = localStorage.getItem('visitedPages');
        if (visitedPages) {
            try {
                stats.visitedPages = JSON.parse(visitedPages).length;
            } catch (error) {
                console.error('Error reading visited pages:', error);
            }
        }

        return stats;
    }

    /**
     * Track page visit
     */
    trackPageVisit() {
        const currentPath = window.location.pathname;
        const visitedPages = JSON.parse(localStorage.getItem('visitedPages') || '[]');
        
        if (!visitedPages.includes(currentPath)) {
            visitedPages.push(currentPath);
            localStorage.setItem('visitedPages', JSON.stringify(visitedPages));
        }
    }
}

// Initialize navigation system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.unifiedNavigation = new UnifiedNavigation();
    window.unifiedNavigation.trackPageVisit();
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = UnifiedNavigation;
}

