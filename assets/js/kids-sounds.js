/* Kids Interactive Sounds */

class KidsSoundManager {
    constructor() {
        this.sounds = {};
        this.isMuted = false;
        this.audioContext = null;
        this.init();
    }

    init() {
        // إنشاء سياق الصوت
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }

        // إنشاء الأصوات باستخدام Web Audio API
        this.createSounds();
        
        // إنشاء زر كتم/إلغاء كتم الصوت
        this.createMuteButton();
        
        // تحميل حالة الكتم من localStorage
        this.loadMuteState();
    }

    createSounds() {
        // صوت النقر
        this.sounds.click = () => this.playTone(800, 0.1, 'sine');
        
        // صوت النجاح
        this.sounds.success = () => this.playMelody([523, 659, 784], 0.3);
        
        // صوت الخطأ
        this.sounds.error = () => this.playTone(200, 0.5, 'sawtooth');
        
        // صوت التمرير
        this.sounds.scroll = () => this.playTone(400, 0.05, 'triangle');
        
        // صوت الافتتاح
        this.sounds.open = () => this.playMelody([523, 659, 784, 1047], 0.4);
        
        // صوت الإغلاق
        this.sounds.close = () => this.playMelody([1047, 784, 659, 523], 0.4);
        
        // صوت التشجيع
        this.sounds.cheer = () => this.playMelody([523, 659, 784, 1047, 784, 1047], 0.6);
        
        // صوت النقر على البطاقة
        this.sounds.cardClick = () => this.playTone(600, 0.15, 'sine');
        
        // صوت التنقل
        this.sounds.navigate = () => this.playTone(500, 0.1, 'square');
    }

    playTone(frequency, duration, type = 'sine') {
        if (this.isMuted || !this.audioContext) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();

            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);

            oscillator.frequency.value = frequency;
            oscillator.type = type;

            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.log('Error playing sound:', e);
        }
    }

    playMelody(frequencies, duration) {
        if (this.isMuted || !this.audioContext) return;

        const noteDuration = duration / frequencies.length;
        
        frequencies.forEach((frequency, index) => {
            setTimeout(() => {
                this.playTone(frequency, noteDuration * 0.8);
            }, index * noteDuration * 1000);
        });
    }

    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateMuteButton();
        this.saveMuteState();
        
        if (!this.isMuted) {
            this.playSound('click');
        }
    }

    createMuteButton() {
        const muteButton = document.createElement('button');
        muteButton.id = 'muteButton';
        muteButton.innerHTML = '🔊';
        muteButton.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: var(--gradient-primary);
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: var(--shadow-soft);
            transition: var(--transition-bounce);
            z-index: 9999;
        `;

        muteButton.addEventListener('click', () => {
            muteButton.style.transform = 'scale(0.9)';
            setTimeout(() => {
                muteButton.style.transform = 'scale(1)';
            }, 150);
            this.toggleMute();
        });

        muteButton.addEventListener('mouseenter', () => {
            muteButton.style.transform = 'scale(1.1)';
        });

        muteButton.addEventListener('mouseleave', () => {
            muteButton.style.transform = 'scale(1)';
        });

        document.body.appendChild(muteButton);
    }

    updateMuteButton() {
        const muteButton = document.getElementById('muteButton');
        if (muteButton) {
            muteButton.innerHTML = this.isMuted ? '🔇' : '🔊';
            muteButton.style.background = this.isMuted ? 
                'var(--gradient-tertiary)' : 'var(--gradient-primary)';
        }
    }

    saveMuteState() {
        localStorage.setItem('kidsSoundMuted', this.isMuted);
    }

    loadMuteState() {
        const savedState = localStorage.getItem('kidsSoundMuted');
        if (savedState !== null) {
            this.isMuted = JSON.parse(savedState);
            this.updateMuteButton();
        }
    }
}

// إنشاء مدير الأصوات
const soundManager = new KidsSoundManager();

    // إضافة الأصوات للعناصر التفاعلية
document.addEventListener('DOMContentLoaded', function() {
    // الأزرار
    document.querySelectorAll('button, .btn, a[href]').forEach(element => {
        element.addEventListener('click', () => {
            soundManager.playSound('click');
        });
    });

    // المعلم التشجيعي
    const footerTeacher = document.querySelector('.footer-teacher');
    if (footerTeacher) {
        footerTeacher.addEventListener('click', () => {
            soundManager.playSound('cheer');
            // إضافة تأثير بصري
            footerTeacher.style.transform = 'scale(1.2)';
            setTimeout(() => {
                footerTeacher.style.transform = 'scale(1)';
            }, 200);
        });
    }

    // البطاقات
    document.querySelectorAll('.card, .card-kids').forEach(element => {
        element.addEventListener('click', () => {
            soundManager.playSound('cardClick');
        });
    });

    // الروابط
    document.querySelectorAll('a').forEach(element => {
        element.addEventListener('click', () => {
            soundManager.playSound('navigate');
        });
    });

    // التمرير
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            soundManager.playSound('scroll');
        }, 100);
    });

    // عند فتح الصفحة
    soundManager.playSound('open');

    // إضافة صوت التشجيع عند النجاح في الاختبارات
    const quizButtons = document.querySelectorAll('.quiz-option, .test-option');
    quizButtons.forEach(button => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                soundManager.playSound('cheer');
            }, 500);
        });
    });
});

// تصدير مدير الأصوات للاستخدام العام
window.soundManager = soundManager;
