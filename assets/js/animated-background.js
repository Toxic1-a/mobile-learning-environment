/**
 * Animated Background System for Kids Learning Platform
 * نظام الخلفية المتحركة للمنصة التعليمية للأطفال
 * تأثيرات بصرية مذهلة ومتدرجة
 */

class AnimatedBackgroundManager {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.animationId = null;
        this.particles = [];
        this.gradients = [];
        this.isActive = false;
        this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        this.init();
    }

    init() {
        if (this.isReducedMotion) {
            return; // إيقاف النظام إذا كان المستخدم يفضل تقليل الحركة
        }

        this.createCanvas();
        this.setupGradients();
        this.setupEventListeners();
        this.startAnimation();
    }

    createCanvas() {
        // إنشاء canvas للخلفية المتحركة
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'animated-background';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.1;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
        `;
        
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        // تحديد حجم canvas
        this.resizeCanvas();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupGradients() {
        // إنشاء تدرجات لونية تتماشى مع ألوان الموقع
        this.gradients = [
            {
                name: 'primary',
                colors: ['#f8fafc', '#e2e8f0', '#cbd5e1'],
                positions: [0, 0.5, 1]
            },
            {
                name: 'secondary',
                colors: ['#f1f5f9', '#e2e8f0'],
                positions: [0, 1]
            },
            {
                name: 'accent',
                colors: ['#f8fafc', '#f1f5f9', '#e2e8f0'],
                positions: [0, 0.3, 1]
            },
            {
                name: 'soft',
                colors: ['#ffffff', '#f8fafc'],
                positions: [0, 1]
            }
        ];
    }

    setupEventListeners() {
        // إعادة تحديد حجم canvas عند تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });

        // مراقبة تغيير تفضيلات الحركة
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        motionQuery.addListener((e) => {
            this.isReducedMotion = e.matches;
            if (e.matches) {
                this.stop();
            } else {
                this.start();
            }
        });

        // إيقاف الأنيميشن عند عدم التركيز
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pause();
            } else {
                this.resume();
            }
        });
    }

    startAnimation() {
        if (this.isActive) return;
        
        this.isActive = true;
        this.createParticles();
        this.animate();
    }

    createParticles() {
        this.particles = [];
        const particleCount = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: this.getRandomColor(),
                life: Math.random() * 100 + 50,
                maxLife: Math.random() * 100 + 50
            });
        }
    }

    getRandomColor() {
        const colors = [
            '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#ec4899',
            '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4',
            '#8b5cf6', '#f59e0b', '#10b981', '#f43f5e', '#6366f1'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animate() {
        if (!this.isActive) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // رسم الخلفية المتدرجة
        this.drawGradientBackground();
        
        // رسم الجسيمات
        this.drawParticles();
        
        // رسم الأشكال الهندسية المتحركة
        this.drawGeometricShapes();
        
        // رسم الموجات
        this.drawWaves();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawGradientBackground() {
        const time = Date.now() * 0.0005;
        const gradient = this.ctx.createLinearGradient(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        // اختيار تدرج عشوائي
        const currentGradient = this.gradients[Math.floor(time) % this.gradients.length];
        
        currentGradient.colors.forEach((color, index) => {
            gradient.addColorStop(currentGradient.positions[index], color);
        });
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // إضافة تأثير ضبابي
        this.ctx.fillStyle = `rgba(255, 255, 255, 0.1)`;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawParticles() {
        this.particles.forEach((particle, index) => {
            // تحديث موضع الجسيم
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life--;
            
            // إعادة إنشاء الجسيم عند انتهاء حياته
            if (particle.life <= 0) {
                particle.x = Math.random() * this.canvas.width;
                particle.y = Math.random() * this.canvas.height;
                particle.vx = (Math.random() - 0.5) * 0.5;
                particle.vy = (Math.random() - 0.5) * 0.5;
                particle.life = particle.maxLife;
                particle.color = this.getRandomColor();
            }
            
            // التأكد من بقاء الجسيم داخل الشاشة
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // رسم الجسيم
            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity * (particle.life / particle.maxLife);
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // إضافة تأثير مضيء
            this.ctx.shadowBlur = 10;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    drawGeometricShapes() {
        const time = Date.now() * 0.001;
        
        // رسم دوائر متحركة
        for (let i = 0; i < 5; i++) {
            const x = this.canvas.width / 2 + Math.cos(time + i) * 100;
            const y = this.canvas.height / 2 + Math.sin(time + i) * 100;
            const radius = 20 + Math.sin(time * 2 + i) * 10;
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.1;
            this.ctx.fillStyle = this.getRandomColor();
            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.restore();
        }
        
        // رسم مثلثات متحركة
        for (let i = 0; i < 3; i++) {
            const centerX = this.canvas.width / 3 + (i * this.canvas.width / 3);
            const centerY = this.canvas.height / 2 + Math.sin(time + i * 2) * 50;
            const size = 15 + Math.cos(time * 1.5 + i) * 5;
            
            this.ctx.save();
            this.ctx.globalAlpha = 0.08;
            this.ctx.fillStyle = this.getRandomColor();
            this.ctx.translate(centerX, centerY);
            this.ctx.rotate(time + i);
            this.ctx.beginPath();
            this.ctx.moveTo(0, -size);
            this.ctx.lineTo(-size * 0.866, size * 0.5);
            this.ctx.lineTo(size * 0.866, size * 0.5);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawWaves() {
        const time = Date.now() * 0.002;
        
        // رسم موجات في الأسفل
        this.ctx.save();
        this.ctx.globalAlpha = 0.15;
        this.ctx.strokeStyle = '#4ECDC4';
        this.ctx.lineWidth = 2;
        
        this.ctx.beginPath();
        for (let x = 0; x <= this.canvas.width; x += 2) {
            const y = this.canvas.height * 0.8 + Math.sin(x * 0.01 + time) * 20;
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
        
        // رسم موجات في الأعلى
        this.ctx.strokeStyle = '#FF6B6B';
        this.ctx.beginPath();
        for (let x = 0; x <= this.canvas.width; x += 2) {
            const y = this.canvas.height * 0.2 + Math.cos(x * 0.008 + time * 1.2) * 15;
            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    // دوال التحكم
    start() {
        if (!this.isReducedMotion) {
            this.startAnimation();
        }
    }

    stop() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }

    pause() {
        this.isActive = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    resume() {
        if (!this.isReducedMotion) {
            this.isActive = true;
            this.animate();
        }
    }

    setOpacity(opacity) {
        if (this.canvas) {
            this.canvas.style.opacity = Math.max(0, Math.min(1, opacity));
        }
    }

    setIntensity(intensity) {
        // تغيير كثافة الأنيميشن
        const particleCount = Math.floor(intensity * 50);
        if (this.particles.length !== particleCount) {
            this.createParticles();
        }
    }

    // تنظيف الموارد
    destroy() {
        this.stop();
        this.particles = [];
        this.gradients = [];
    }
}

// إنشاء مدير الخلفية المتحركة
const animatedBackgroundManager = new AnimatedBackgroundManager();

// تصدير للاستخدام العام
window.animatedBackgroundManager = animatedBackgroundManager;

// دوال مختصرة للاستخدام السهل
window.startAnimatedBackground = () => animatedBackgroundManager.start();
window.stopAnimatedBackground = () => animatedBackgroundManager.stop();
window.pauseAnimatedBackground = () => animatedBackgroundManager.pause();
window.resumeAnimatedBackground = () => animatedBackgroundManager.resume();
window.setBackgroundOpacity = (opacity) => animatedBackgroundManager.setOpacity(opacity);
window.setBackgroundIntensity = (intensity) => animatedBackgroundManager.setIntensity(intensity);

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    // التأكد من أن النظام يعمل في جميع الصفحات
    console.log('🎨 Animated Background System initialized');
});

console.log('🎨 Animated Background System loaded successfully!');
