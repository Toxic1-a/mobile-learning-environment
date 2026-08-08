/**
 * Enhanced Button Interactions System
 * نظام تفاعلات الأزرار المحسن مع Ripple Effects
 * تفاعلات سلسة ومذهلة للأزرار والبطاقات
 */

class ButtonInteractionsManager {
    constructor() {
        this.rippleElements = new Map();
        this.hoverEffects = new Map();
        this.clickEffects = new Map();
        this.isTouchDevice = 'ontouchstart' in window;
        
        this.init();
    }

    init() {
        // إعداد الأنماط CSS
        this.setupStyles();
        
        // إعداد event listeners
        this.setupEventListeners();
        
        // تطبيق التفاعلات على العناصر الموجودة
        this.initializeInteractions();
        
        // مراقبة العناصر الجديدة
        this.setupMutationObserver();
    }

    setupStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Ripple Effect Styles */
            .ripple-container {
                position: relative;
                overflow: hidden;
                cursor: pointer;
            }

            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }

            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }

            /* Enhanced Button Styles */
            .btn-enhanced {
                position: relative;
                overflow: hidden;
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                transform: translateZ(0);
                backface-visibility: hidden;
            }

            .btn-enhanced::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                transition: left 0.5s;
            }

            .btn-enhanced:hover::before {
                left: 100%;
            }

            .btn-enhanced:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }

            .btn-enhanced:active {
                transform: translateY(0) scale(0.98);
                transition: transform 0.1s ease;
            }

            /* Card Interaction Styles */
            .card-enhanced {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
                transform: translateZ(0);
            }

            .card-enhanced:hover {
                transform: translateY(-8px) scale(1.02);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }

            .card-enhanced:active {
                transform: translateY(-4px) scale(1.01);
                transition: transform 0.1s ease;
            }

            /* Question Card Enhanced Styles */
            .question-card-enhanced {
                transition: all 0.3s ease;
                border: 2px solid transparent;
                cursor: pointer;
                position: relative;
                overflow: hidden;
            }

            .question-card-enhanced::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 0;
                height: 100%;
                background: linear-gradient(90deg, rgba(37, 99, 235, 0.1), rgba(37, 99, 235, 0.05));
                transition: width 0.3s ease;
            }

            .question-card-enhanced:hover::before {
                width: 100%;
            }

            .question-card-enhanced:hover {
                border-color: var(--primary);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
                transform: translateY(-2px);
            }

            .question-card-enhanced.selected {
                border-color: var(--success);
                background: rgba(34, 197, 94, 0.05);
                animation: pulse 0.5s ease-in-out;
            }

            .question-card-enhanced.correct {
                border-color: var(--success);
                background: rgba(34, 197, 94, 0.1);
                animation: checkmark 0.6s ease-out;
            }

            .question-card-enhanced.incorrect {
                border-color: var(--danger);
                background: rgba(239, 68, 68, 0.1);
                animation: shake 0.5s ease-in-out;
            }

            /* Icon Interaction Styles */
            .icon-enhanced {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                cursor: pointer;
            }

            .icon-enhanced:hover {
                transform: rotate(15deg) scale(1.1);
                filter: brightness(1.2);
            }

            /* Loading Button Styles */
            .btn-loading {
                position: relative;
                color: transparent !important;
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

            /* Success Button Styles */
            .btn-success-animation {
                animation: successBounce 0.6s ease-out;
            }

            @keyframes successBounce {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }

            /* Glow Effect */
            .glow-effect {
                position: relative;
            }

            .glow-effect::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: inherit;
                background: inherit;
                filter: blur(10px);
                opacity: 0;
                transition: opacity 0.3s ease;
                z-index: -1;
            }

            .glow-effect:hover::after {
                opacity: 0.5;
            }

            /* Touch Device Optimizations */
            @media (hover: none) and (pointer: coarse) {
                .btn-enhanced:hover,
                .card-enhanced:hover,
                .question-card-enhanced:hover,
                .icon-enhanced:hover {
                    transform: none;
                }
                
                .btn-enhanced:active,
                .card-enhanced:active,
                .question-card-enhanced:active {
                    transform: scale(0.95);
                    transition: transform 0.1s ease;
                }
            }

            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .btn-enhanced,
                .card-enhanced,
                .question-card-enhanced,
                .icon-enhanced,
                .ripple-effect {
                    transition: none;
                    animation: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // إعداد event delegation للأزرار
        document.addEventListener('click', (e) => {
            this.handleClick(e);
        });

        document.addEventListener('mouseenter', (e) => {
            this.handleMouseEnter(e);
        }, true);

        document.addEventListener('mouseleave', (e) => {
            this.handleMouseLeave(e);
        }, true);

        // إعداد touch events للأجهزة اللمسية
        if (this.isTouchDevice) {
            document.addEventListener('touchstart', (e) => {
                this.handleTouchStart(e);
            });

            document.addEventListener('touchend', (e) => {
                this.handleTouchEnd(e);
            });
        }
    }

    initializeInteractions() {
        // تطبيق التفاعلات على الأزرار الموجودة
        this.enhanceButtons();
        
        // تطبيق التفاعلات على البطاقات
        this.enhanceCards();
        
        // تطبيق التفاعلات على الأسئلة
        this.enhanceQuestionCards();
        
        // تطبيق التفاعلات على الأيقونات
        this.enhanceIcons();
    }

    enhanceButtons() {
        const buttons = document.querySelectorAll('button, .btn, a[role="button"], input[type="submit"], input[type="button"]');
        
        buttons.forEach(button => {
            this.addButtonEnhancements(button);
        });
    }

    enhanceCards() {
        const cards = document.querySelectorAll('.card, .card-interactive');
        
        cards.forEach(card => {
            this.addCardEnhancements(card);
        });
    }

    enhanceQuestionCards() {
        const questionCards = document.querySelectorAll('.question-card, .question-card-interactive');
        
        questionCards.forEach(card => {
            this.addQuestionCardEnhancements(card);
        });
    }

    enhanceIcons() {
        const icons = document.querySelectorAll('i[class*="bi-"], .icon, [class*="icon-"]');
        
        icons.forEach(icon => {
            this.addIconEnhancements(icon);
        });
    }

    addButtonEnhancements(button) {
        // إضافة كلاسات التحسين
        button.classList.add('btn-enhanced');
        
        // إضافة ripple container
        if (!button.classList.contains('ripple-container')) {
            button.classList.add('ripple-container');
        }
        
        // حفظ المرجع
        this.rippleElements.set(button, true);
    }

    addCardEnhancements(card) {
        // إضافة كلاسات التحسين
        card.classList.add('card-enhanced');
        
        // إضافة ripple container
        if (!card.classList.contains('ripple-container')) {
            card.classList.add('ripple-container');
        }
        
        // حفظ المرجع
        this.rippleElements.set(card, true);
    }

    addQuestionCardEnhancements(card) {
        // إضافة كلاسات التحسين
        card.classList.add('question-card-enhanced');
        
        // إضافة ripple container
        if (!card.classList.contains('ripple-container')) {
            card.classList.add('ripple-container');
        }
        
        // إضافة event listener للاختيار
        card.addEventListener('click', (e) => {
            this.handleQuestionCardClick(card, e);
        });
        
        // حفظ المرجع
        this.rippleElements.set(card, true);
    }

    addIconEnhancements(icon) {
        // إضافة كلاسات التحسين
        icon.classList.add('icon-enhanced');
        
        // حفظ المرجع
        this.hoverEffects.set(icon, true);
    }

    handleClick(e) {
        const element = e.target.closest('.ripple-container');
        if (element && this.rippleElements.has(element)) {
            this.createRippleEffect(element, e);
        }
    }

    createRippleEffect(element, event) {
        // التحقق من تفضيلات الحركة
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;

        const ripple = document.createElement('span');
        ripple.className = 'ripple-effect';
        ripple.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
        `;

        element.appendChild(ripple);

        // إزالة العنصر بعد انتهاء الأنيميشن
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.parentNode.removeChild(ripple);
            }
        }, 600);

        // تشغيل الصوت
        if (window.soundManager) {
            window.soundManager.playSound('click');
        }
    }

    handleQuestionCardClick(card, event) {
        // إزالة التحديد من البطاقات الأخرى في نفس المجموعة
        const parent = card.closest('form, .questions-container, .quiz-container');
        if (parent) {
            const otherCards = parent.querySelectorAll('.question-card-enhanced.selected');
            otherCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('selected');
                }
            });
        }

        // إضافة التحديد للبطاقة الحالية
        card.classList.add('selected');

        // تأثير بصري إضافي
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);

        // تشغيل الصوت
        if (window.soundManager) {
            window.soundManager.playSound('cardClick');
        }
    }

    handleMouseEnter(event) {
        const element = event.target;
        
        if (element.classList.contains('btn-enhanced') || 
            element.classList.contains('card-enhanced') ||
            element.classList.contains('question-card-enhanced') ||
            element.classList.contains('icon-enhanced')) {
            
            // تأثير hover بصري
            this.addHoverEffect(element);
        }
    }

    handleMouseLeave(event) {
        const element = event.target;
        
        if (element.classList.contains('btn-enhanced') || 
            element.classList.contains('card-enhanced') ||
            element.classList.contains('question-card-enhanced') ||
            element.classList.contains('icon-enhanced')) {
            
            // إزالة تأثير hover
            this.removeHoverEffect(element);
        }
    }

    addHoverEffect(element) {
        // إضافة تأثير hover خفيف
        if (window.soundManager && Math.random() < 0.05) { // 5% احتمال
            window.soundManager.playSound('scroll');
        }
    }

    removeHoverEffect(element) {
        // إزالة تأثير hover
    }

    handleTouchStart(event) {
        const element = event.target.closest('.btn-enhanced, .card-enhanced, .question-card-enhanced');
        if (element) {
            element.style.transform = 'scale(0.95)';
            element.style.transition = 'transform 0.1s ease';
        }
    }

    handleTouchEnd(event) {
        const element = event.target.closest('.btn-enhanced, .card-enhanced, .question-card-enhanced');
        if (element) {
            element.style.transform = '';
            setTimeout(() => {
                element.style.transition = '';
            }, 100);
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        this.enhanceNewElement(node);
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    enhanceNewElement(element) {
        // تطبيق التحسينات على العناصر الجديدة
        if (element.matches('button, .btn, a[role="button"]')) {
            this.addButtonEnhancements(element);
        }
        
        if (element.matches('.card, .card-interactive')) {
            this.addCardEnhancements(element);
        }
        
        if (element.matches('.question-card, .question-card-interactive')) {
            this.addQuestionCardEnhancements(element);
        }
        
        if (element.matches('i[class*="bi-"], .icon, [class*="icon-"]')) {
            this.addIconEnhancements(element);
        }

        // التحقق من العناصر الفرعية
        const buttons = element.querySelectorAll('button, .btn, a[role="button"]');
        const cards = element.querySelectorAll('.card, .card-interactive');
        const questionCards = element.querySelectorAll('.question-card, .question-card-interactive');
        const icons = element.querySelectorAll('i[class*="bi-"], .icon, [class*="icon-"]');

        buttons.forEach(btn => this.addButtonEnhancements(btn));
        cards.forEach(card => this.addCardEnhancements(card));
        questionCards.forEach(card => this.addQuestionCardEnhancements(card));
        icons.forEach(icon => this.addIconEnhancements(icon));
    }

    // دوال خاصة للتحكم في الحالة
    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.classList.add('btn-loading');
            button.disabled = true;
        } else {
            button.classList.remove('btn-loading');
            button.disabled = false;
        }
    }

    setButtonSuccess(button) {
        button.classList.add('btn-success-animation');
        setTimeout(() => {
            button.classList.remove('btn-success-animation');
        }, 600);
    }

    setQuestionCardState(card, state) {
        // إزالة الحالات السابقة
        card.classList.remove('correct', 'incorrect', 'selected');
        
        // إضافة الحالة الجديدة
        if (state) {
            card.classList.add(state);
        }
    }

    addGlowEffect(element) {
        element.classList.add('glow-effect');
    }

    removeGlowEffect(element) {
        element.classList.remove('glow-effect');
    }

    // دوال عامة للتحكم
    enableInteractions() {
        // تفعيل جميع التفاعلات
        this.rippleElements.forEach((_, element) => {
            element.style.pointerEvents = 'auto';
        });
    }

    disableInteractions() {
        // تعطيل جميع التفاعلات
        this.rippleElements.forEach((_, element) => {
            element.style.pointerEvents = 'none';
        });
    }

    // تنظيف الموارد
    destroy() {
        this.rippleElements.clear();
        this.hoverEffects.clear();
        this.clickEffects.clear();
    }
}

// إنشاء مدير تفاعلات الأزرار
const buttonInteractionsManager = new ButtonInteractionsManager();

// تصدير للاستخدام العام
window.buttonInteractionsManager = buttonInteractionsManager;

// دوال مختصرة للاستخدام السهل
window.setButtonLoading = (button, isLoading) => buttonInteractionsManager.setButtonLoading(button, isLoading);
window.setButtonSuccess = (button) => buttonInteractionsManager.setButtonSuccess(button);
window.setQuestionCardState = (card, state) => buttonInteractionsManager.setQuestionCardState(card, state);
window.addGlowEffect = (element) => buttonInteractionsManager.addGlowEffect(element);
window.removeGlowEffect = (element) => buttonInteractionsManager.removeGlowEffect(element);

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن النظام يعمل في جميع الصفحات
    console.log('🎯 Button Interactions System initialized');
});

console.log('🎯 Button Interactions System loaded successfully!');
