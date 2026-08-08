/**
 * Enhanced Common Functions for Mobile Learning Environment
 * الوظائف المشتركة المحسنة لبيئة التعلم النقال
 * مع دعم Loading States و Skeleton Screens
 */

// فحص تسجيل دخول الإدارة للوصول لرابط لوحة المتابعة
function checkAdminAccess() {
  const adminLoginStatus = localStorage.getItem('adminLoggedIn');
  const dashboardLink = document.querySelector('a[href="dashboard.html"]');
  
  if (dashboardLink) {
    if (adminLoginStatus === 'true') {
      // المدير مسجل دخول - السماح بالوصول
      dashboardLink.style.display = 'block';
      dashboardLink.innerHTML = '<i class="bi bi-graph-up me-1"></i>لوحة المتابعة';
    } else {
      // المدير غير مسجل دخول - توجيه لصفحة تسجيل الدخول
      dashboardLink.href = 'admin-login.html';
      dashboardLink.innerHTML = '<i class="bi bi-shield-lock me-1"></i>تسجيل دخول الإدارة';
    }
  }
}

// عرض معلومات الطالب في صفحات المجموعات
function displayStudentInfo() {
  const studentData = localStorage.getItem('studentData');
  const studentInfoElement = document.getElementById('studentInfo');
  
  if (studentData && studentInfoElement) {
    try {
      const student = JSON.parse(studentData);
      studentInfoElement.innerHTML = `
        <span class="badge bg-primary">
          <i class="bi bi-person me-1"></i>${student.name}
        </span>
      `;
    } catch (error) {
      console.error('خطأ في تحليل بيانات الطالب:', error);
    }
  }
}

// =============================================
// Floating Go Up Button System
// =============================================

// Initialize floating go up button
function initFloatingGoUpButton() {
    // Create floating go up button
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-go-up';
    floatingButton.innerHTML = `
        <button class="floating-go-up-btn" title="العودة للأعلى" aria-label="العودة للأعلى">
            <i class="bi bi-arrow-up"></i>
        </button>
    `;
    
    document.body.appendChild(floatingButton);
    const goUpBtn = floatingButton.querySelector('.floating-go-up-btn');

    // Show/hide button based on scroll position
    function toggleFloatingButton() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Show button when scrolled more than 300px
        if (scrollTop > 300) {
            floatingButton.classList.add('show');
        } else {
            floatingButton.classList.remove('show');
        }
    }

    // Smooth scroll to top function
    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    // Add click event listener
    goUpBtn.addEventListener('click', scrollToTop);

    // Add scroll event listener with throttling
    let ticking = false;
    function handleScroll() {
        if (!ticking) {
            requestAnimationFrame(function() {
                toggleFloatingButton();
                ticking = false;
            });
            ticking = true;
        }
    }

    window.addEventListener('scroll', handleScroll);

    // Add keyboard support
    goUpBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    });

    // Add accessibility improvements
    goUpBtn.setAttribute('role', 'button');
    goUpBtn.setAttribute('aria-label', 'العودة للأعلى');
    goUpBtn.setAttribute('tabindex', '0');

    // Add RTL support
    if (document.documentElement.dir === 'rtl') {
        floatingButton.style.right = '20px';
        floatingButton.style.left = 'auto';
    }

    // Expose scroll function globally
    window.scrollToTop = scrollToTop;
}

// =============================================
// Loading States & Skeleton Screens System
// =============================================

class LoadingStatesManager {
    constructor() {
        this.loadingOverlays = new Map();
        this.skeletonElements = new Map();
        this.init();
    }

    init() {
        this.setupLoadingStyles();
        this.setupPageTransitions();
    }

    setupLoadingStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Loading Overlay Styles */
            .loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                backdrop-filter: blur(5px);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .loading-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            .loading-content {
                text-align: center;
                color: var(--primary);
            }

            .loading-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid var(--primary);
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
            }

            .loading-text {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 10px;
            }

            .loading-subtitle {
                font-size: 0.9rem;
                color: #666;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* Skeleton Screen Styles */
            .skeleton-container {
                position: relative;
                overflow: hidden;
            }

            .skeleton {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: skeleton-loading 1.5s infinite;
                border-radius: 4px;
            }

            @keyframes skeleton-loading {
                0% { background-position: 200% 0; }
                100% { background-position: -200% 0; }
            }

            .skeleton-text {
                height: 1em;
                margin-bottom: 0.5em;
            }

            .skeleton-title {
                height: 1.5em;
                width: 60%;
                margin-bottom: 1em;
            }

            .skeleton-paragraph {
                height: 1em;
                width: 100%;
                margin-bottom: 0.5em;
            }

            .skeleton-paragraph:nth-child(2) { width: 90%; }
            .skeleton-paragraph:nth-child(3) { width: 80%; }

            .skeleton-card {
                height: 200px;
                border-radius: 8px;
                margin-bottom: 1rem;
            }

            .skeleton-button {
                height: 40px;
                width: 120px;
                border-radius: 20px;
                margin: 10px;
            }

            .skeleton-avatar {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                margin: 0 auto 10px;
            }

            /* Page Transition Styles */
            .page-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: var(--primary);
                z-index: 10001;
                transform: translateY(100%);
                transition: transform 0.5s ease-in-out;
            }

            .page-transition.active {
                transform: translateY(0);
            }

            /* Button Loading States */
            .btn-loading {
                position: relative;
                color: transparent !important;
                pointer-events: none;
            }

            .btn-loading::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 20px;
                height: 20px;
                margin: -10px 0 0 -10px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }

            /* Form Loading States */
            .form-loading {
                position: relative;
                pointer-events: none;
                opacity: 0.7;
            }

            .form-loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
            }

            /* Mobile Optimizations */
            @media (max-width: 768px) {
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                }
                
                .loading-text {
                    font-size: 1rem;
                }
                
                .loading-subtitle {
                    font-size: 0.8rem;
                }
            }

            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .loading-spinner,
                .skeleton {
                    animation: none;
                }
                
                .page-transition {
                    transition: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupPageTransitions() {
        // إعداد انتقالات الصفحات
        document.addEventListener('DOMContentLoaded', () => {
            this.addPageTransitionListeners();
        });
    }

    addPageTransitionListeners() {
        const links = document.querySelectorAll('a[href$=".html"], a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                // تجاهل الروابط الخارجية والروابط التي تفتح في نافذة جديدة
                if (link.hostname !== window.location.hostname || 
                    link.target === '_blank' || 
                    link.href.startsWith('mailto:') || 
                    link.href.startsWith('tel:')) {
                    return;
                }
                
                this.startPageTransition(e, link);
            });
        });
    }

    startPageTransition(event, link) {
        // منع الانتقال الافتراضي
        event.preventDefault();
        
        // إنشاء overlay الانتقال
        const transitionOverlay = document.createElement('div');
        transitionOverlay.className = 'page-transition';
        document.body.appendChild(transitionOverlay);
        
        // تفعيل الانتقال
        setTimeout(() => {
            transitionOverlay.classList.add('active');
        }, 10);
        
        // الانتقال إلى الصفحة الجديدة
        setTimeout(() => {
            window.location.href = link.href;
        }, 250);
    }

    // إظهار loading overlay
    showLoadingOverlay(message = 'جاري التحميل...', subtitle = '') {
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = `
            <div class="loading-content">
                <div class="loading-spinner"></div>
                <div class="loading-text">${message}</div>
                ${subtitle ? `<div class="loading-subtitle">${subtitle}</div>` : ''}
            </div>
        `;
        
        document.body.appendChild(overlay);
        this.loadingOverlays.set(overlay, Date.now());
        
        setTimeout(() => {
            overlay.classList.add('show');
        }, 10);
        
        return overlay;
    }

    // إخفاء loading overlay
    hideLoadingOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.classList.remove('show');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
                this.loadingOverlays.delete(overlay);
            }, 300);
        }
    }

    // إخفاء جميع loading overlays
    hideAllLoadingOverlays() {
        this.loadingOverlays.forEach((timestamp, overlay) => {
            this.hideLoadingOverlay(overlay);
        });
    }

    // إنشاء skeleton screen
    createSkeletonScreen(element, type = 'content') {
        const skeletonHTML = this.getSkeletonHTML(type);
        
        const skeletonContainer = document.createElement('div');
        skeletonContainer.className = 'skeleton-container';
        skeletonContainer.innerHTML = skeletonHTML;
        
        // إخفاء المحتوى الأصلي
        element.style.opacity = '0';
        element.appendChild(skeletonContainer);
        
        this.skeletonElements.set(element, skeletonContainer);
        
        return skeletonContainer;
    }

    getSkeletonHTML(type) {
        const skeletons = {
            content: `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-text"></div>
                <div class="skeleton skeleton-paragraph"></div>
                <div class="skeleton skeleton-paragraph"></div>
                <div class="skeleton skeleton-paragraph"></div>
            `,
            card: `
                <div class="skeleton skeleton-card"></div>
            `,
            profile: `
                <div class="skeleton skeleton-avatar"></div>
                <div class="skeleton skeleton-text" style="width: 80%;"></div>
                <div class="skeleton skeleton-paragraph"></div>
                <div class="skeleton skeleton-paragraph"></div>
            `,
            buttons: `
                <div class="skeleton skeleton-button" style="display: inline-block;"></div>
                <div class="skeleton skeleton-button" style="display: inline-block;"></div>
            `,
            quiz: `
                <div class="skeleton skeleton-title"></div>
                <div class="skeleton skeleton-card" style="height: 150px; margin-bottom: 1rem;"></div>
                <div class="skeleton skeleton-card" style="height: 150px; margin-bottom: 1rem;"></div>
                <div class="skeleton skeleton-card" style="height: 150px; margin-bottom: 1rem;"></div>
            `
        };
        
        return skeletons[type] || skeletons.content;
    }

    // إخفاء skeleton screen
    hideSkeletonScreen(element) {
        const skeleton = this.skeletonElements.get(element);
        if (skeleton && skeleton.parentNode) {
            skeleton.parentNode.removeChild(skeleton);
            this.skeletonElements.delete(element);
        }
        
        // إظهار المحتوى الأصلي
        element.style.opacity = '1';
    }

    // إخفاء جميع skeleton screens
    hideAllSkeletonScreens() {
        this.skeletonElements.forEach((skeleton, element) => {
            this.hideSkeletonScreen(element);
        });
    }

    // إضافة loading state للأزرار
    setButtonLoading(button, isLoading, loadingText = 'جاري التحميل...') {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.dataset.originalText = button.textContent;
            button.textContent = loadingText;
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.textContent = button.dataset.originalText || button.textContent;
            button.disabled = false;
        }
    }

    // إضافة loading state للنماذج
    setFormLoading(form, isLoading) {
        if (isLoading) {
            form.classList.add('form-loading');
        } else {
            form.classList.remove('form-loading');
        }
    }

    // تحميل محتوى مع skeleton
    async loadContentWithSkeleton(element, loadFunction, skeletonType = 'content') {
        // إظهار skeleton
        this.createSkeletonScreen(element, skeletonType);
        
        try {
            // تحميل المحتوى
            await loadFunction();
            
            // إخفاء skeleton
            this.hideSkeletonScreen(element);
        } catch (error) {
            console.error('Error loading content:', error);
            this.hideSkeletonScreen(element);
            throw error;
        }
    }

    // تحميل صفحة مع loading overlay
    async loadPageWithLoading(url, message = 'جاري تحميل الصفحة...') {
        const overlay = this.showLoadingOverlay(message);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const html = await response.text();
            document.open();
            document.write(html);
            document.close();
            
            this.hideLoadingOverlay(overlay);
        } catch (error) {
            console.error('Error loading page:', error);
            this.hideLoadingOverlay(overlay);
            throw error;
        }
    }

    // تنظيف الموارد
    destroy() {
        this.hideAllLoadingOverlays();
        this.hideAllSkeletonScreens();
        this.loadingOverlays.clear();
        this.skeletonElements.clear();
    }
}

// إنشاء مدير حالات التحميل
const loadingStatesManager = new LoadingStatesManager();

// تصدير الدوال للاستخدام العام
window.showLoadingOverlay = (message, subtitle) => loadingStatesManager.showLoadingOverlay(message, subtitle);
window.hideLoadingOverlay = (overlay) => loadingStatesManager.hideLoadingOverlay(overlay);
window.hideAllLoadingOverlays = () => loadingStatesManager.hideAllLoadingOverlays();
window.createSkeletonScreen = (element, type) => loadingStatesManager.createSkeletonScreen(element, type);
window.hideSkeletonScreen = (element) => loadingStatesManager.hideSkeletonScreen(element);
window.hideAllSkeletonScreens = () => loadingStatesManager.hideAllSkeletonScreens();
window.setButtonLoading = (button, isLoading, text) => loadingStatesManager.setButtonLoading(button, isLoading, text);
window.setFormLoading = (form, isLoading) => loadingStatesManager.setFormLoading(form, isLoading);
window.loadContentWithSkeleton = (element, func, type) => loadingStatesManager.loadContentWithSkeleton(element, func, type);
window.loadPageWithLoading = (url, message) => loadingStatesManager.loadPageWithLoading(url, message);

// =============================================
// Enhanced Page Loading
// =============================================

// تحسين تحميل الصفحة مع loading states
function enhancePageLoading() {
    // إظهار skeleton للمحتوى الرئيسي
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.querySelector('.skeleton-container')) {
        loadingStatesManager.createSkeletonScreen(mainContent, 'content');
        
        // إخفاء skeleton بعد تحميل الصفحة
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingStatesManager.hideSkeletonScreen(mainContent);
            }, 500);
        });
    }
}

// =============================================
// Accessibility Enhancements
// =============================================

// تحسين accessibility
function enhanceAccessibility() {
    // إضافة ARIA labels للعناصر التفاعلية
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea');
    
    interactiveElements.forEach(element => {
        if (!element.getAttribute('aria-label') && !element.textContent.trim()) {
            const type = element.tagName.toLowerCase();
            const role = element.getAttribute('role') || type;
            element.setAttribute('aria-label', `${role} interactive element`);
        }
    });
    
    // إضافة focus indicators محسنة
    const focusableElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--primary)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = '';
            element.style.outlineOffset = '';
        });
    });
}

// =============================================
// Performance Monitoring
// =============================================

// مراقبة الأداء
function monitorPerformance() {
    // مراقبة Core Web Vitals
    if ('web-vital' in window) {
        // يمكن إضافة مكتبة web-vitals هنا لمراقبة الأداء
    }
    
    // مراقبة استخدام الذاكرة
    if ('memory' in performance) {
        const memory = performance.memory;
        console.log('Memory usage:', {
            used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
            total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
            limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
        });
    }
}

// تطبيق الفحص عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    checkAdminAccess();
    displayStudentInfo();
    enhancePageLoading();
    enhanceAccessibility();
    monitorPerformance();
    initFloatingGoUpButton(); // Initialize floating go up button
    
    console.log('🚀 Enhanced Common Functions loaded successfully!');
});
