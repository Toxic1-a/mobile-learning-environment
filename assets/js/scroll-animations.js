/**
 * Scroll Animations System using Intersection Observer
 * نظام الأنيميشن عند التمرير باستخدام Intersection Observer
 * أنيميشن سلسة ومذهلة عند ظهور العناصر في الشاشة
 */

class ScrollAnimationsManager {
    constructor() {
        this.observers = new Map();
        this.animatedElements = new Set();
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.throttleDelay = 16; // ~60fps
        this.lastScrollTime = 0;
        
        this.init();
    }

    init() {
        // التحقق من دعم Intersection Observer
        if (!('IntersectionObserver' in window)) {
            console.warn('IntersectionObserver not supported, falling back to scroll events');
            this.setupScrollFallback();
            return;
        }

        // إعداد مراقب الأنيميشن الرئيسي
        this.setupMainObserver();
        
        // إعداد مراقب العناصر المتتالية
        this.setupStaggerObserver();
        
        // إعداد مراقب الأنيميشن المتقدم
        this.setupAdvancedObserver();
        
        // إعداد event listeners
        this.setupEventListeners();
        
        // تشغيل الأنيميشن عند التحميل
        this.initializeAnimations();
    }

    setupMainObserver() {
        const options = {
            threshold: 0.1,
            rootMargin: '50px 0px -50px 0px'
        };

        this.mainObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);

        // مراقبة جميع العناصر القابلة للأنيميشن
        this.observeElements();
    }

    setupStaggerObserver() {
        const staggerOptions = {
            threshold: 0.2,
            rootMargin: '100px 0px -50px 0px'
        };

        this.staggerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.triggerStaggerAnimation(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, staggerOptions);
    }

    setupAdvancedObserver() {
        const advancedOptions = {
            threshold: [0, 0.25, 0.5, 0.75, 1],
            rootMargin: '0px 0px -100px 0px'
        };

        this.advancedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.handleAdvancedAnimation(entry);
                }
            });
        }, advancedOptions);
    }

    setupEventListeners() {
        // مراقبة تغيير حجم النافذة
        window.addEventListener('resize', this.throttle(() => {
            this.refreshObservers();
        }, 250));

        // مراقبة تغيير تفضيلات الحركة
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addListener((e) => {
            this.isReducedMotion = e.matches;
            this.handleMotionPreferenceChange();
        });

        // مراقبة إضافة عناصر جديدة (للمحتوى الديناميكي)
        this.setupMutationObserver();
    }

    setupMutationObserver() {
        const mutationObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.observeNewElement(node);
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    observeElements() {
        // العناصر الأساسية للأنيميشن
        const selectors = [
            '.fade-in-scroll',
            '.slide-up-scroll',
            '.slide-left-scroll',
            '.slide-right-scroll',
            '.scale-in-scroll',
            '.card-interactive',
            '.question-card-interactive',
            '.btn-interactive',
            '.animate-on-scroll'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                this.mainObserver.observe(element);
            });
        });

        // العناصر المتتالية
        const staggerElements = document.querySelectorAll('.stagger-children');
        staggerElements.forEach(element => {
            this.staggerObserver.observe(element);
        });

        // العناصر المتقدمة
        const advancedElements = document.querySelectorAll('.advanced-animation');
        advancedElements.forEach(element => {
            this.advancedObserver.observe(element);
        });
    }

    observeNewElement(element) {
        // التحقق من العناصر الجديدة وإضافتها للمراقبة
        const animationClasses = [
            'fade-in-scroll', 'slide-up-scroll', 'slide-left-scroll', 
            'slide-right-scroll', 'scale-in-scroll', 'stagger-children'
        ];

        animationClasses.forEach(className => {
            if (element.classList.contains(className)) {
                if (className === 'stagger-children') {
                    this.staggerObserver.observe(element);
                } else {
                    this.mainObserver.observe(element);
                }
            }
        });

        // التحقق من العناصر الفرعية
        const childElements = element.querySelectorAll('.' + animationClasses.join(', .'));
        childElements.forEach(child => {
            if (child.classList.contains('stagger-children')) {
                this.staggerObserver.observe(child);
            } else {
                this.mainObserver.observe(child);
            }
        });
    }

    triggerAnimation(element) {
        if (this.isReducedMotion) {
            // تطبيق أنيميشن مبسطة للمستخدمين الذين يفضلون تقليل الحركة
            element.style.opacity = '1';
            element.style.transform = 'none';
            return;
        }

        // إضافة تأثير صوتي خفيف
        if (window.soundManager && Math.random() < 0.1) { // 10% احتمال
            window.soundManager.playSound('scroll');
        }

        // تحديد نوع الأنيميشن
        const animationType = this.determineAnimationType(element);
        
        // تطبيق الأنيميشن
        this.applyAnimation(element, animationType);
    }

    determineAnimationType(element) {
        // تحديد نوع الأنيميشن بناءً على الكلاسات
        if (element.classList.contains('fade-in-scroll')) return 'fadeIn';
        if (element.classList.contains('slide-up-scroll')) return 'slideUp';
        if (element.classList.contains('slide-left-scroll')) return 'slideLeft';
        if (element.classList.contains('slide-right-scroll')) return 'slideRight';
        if (element.classList.contains('scale-in-scroll')) return 'scaleIn';
        
        // تحديد تلقائي بناءً على موضع العنصر
        const rect = element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        
        if (rect.top < viewportCenter) {
            return 'fadeInUp';
        } else {
            return 'fadeIn';
        }
    }

    applyAnimation(element, type) {
        // Never animate from opacity:0 — hover used to cancel fill:forwards
        // and snap content back to invisible. Keep elements readable always.
        element.style.opacity = '1';
        element.style.visibility = 'visible';
        element.style.transform = 'none';
        element.classList.add('visible', 'animation-complete');
        void type;
    }

    applyFallbackAnimation(element, animation) {
        // تطبيق الأنيميشن باستخدام CSS transitions
        element.style.transition = `all ${animation.duration}ms ${animation.easing}`;
        
        // تطبيق الحالة الأولية
        Object.assign(element.style, animation.from);
        
        // تطبيق الحالة النهائية
        requestAnimationFrame(() => {
            Object.assign(element.style, animation.to);
        });
    }

    triggerStaggerAnimation(container) {
        const children = container.querySelectorAll(':scope > *');
        
        children.forEach((child, index) => {
            setTimeout(() => {
                this.triggerAnimation(child);
            }, index * 100); // تأخير 100ms بين كل عنصر
        });
    }

    handleAdvancedAnimation(entry) {
        const element = entry.target;
        const ratio = entry.intersectionRatio;
        
        // تطبيق أنيميشن متدرجة بناءً على نسبة الرؤية
        if (ratio >= 0.5) {
            element.classList.add('half-visible');
        }
        
        if (ratio >= 0.75) {
            element.classList.add('mostly-visible');
        }
        
        if (ratio === 1) {
            element.classList.add('fully-visible');
        }
    }

    handleMotionPreferenceChange() {
        if (this.isReducedMotion) {
            // إيقاف جميع الأنيميشن
            this.pauseAllAnimations();
        } else {
            // إعادة تشغيل الأنيميشن
            this.resumeAllAnimations();
        }
    }

    pauseAllAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation"], [style*="transition"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'paused';
            element.style.transition = 'none';
        });
    }

    resumeAllAnimations() {
        const animatedElements = document.querySelectorAll('[style*="animation-play-state"]');
        animatedElements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    setupScrollFallback() {
        // نظام احتياطي للدعم القديم
        let ticking = false;
        
        const updateAnimations = () => {
            const elements = document.querySelectorAll('.fade-in-scroll, .slide-up-scroll, .slide-left-scroll, .slide-right-scroll, .scale-in-scroll');
            
            elements.forEach(element => {
                if (this.animatedElements.has(element)) return;
                
                const rect = element.getBoundingClientRect();
                const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
                
                if (isVisible) {
                    this.triggerAnimation(element);
                    this.animatedElements.add(element);
                }
            });
            
            ticking = false;
        };
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateAnimations);
                ticking = true;
            }
        });
        
        // تشغيل فوري عند التحميل
        updateAnimations();
    }

    refreshObservers() {
        // إعادة تشغيل المراقبين عند تغيير حجم النافذة
        if (this.mainObserver) {
            this.mainObserver.disconnect();
        }
        if (this.staggerObserver) {
            this.staggerObserver.disconnect();
        }
        if (this.advancedObserver) {
            this.advancedObserver.disconnect();
        }
        
        // إعادة إعداد المراقبين
        this.setupMainObserver();
        this.setupStaggerObserver();
        this.setupAdvancedObserver();
    }

    initializeAnimations() {
        // تشغيل الأنيميشن للعناصر المرئية بالفعل
        const visibleElements = document.querySelectorAll('.fade-in-scroll, .slide-up-scroll, .slide-left-scroll, .slide-right-scroll, .scale-in-scroll');
        
        visibleElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                setTimeout(() => {
                    this.triggerAnimation(element);
                    this.animatedElements.add(element);
                }, 100);
            }
        });
    }

    // دوال مساعدة
    throttle(func, delay) {
        let timeoutId;
        let lastExecTime = 0;
        
        return function (...args) {
            const currentTime = Date.now();
            
            if (currentTime - lastExecTime > delay) {
                func.apply(this, args);
                lastExecTime = currentTime;
            } else {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    func.apply(this, args);
                    lastExecTime = Date.now();
                }, delay - (currentTime - lastExecTime));
            }
        };
    }

    // دوال عامة للتحكم
    pauseAnimations() {
        this.pauseAllAnimations();
    }

    resumeAnimations() {
        this.resumeAllAnimations();
    }

    resetAnimations() {
        this.animatedElements.clear();
        this.refreshObservers();
    }

    // تنظيف الموارد
    destroy() {
        if (this.mainObserver) this.mainObserver.disconnect();
        if (this.staggerObserver) this.staggerObserver.disconnect();
        if (this.advancedObserver) this.advancedObserver.disconnect();
        
        this.observers.clear();
        this.animatedElements.clear();
    }
}

// إنشاء مدير أنيميشن التمرير
const scrollAnimationsManager = new ScrollAnimationsManager();

// تصدير للاستخدام العام
window.scrollAnimationsManager = scrollAnimationsManager;

// دوال مختصرة للاستخدام السهل
window.pauseScrollAnimations = () => scrollAnimationsManager.pauseAnimations();
window.resumeScrollAnimations = () => scrollAnimationsManager.resumeAnimations();
window.resetScrollAnimations = () => scrollAnimationsManager.resetAnimations();

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن النظام يعمل فقط في صفحات الدروس والاختبارات
    if (window.location.pathname.includes('lesson') || 
        window.location.pathname.includes('group') ||
        window.location.pathname.includes('quiz')) {
        console.log('🎬 Scroll Animations System initialized for lessons page');
    }
});

console.log('🎬 Scroll Animations System loaded successfully!');
