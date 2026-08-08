/**
 * Celebration System for Kids Learning Platform
 * نظام الاحتفالات للمنصة التعليمية للأطفال
 * يستخدم canvas-confetti للاحتفالات المذهلة
 */

class CelebrationManager {
    constructor() {
        this.isConfettiLoaded = false;
        this.confettiConfig = {
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F']
        };
        
        this.init();
    }

    init() {
        // تحميل canvas-confetti من CDN
        this.loadConfettiLibrary();
        
        // إعداد الأنماط CSS للاحتفالات
        this.setupCelebrationStyles();
    }

    async loadConfettiLibrary() {
        try {
            // تحقق من وجود المكتبة أولاً
            if (typeof confetti !== 'undefined') {
                this.isConfettiLoaded = true;
                return;
            }

            // تحميل من CDN
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js';
            script.async = true;
            
            script.onload = () => {
                this.isConfettiLoaded = true;
                console.log('🎉 Confetti library loaded successfully!');
            };
            
            script.onerror = () => {
                console.warn('⚠️ Failed to load confetti library, using fallback animations');
                this.isConfettiLoaded = false;
            };
            
            document.head.appendChild(script);
        } catch (error) {
            console.error('Error loading confetti library:', error);
            this.isConfettiLoaded = false;
        }
    }

    setupCelebrationStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Celebration Modal Styles */
            .celebration-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            .celebration-modal.show {
                opacity: 1;
                visibility: visible;
            }

            .celebration-content {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 20px;
                padding: 40px;
                text-align: center;
                color: white;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                transform: scale(0.5);
                transition: transform 0.3s ease;
                max-width: 400px;
                margin: 20px;
            }

            .celebration-modal.show .celebration-content {
                transform: scale(1);
            }

            .celebration-emoji {
                font-size: 4rem;
                margin-bottom: 20px;
                animation: celebrationBounce 1s ease-in-out infinite alternate;
            }

            .celebration-title {
                font-size: 2rem;
                font-weight: bold;
                margin-bottom: 15px;
                text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .celebration-message {
                font-size: 1.2rem;
                margin-bottom: 25px;
                line-height: 1.5;
            }

            .celebration-button {
                background: rgba(255, 255, 255, 0.2);
                border: 2px solid white;
                color: white;
                padding: 12px 30px;
                border-radius: 25px;
                font-size: 1.1rem;
                font-weight: bold;
                cursor: pointer;
                transition: all 0.3s ease;
                backdrop-filter: blur(10px);
            }

            .celebration-button:hover {
                background: white;
                color: #667eea;
                transform: translateY(-2px);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            }

            @keyframes celebrationBounce {
                0% { transform: scale(1) rotate(-5deg); }
                100% { transform: scale(1.1) rotate(5deg); }
            }

            /* Emoji Reactions */
            .emoji-reaction {
                position: fixed;
                font-size: 2rem;
                z-index: 9999;
                pointer-events: none;
                animation: emojiReaction 2s ease-out forwards;
            }

            @keyframes emojiReaction {
                0% {
                    transform: translateY(0) scale(0) rotate(0deg);
                    opacity: 1;
                }
                50% {
                    transform: translateY(-50px) scale(1.5) rotate(180deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(-100px) scale(1) rotate(360deg);
                    opacity: 0;
                }
            }

            /* Success Indicators */
            .success-indicator {
                display: inline-block;
                margin-left: 10px;
                animation: successPulse 0.6s ease-out;
            }

            @keyframes successPulse {
                0% { transform: scale(0); }
                50% { transform: scale(1.3); }
                100% { transform: scale(1); }
            }

            /* Fireworks Effect */
            .fireworks-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9998;
            }

            .firework {
                position: absolute;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                animation: fireworkExplode 1s ease-out forwards;
            }

            @keyframes fireworkExplode {
                0% {
                    transform: scale(0);
                    opacity: 1;
                }
                50% {
                    transform: scale(1);
                    opacity: 1;
                }
                100% {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    // دالة الكونفيتي الرئيسية
    triggerConfetti(options = {}) {
        if (!this.isConfettiLoaded) {
            this.showFallbackCelebration('🎉');
            return;
        }

        const config = { ...this.confettiConfig, ...options };
        
        // تشغيل الكونفيتي
        confetti(config);
        
        // تأثير صوتي
        this.playCelebrationSound();
        
        // إضافة عناصر طافية إضافية
        if (window.floatingElementsManager) {
            window.floatingElementsManager.createCelebrationElements();
        }
    }

    // دالة الألعاب النارية
    triggerFireworks() {
        if (!this.isConfettiLoaded) {
            this.showFallbackCelebration('🎆');
            return;
        }

        // عدة انفجارات (أقل)
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
        
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight * 0.5;
                
                confetti({
                    particleCount: 80,
                    spread: 60,
                    origin: { x: x / window.innerWidth, y: y / window.innerHeight },
                    colors: colors
                });
            }, i * 600);
        }
        
        this.playCelebrationSound();
    }

    // دالة النجوم المتساقطة
    triggerStarsRain() {
        if (!this.isConfettiLoaded) {
            this.showFallbackCelebration('⭐');
            return;
        }

        // إنشاء عدة انفجارات من النجوم (أقل)
        for (let i = 0; i < 4; i++) {
            setTimeout(() => {
                confetti({
                    particleCount: 30,
                    spread: 50,
                    origin: { y: 0.1 },
                    colors: ['#FFD700', '#FFA500', '#FFFF00'],
                    shapes: ['star'],
                    scalar: 1.2
                });
            }, i * 300);
        }
        
        this.playCelebrationSound();
    }

    // دالة ردود الإيموجي السريعة
    showEmojiReaction(emoji, message = '') {
        // إنشاء عنصر الإيموجي
        const emojiElement = document.createElement('div');
        emojiElement.className = 'emoji-reaction';
        emojiElement.textContent = emoji;
        
        // موضع عشوائي
        emojiElement.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        emojiElement.style.top = Math.random() * (window.innerHeight - 100) + 'px';
        
        // إضافة للصفحة
        document.body.appendChild(emojiElement);
        
        // إزالة بعد الانتهاء
        setTimeout(() => {
            if (emojiElement.parentNode) {
                emojiElement.parentNode.removeChild(emojiElement);
            }
        }, 2000);
        
        // إظهار رسالة إذا كانت موجودة
        if (message) {
            this.showTemporaryMessage(message);
        }
        
        // تأثير صوتي خفيف
        if (window.soundManager) {
            window.soundManager.playSound('click');
        }
    }

    // دالة عرض رسالة مؤقتة
    showTemporaryMessage(message) {
        const messageElement = document.createElement('div');
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 25px;
            font-size: 1.2rem;
            font-weight: bold;
            z-index: 9999;
            animation: messageFade 3s ease-out forwards;
        `;
        messageElement.textContent = message;
        
        document.body.appendChild(messageElement);
        
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, 3000);
    }

    // دالة الاحتفال الرئيسية مع النتيجة
    celebrateAchievement(score, totalQuestions = 10) {
        const percentage = (score / totalQuestions) * 100;
        
        if (percentage >= 90) {
            // ممتاز!
            this.showCelebrationModal('🎉', 'ممتاز!', 'أحسنت! لقد حصلت على نتيجة رائعة!');
            this.triggerConfetti({ particleCount: 200, spread: 100 });
            this.triggerFireworks();
            setTimeout(() => this.triggerStarsRain(), 1000);
            
        } else if (percentage >= 70) {
            // جيد جداً
            this.showCelebrationModal('⭐', 'أحسنت!', 'نتيجة ممتازة! استمر في التقدم!');
            this.triggerConfetti({ particleCount: 100, spread: 70 });
            this.triggerStarsRain();
            
        } else if (percentage >= 50) {
            // جيد
            this.showCelebrationModal('👍', 'جيد!', 'نتيجة جيدة! يمكنك التحسن أكثر!');
            this.triggerConfetti({ particleCount: 50, spread: 50 });
            
        } else {
            // تشجيع
            this.showCelebrationModal('💪', 'حاول مرة أخرى!', 'لا تستسلم! التعلم يحتاج وقت ومجهود!');
            this.showEmojiReaction('💪', 'أنت تستطيع!');
        }
        
        // إضافة مؤشر النجاح للعناصر
        this.addSuccessIndicators();
    }

    // دالة عرض نافذة الاحتفال
    showCelebrationModal(emoji, title, message) {
        // إنشاء النافذة
        const modal = document.createElement('div');
        modal.className = 'celebration-modal';
        modal.innerHTML = `
            <div class="celebration-content">
                <div class="celebration-emoji">${emoji}</div>
                <div class="celebration-title">${title}</div>
                <div class="celebration-message">${message}</div>
                <button class="celebration-button" onclick="this.parentElement.parentElement.remove()">
                    رائع! 🎉
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // إظهار النافذة
        setTimeout(() => {
            modal.classList.add('show');
        }, 100);
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (modal.parentNode) {
                modal.classList.remove('show');
                setTimeout(() => {
                    if (modal.parentNode) {
                        modal.parentNode.removeChild(modal);
                    }
                }, 300);
            }
        }, 5000);
    }

    // دالة إضافة مؤشرات النجاح
    addSuccessIndicators() {
        // إضافة مؤشرات النجاح للعناصر الصحيحة
        const correctElements = document.querySelectorAll('.question-card.correct, .btn-success');
        correctElements.forEach(element => {
            if (!element.querySelector('.success-indicator')) {
                const indicator = document.createElement('span');
                indicator.className = 'success-indicator';
                indicator.textContent = '✅';
                element.appendChild(indicator);
            }
        });
    }

    // دالة الاحتفال عند إتمام درس
    celebrateLessonCompletion(lessonTitle) {
        this.showCelebrationModal(
            '🏆',
            'تهانينا!',
            `لقد أكملت درس "${lessonTitle}" بنجاح!`
        );
        
        this.triggerConfetti({ particleCount: 150, spread: 80 });
        setTimeout(() => this.triggerStarsRain(), 800);
        
        // تأثيرات إضافية
        this.showEmojiReaction('🎓', 'مبروك على الإنجاز!');
    }

    // دالة الاحتفال عند الإجابة الصحيحة
    celebrateCorrectAnswer() {
        this.showEmojiReaction('✅', 'صحيح!');
        
        // تأثير بصري خفيف (أقل تكراراً)
        if (Math.random() < 0.1) { // 10% احتمال فقط
            this.triggerConfetti({ 
                particleCount: 20, 
                spread: 30,
                colors: ['#4ECDC4', '#45B7D1']
            });
        }
    }

    // دالة التشجيع عند الإجابة الخاطئة
    encourageOnWrongAnswer() {
        const encouragements = [
            '💪 لا تستسلم!',
            '🤔 فكر مرة أخرى!',
            '📚 تعلم من الخطأ!',
            '🌟 أنت تستطيع!',
            '🎯 حاول مرة أخرى!'
        ];
        
        const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
        this.showEmojiReaction(randomEncouragement.split(' ')[0], randomEncouragement);
    }

    // دالة تشغيل الصوت الاحتفالي
    playCelebrationSound() {
        if (window.soundManager) {
            // تشغيل صوت احتفالي
            window.soundManager.playSound('success');
            
            // تشغيل نغمة إضافية
            setTimeout(() => {
                window.soundManager.playSound('cheer');
            }, 500);
        }
    }

    // دالة الاحتفال الاحتياطي (بدون مكتبة الكونفيتي)
    showFallbackCelebration(emoji) {
        // إنشاء تأثير بصري بديل
        const container = document.createElement('div');
        container.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 9999;
        `;
        
        // إنشاء عدة عناصر طافية
        for (let i = 0; i < 20; i++) {
            const element = document.createElement('div');
            element.textContent = emoji;
            element.style.cssText = `
                position: absolute;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                font-size: ${20 + Math.random() * 20}px;
                animation: fallbackFloat 3s ease-out forwards;
                animation-delay: ${Math.random() * 2}s;
            `;
            container.appendChild(element);
        }
        
        document.body.appendChild(container);
        
        // إضافة keyframes للأنيميشن
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fallbackFloat {
                0% {
                    transform: translateY(-100px) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
        
        // إزالة بعد 5 ثوان
        setTimeout(() => {
            if (container.parentNode) {
                container.parentNode.removeChild(container);
            }
            if (style.parentNode) {
                style.parentNode.removeChild(style);
            }
        }, 5000);
    }
}

// إنشاء مدير الاحتفالات
const celebrationManager = new CelebrationManager();

// تصدير للاستخدام العام
window.celebrationManager = celebrationManager;

// دوال مختصرة للاستخدام السهل
window.triggerConfetti = (options) => celebrationManager.triggerConfetti(options);
window.triggerFireworks = () => celebrationManager.triggerFireworks();
window.triggerStarsRain = () => celebrationManager.triggerStarsRain();
window.showEmojiReaction = (emoji, message) => celebrationManager.showEmojiReaction(emoji, message);
window.celebrateAchievement = (score, total) => celebrationManager.celebrateAchievement(score, total);
window.celebrateLessonCompletion = (title) => celebrationManager.celebrateLessonCompletion(title);
window.celebrateCorrectAnswer = () => celebrationManager.celebrateCorrectAnswer();
window.encourageOnWrongAnswer = () => celebrationManager.encourageOnWrongAnswer();

console.log('🎉 Celebration System loaded successfully!');
