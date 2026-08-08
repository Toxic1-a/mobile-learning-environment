/**
 * Floating Elements System for Kids Learning Platform
 * نظام العناصر الطافية للمنصة التعليمية للأطفال
 * رموز تعليمية طافية: ⭐📚✨🎯💡🏆
 */

class FloatingElementsManager {
    constructor() {
        this.elements = [];
        this.maxElements = 8;
        this.isActive = false;
        this.animationId = null;
        this.lastScrollY = 0;
        this.intersectionObserver = null;
        this.isEnabled = true; // إمكانية إيقاف النظام
        
        // التعليمية رموز
        this.educationalEmojis = ['⭐', '📚', '✨', '🎯', '💡', '🏆', '🌟', '📖', '🎨', '🧠', '💻', '🔬', '📝', '🎓', '🎪'];
        
        this.init();
    }

    init() {
        // إنشاء Intersection Observer لتحسين الأداء
        this.setupIntersectionObserver();
        
        // بدء النظام عند تحميل الصفحة
        this.startFloatingElements();
        
        // إضافة event listeners
        this.setupEventListeners();
    }

    setupIntersectionObserver() {
        this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.isActive = true;
                    this.createFloatingElements();
                } else {
                    this.isActive = false;
                    this.clearFloatingElements();
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });

        // مراقبة المحتوى الرئيسي
        const mainContent = document.querySelector('main');
        if (mainContent) {
            this.intersectionObserver.observe(mainContent);
        }
    }

    setupEventListeners() {
        // تحسين الأداء مع throttle
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 16); // ~60fps
        });

        // إيقاف الأنيميشن عند عدم التركيز
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAnimations();
            } else {
                this.resumeAnimations();
            }
        });

        // تنظيف عند إغلاق الصفحة
        window.addEventListener('beforeunload', () => {
            this.cleanup();
        });
    }

    startFloatingElements() {
        if (!this.isActive || !this.isEnabled) return;
        
        // إنشاء العناصر الطافية
        this.createFloatingElements();
        
        // بدء الأنيميشن
        this.startAnimation();
    }

    createFloatingElements() {
        // إنشاء عناصر جديدة إذا كان العدد أقل من الحد الأقصى والنظام مفعل
        if (this.elements.length < this.maxElements && this.isEnabled) {
            const elementsToCreate = Math.min(2, this.maxElements - this.elements.length);
            
            for (let i = 0; i < elementsToCreate; i++) {
                setTimeout(() => {
                    this.createSingleFloatingElement();
                }, i * 1000); // تأخير أطول بين العناصر
            }
        }
    }

    createSingleFloatingElement() {
        // اختيار رمز عشوائي
        const emoji = this.educationalEmojis[Math.floor(Math.random() * this.educationalEmojis.length)];
        
        // إنشاء العنصر
        const element = document.createElement('div');
        element.className = 'floating-emoji';
        element.textContent = emoji;
        
        // إعداد الأنماط
        this.setupElementStyles(element);
        
        // إضافة للصفحة
        document.body.appendChild(element);
        
        // حفظ المرجع
        this.elements.push(element);
        
        // إضافة event listener للتفاعل
        this.addInteractionListeners(element);
        
        // إزالة تلقائية بعد فترة
        setTimeout(() => {
            this.removeElement(element);
        }, 8000 + Math.random() * 4000); // 8-12 ثانية
    }

    setupElementStyles(element) {
        // موضع عشوائي
        const x = Math.random() * (window.innerWidth - 50);
        const y = window.innerHeight + 50;
        
        // حجم عشوائي
        const size = 16 + Math.random() * 12; // 16-28px (أصغر)
        
        // سرعة عشوائية
        const speed = 0.5 + Math.random() * 1; // 0.5-1.5
        
        // لون عشوائي (للرموز التي تدعم الألوان)
        const colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
            '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // تطبيق الأنماط
        Object.assign(element.style, {
            position: 'fixed',
            left: `${x}px`,
            top: `${y}px`,
            fontSize: `${size}px`,
            zIndex: '1000',
            pointerEvents: 'none',
            userSelect: 'none',
            willChange: 'transform',
            transition: 'transform 0.3s ease-out',
            opacity: '0.8',
            filter: `drop-shadow(0 0 10px ${color})`,
            color: color,
            textShadow: `0 0 20px ${color}`,
            transform: 'translateY(0)',
            animation: `floatUp ${15 + Math.random() * 10}s linear forwards`,
            animationDelay: `${Math.random() * 2}s`
        });
        
        // إضافة keyframes للأنيميشن
        this.addFloatUpAnimation(speed);
        
        // حفظ البيانات
        element.dataset.speed = speed;
        element.dataset.color = color;
    }

    addFloatUpAnimation(speed) {
        // إنشاء keyframes ديناميكية إذا لم تكن موجودة
        if (!document.getElementById('floatUpKeyframes')) {
            const style = document.createElement('style');
            style.id = 'floatUpKeyframes';
            style.textContent = `
                @keyframes floatUp {
                    0% {
                        transform: translateY(0) rotate(0deg);
                        opacity: 0.8;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 0.8;
                    }
                    100% {
                        transform: translateY(-${window.innerHeight + 100}px) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    addInteractionListeners(element) {
        // تفعيل pointer events للتفاعل
        element.style.pointerEvents = 'auto';
        
        // تأثير عند النقر
        element.addEventListener('click', () => {
            this.onElementClick(element);
        });
        
        // تأثير عند التمرير
        element.addEventListener('mouseenter', () => {
            this.onElementHover(element, true);
        });
        
        element.addEventListener('mouseleave', () => {
            this.onElementHover(element, false);
        });
    }

    onElementClick(element) {
        // تأثير بصري
        element.style.transform = 'scale(1.5) rotate(360deg)';
        element.style.filter = 'brightness(2) drop-shadow(0 0 30px gold)';
        
        // صوت التفاعل
        if (window.soundManager) {
            window.soundManager.playSound('click');
        }
        
        // إزالة بعد التأثير
        setTimeout(() => {
            this.removeElement(element);
        }, 500);
        
        // إنشاء عنصر جديد
        setTimeout(() => {
            this.createSingleFloatingElement();
        }, 1000);
    }

    onElementHover(element, isHovering) {
        if (isHovering) {
            element.style.transform = 'scale(1.2)';
            element.style.filter = 'brightness(1.5)';
            element.style.cursor = 'pointer';
        } else {
            element.style.transform = 'scale(1)';
            element.style.filter = `brightness(1) drop-shadow(0 0 10px ${element.dataset.color})`;
            element.style.cursor = 'default';
        }
    }

    handleScroll() {
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - this.lastScrollY;
        
        // تأثير parallax خفيف
        this.elements.forEach((element, index) => {
            const speed = parseFloat(element.dataset.speed) || 1;
            const parallaxOffset = scrollDelta * 0.1 * speed;
            
            const currentTransform = element.style.transform;
            const match = currentTransform.match(/translateX\(([^)]+)\)/);
            const currentX = match ? parseFloat(match[1]) : 0;
            
            element.style.transform = currentTransform.replace(
                /translateX\([^)]*\)/,
                `translateX(${currentX + parallaxOffset}px)`
            );
        });
        
        this.lastScrollY = currentScrollY;
    }

    startAnimation() {
        if (this.animationId) return;
        
        const animate = () => {
            if (!this.isActive) return;
            
            this.elements.forEach(element => {
                // تأثيرات إضافية
                this.applyExtraEffects(element);
            });
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    applyExtraEffects(element) {
        // تأثير الطفو الخفيف
        const time = Date.now() * 0.001;
        const floatOffset = Math.sin(time + element.dataset.speed * 2) * 2;
        
        const currentTransform = element.style.transform;
        const match = currentTransform.match(/translateY\(([^)]+)\)/);
        const currentY = match ? parseFloat(match[1]) : 0;
        
        element.style.transform = currentTransform.replace(
            /translateY\([^)]*\)/,
            `translateY(${currentY + floatOffset}px)`
        );
    }

    removeElement(element) {
        const index = this.elements.indexOf(element);
        if (index > -1) {
            this.elements.splice(index, 1);
        }
        
        if (element.parentNode) {
            element.style.transition = 'all 0.5s ease-out';
            element.style.transform = 'scale(0) rotate(360deg)';
            element.style.opacity = '0';
            
            setTimeout(() => {
                if (element.parentNode) {
                    element.parentNode.removeChild(element);
                }
            }, 500);
        }
    }

    clearFloatingElements() {
        this.elements.forEach(element => {
            this.removeElement(element);
        });
        this.elements = [];
    }

    pauseAnimations() {
        this.elements.forEach(element => {
            element.style.animationPlayState = 'paused';
        });
    }

    resumeAnimations() {
        this.elements.forEach(element => {
            element.style.animationPlayState = 'running';
        });
    }

    cleanup() {
        // إيقاف الأنيميشن
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        
        // إزالة جميع العناصر
        this.clearFloatingElements();
        
        // قطع الاتصال بـ Observer
        if (this.intersectionObserver) {
            this.intersectionObserver.disconnect();
        }
    }

    // طرق عامة للتحكم
    start() {
        this.isActive = true;
        this.startFloatingElements();
    }

    stop() {
        this.isActive = false;
        this.clearFloatingElements();
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    enable() {
        this.isEnabled = true;
        this.startFloatingElements();
    }

    disable() {
        this.isEnabled = false;
        this.clearFloatingElements();
    }

    setMaxElements(count) {
        this.maxElements = Math.max(2, Math.min(15, count)); // حد أدنى وأقصى أقل
    }

    // إضافة عناصر خاصة للمناسبات
    createCelebrationElements() {
        const celebrationEmojis = ['🎉', '🎊', '🏆', '⭐', '✨', '🌟'];
        
        for (let i = 0; i < 10; i++) {
            setTimeout(() => {
                const element = document.createElement('div');
                element.className = 'floating-emoji celebration';
                element.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
                
                this.setupElementStyles(element);
                document.body.appendChild(element);
                
                // تأثير خاص للاحتفال
                element.style.animation = `celebrationFloat 2s ease-out forwards`;
                element.style.fontSize = '30px';
                element.style.filter = 'drop-shadow(0 0 20px gold)';
                
                setTimeout(() => {
                    this.removeElement(element);
                }, 2000);
            }, i * 100);
        }
    }
}

// إنشاء مدير العناصر الطافية
const floatingElementsManager = new FloatingElementsManager();

// تصدير للاستخدام العام
window.floatingElementsManager = floatingElementsManager;

// دوال مختصرة للاستخدام السهل
window.enableFloatingElements = () => floatingElementsManager.enable();
window.disableFloatingElements = () => floatingElementsManager.disable();
window.setFloatingElementsCount = (count) => floatingElementsManager.setMaxElements(count);

// إضافة CSS إضافي للاحتفالات
const celebrationStyles = document.createElement('style');
celebrationStyles.textContent = `
    @keyframes celebrationFloat {
        0% {
            transform: translateY(0) scale(0) rotate(0deg);
            opacity: 1;
        }
        50% {
            transform: translateY(-100px) scale(1.5) rotate(180deg);
            opacity: 1;
        }
        100% {
            transform: translateY(-200px) scale(1) rotate(360deg);
            opacity: 0;
        }
    }
    
    .floating-emoji.celebration {
        animation: celebrationFloat 2s ease-out forwards !important;
        font-size: 30px !important;
        filter: drop-shadow(0 0 20px gold) !important;
    }
`;
document.head.appendChild(celebrationStyles);

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن النظام يعمل فقط في صفحات الدروس
    if (window.location.pathname.includes('lesson') || 
        window.location.pathname.includes('group')) {
        floatingElementsManager.start();
    }
});

console.log('🌟 Floating Elements System loaded successfully!');
