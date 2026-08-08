/* Welcome Popup for Kids */

class WelcomePopup {
    constructor() {
        this.popup = null;
        this.isVisible = false;
        this.init();
    }

    init() {
        // التحقق من أن المستخدم لم ير النافذة من قبل
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
        if (!hasSeenWelcome) {
            setTimeout(() => {
                this.showWelcome();
            }, 1000); // تأخير قصير لتحميل الصفحة
        }
    }

    showWelcome() {
        this.createPopup();
        this.animateIn();
        this.isVisible = true;
        
        // تشغيل صوت الترحيب
        if (window.soundManager) {
            window.soundManager.playSound('open');
        }
    }

    createPopup() {
        // إنشاء الخلفية المظلمة
        const overlay = document.createElement('div');
        overlay.className = 'welcome-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.5s ease;
        `;

        // إنشاء النافذة الرئيسية
        this.popup = document.createElement('div');
        this.popup.className = 'welcome-popup';
        this.popup.style.cssText = `
            background: var(--pure-white);
            border-radius: 2rem;
            padding: 3rem 2rem;
            text-align: center;
            max-width: 500px;
            width: 90%;
            box-shadow: var(--shadow-strong);
            transform: scale(0.5) translateY(50px);
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            position: relative;
            overflow: hidden;
        `;

        // إضافة الخلفية المتحركة
        const backgroundGradient = document.createElement('div');
        backgroundGradient.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--gradient-primary);
            opacity: 0.1;
            z-index: -1;
        `;

        // إنشاء المحتوى
        const content = document.createElement('div');
        content.innerHTML = `
            <div class="welcome-emoji" style="font-size: 4rem; margin-bottom: 1rem; animation: bounce 2s infinite;">
                👋
            </div>
            <h2 class="welcome-title" style="
                color: var(--text-dark);
                font-size: 2rem;
                font-weight: 800;
                margin-bottom: 1rem;
                text-shadow: 0 2px 4px rgba(94, 223, 255, 0.3);
            ">
                مرحبًا بك في بيئة التعلم الممتعة!
            </h2>
            <p class="welcome-message" style="
                color: var(--text-gray);
                font-size: 1.2rem;
                margin-bottom: 2rem;
                line-height: 1.6;
            ">
                🚀 استعد لمغامرة تعليمية رائعة مليئة بالألوان والأصوات الممتعة!<br>
                🎯 تعلم واستمتع في نفس الوقت!
            </p>
            <div class="welcome-characters" style="
                display: flex;
                justify-content: center;
                gap: 1rem;
                margin-bottom: 2rem;
                font-size: 2rem;
            ">
                <span style="animation: wave 2s infinite; animation-delay: 0s;">🤖</span>
                <span style="animation: wave 2s infinite; animation-delay: 0.2s;">🧑‍🏫</span>
                <span style="animation: wave 2s infinite; animation-delay: 0.4s;">🎨</span>
                <span style="animation: wave 2s infinite; animation-delay: 0.6s;">⭐</span>
            </div>
            <button class="welcome-button btn-kids-primary" style="
                padding: 1rem 2rem;
                font-size: 1.2rem;
                font-weight: 700;
                border: none;
                border-radius: 2rem;
                cursor: pointer;
                transition: var(--transition-bounce);
            ">
                🚀 ابدأ المغامرة الآن!
            </button>
        `;

        // إضافة الحركات CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 20%, 50%, 80%, 100% {
                    transform: translateY(0);
                }
                40% {
                    transform: translateY(-20px);
                }
                60% {
                    transform: translateY(-10px);
                }
            }
            
            @keyframes wave {
                0%, 100% {
                    transform: rotate(0deg);
                }
                25% {
                    transform: rotate(15deg);
                }
                75% {
                    transform: rotate(-15deg);
                }
            }
            
            .welcome-button:hover {
                transform: translateY(-5px) scale(1.05);
                box-shadow: var(--shadow-medium);
            }
            
            .welcome-button:active {
                transform: translateY(-2px) scale(1.02);
            }
        `;
        document.head.appendChild(style);

        // تجميع العناصر
        this.popup.appendChild(backgroundGradient);
        this.popup.appendChild(content);
        overlay.appendChild(this.popup);
        document.body.appendChild(overlay);

        // إضافة المستمعين للأحداث
        this.addEventListeners();
    }

    addEventListeners() {
        const button = this.popup.querySelector('.welcome-button');
        const overlay = this.popup.parentElement;

        // النقر على الزر
        button.addEventListener('click', () => {
            this.hideWelcome();
            if (window.soundManager) {
                window.soundManager.playSound('success');
            }
        });

        // النقر على الخلفية
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                this.hideWelcome();
            }
        });

        // مفتاح Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isVisible) {
                this.hideWelcome();
            }
        });

        // إغلاق تلقائي بعد 10 ثوان
        setTimeout(() => {
            if (this.isVisible) {
                this.hideWelcome();
            }
        }, 10000);
    }

    animateIn() {
        const overlay = this.popup.parentElement;
        
        // تحريك الخلفية
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 50);

        // تحريك النافذة
        setTimeout(() => {
            this.popup.style.transform = 'scale(1) translateY(0)';
        }, 100);
    }

    hideWelcome() {
        if (!this.isVisible) return;

        const overlay = this.popup.parentElement;
        
        // تحريك النافذة للخروج
        this.popup.style.transform = 'scale(0.5) translateY(50px)';
        overlay.style.opacity = '0';

        // إزالة العناصر بعد الانتهاء من الحركة
        setTimeout(() => {
            document.body.removeChild(overlay);
            this.isVisible = false;
        }, 500);

        // حفظ أن المستخدم رأى النافذة
        localStorage.setItem('hasSeenWelcome', 'true');
    }

    // طريقة لإعادة تعيين النافذة (للمطورين)
    reset() {
        localStorage.removeItem('hasSeenWelcome');
        this.isVisible = false;
    }
}

// إنشاء نافذة الترحيب عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new WelcomePopup();
});

// تصدير الكلاس للاستخدام العام
window.WelcomePopup = WelcomePopup;

