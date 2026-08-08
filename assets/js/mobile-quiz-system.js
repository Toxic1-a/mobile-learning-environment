/**
 * نظام الأسئلة المحسن للموبايل
 * Mobile-Optimized Quiz System
 * يحل مشاكل الأسئلة التي تختفي على الموبايل
 */

class MobileQuizSystem {
    constructor() {
        this.currentQuiz = null;
        this.userAnswers = new Map();
        this.isMobile = this.detectMobile();
        this.touchStartY = 0;
        this.touchStartX = 0;
        
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
               window.innerWidth <= 768;
    }

    init() {
        this.setupMobileStyles();
        this.setupEventListeners();
        this.initializeQuizzes();
        this.setupTouchHandlers();
    }

    setupMobileStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Mobile Quiz Optimizations */
            .mobile-quiz-container {
                position: relative;
                overflow: hidden;
                -webkit-overflow-scrolling: touch;
            }

            .mobile-question-card {
                position: relative;
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-bottom: 16px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
            }

            .mobile-question-card:active {
                transform: scale(0.98);
                border-color: var(--primary, #3b82f6);
            }

            .mobile-question-card.selected {
                border-color: var(--success, #10b981);
                background: rgba(16, 185, 129, 0.05);
                box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
            }

            .mobile-question-card.correct {
                border-color: var(--success, #10b981);
                background: rgba(16, 185, 129, 0.1);
                animation: mobileCorrect 0.6s ease-out;
            }

            .mobile-question-card.incorrect {
                border-color: var(--danger, #ef4444);
                background: rgba(239, 68, 68, 0.1);
                animation: mobileIncorrect 0.6s ease-out;
            }

            @keyframes mobileCorrect {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }

            @keyframes mobileIncorrect {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            .mobile-radio-option {
                display: flex;
                align-items: center;
                padding: 12px 16px;
                margin: 8px 0;
                background: #f8fafc;
                border: 2px solid #e2e8f0;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.2s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                min-height: 48px; /* Minimum touch target size */
            }

            .mobile-radio-option:hover,
            .mobile-radio-option:active {
                background: #f1f5f9;
                border-color: var(--primary, #3b82f6);
            }

            .mobile-radio-option.selected {
                background: rgba(59, 130, 246, 0.1);
                border-color: var(--primary, #3b82f6);
                box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
            }

            .mobile-radio-option.correct {
                background: rgba(16, 185, 129, 0.1);
                border-color: var(--success, #10b981);
            }

            .mobile-radio-option.incorrect {
                background: rgba(239, 68, 68, 0.1);
                border-color: var(--danger, #ef4444);
            }

            .mobile-radio-input {
                margin-left: 12px;
                transform: scale(1.2);
                accent-color: var(--primary, #3b82f6);
            }

            .mobile-radio-label {
                flex: 1;
                font-weight: 500;
                color: #374151;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
            }

            .mobile-progress-container {
                position: sticky;
                top: 0;
                background: white;
                padding: 16px;
                border-bottom: 1px solid #e5e7eb;
                z-index: 10;
            }

            .mobile-progress-bar {
                width: 100%;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
            }

            .mobile-progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                border-radius: 4px;
                transition: width 0.6s ease;
                position: relative;
            }

            .mobile-progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: mobileProgressShine 2s infinite;
            }

            @keyframes mobileProgressShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            .mobile-submit-button {
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: var(--primary, #3b82f6);
                color: white;
                border: none;
                border-radius: 12px;
                padding: 16px 24px;
                font-size: 16px;
                font-weight: 600;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                transition: all 0.3s ease;
                touch-action: manipulation;
                -webkit-tap-highlight-color: transparent;
                z-index: 100;
            }

            .mobile-submit-button:active {
                transform: scale(0.98);
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
            }

            .mobile-submit-button:disabled {
                background: #9ca3af;
                box-shadow: none;
                transform: none;
            }

            .mobile-results {
                padding: 20px;
                text-align: center;
                background: white;
                border-radius: 12px;
                margin: 20px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .mobile-score {
                font-size: 3rem;
                font-weight: bold;
                background: linear-gradient(45deg, #3b82f6, #1d4ed8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                margin: 20px 0;
            }

            .mobile-question-text {
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
                margin-bottom: 16px;
                line-height: 1.5;
            }

            /* Hide scrollbars on mobile */
            .mobile-quiz-container::-webkit-scrollbar {
                display: none;
            }

            .mobile-quiz-container {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }

            /* Prevent zoom on input focus */
            @media screen and (max-width: 768px) {
                input[type="radio"], input[type="checkbox"] {
                    font-size: 16px;
                }
            }

            /* Touch-friendly spacing */
            @media (max-width: 768px) {
                .mobile-question-card {
                    margin-bottom: 20px;
                }
                
                .mobile-radio-option {
                    margin: 12px 0;
                    padding: 16px;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // منع الـ default behavior للـ touch events
        document.addEventListener('touchstart', (e) => {
            this.touchStartY = e.touches[0].clientY;
            this.touchStartX = e.touches[0].clientX;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const touchEndY = e.changedTouches[0].clientY;
            const touchEndX = e.changedTouches[0].clientX;
            const deltaY = Math.abs(touchEndY - this.touchStartY);
            const deltaX = Math.abs(touchEndX - this.touchStartX);
            
            // منع الـ scroll إذا كان هناك swipe أفقي
            if (deltaX > deltaY && deltaX > 50) {
                e.preventDefault();
            }
        }, { passive: false });

        // مراقبة تغيير حجم النافذة
        window.addEventListener('resize', () => {
            this.isMobile = this.detectMobile();
            this.updateMobileLayout();
        });

        // منع الـ zoom على الـ double tap
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    setupTouchHandlers() {
        // تحسين الـ touch events للأسئلة
        document.addEventListener('touchstart', (e) => {
            const questionCard = e.target.closest('.mobile-question-card');
            if (questionCard) {
                questionCard.style.transform = 'scale(0.98)';
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            const questionCard = e.target.closest('.mobile-question-card');
            if (questionCard) {
                questionCard.style.transform = '';
            }
        }, { passive: true });
    }

    initializeQuizzes() {
        const quizzes = document.querySelectorAll('form[id*="test"], form[id*="quiz"], form[id*="pretest"]');
        
        quizzes.forEach(quiz => {
            this.enhanceQuizForMobile(quiz);
        });
    }

    enhanceQuizForMobile(quizForm) {
        if (!this.isMobile) return;

        // إضافة كلاس الموبايل
        quizForm.classList.add('mobile-quiz-container');
        
        // تحسين الأسئلة
        const questionCards = quizForm.querySelectorAll('.question-card, .card');
        questionCards.forEach(card => {
            this.enhanceQuestionCardForMobile(card);
        });

        // إضافة شريط التقدم
        this.addMobileProgressBar(quizForm);

        // تحسين أزرار الإرسال
        this.enhanceSubmitButtonForMobile(quizForm);
    }

    enhanceQuestionCardForMobile(card) {
        card.classList.add('mobile-question-card');
        
        // تحسين خيارات الراديو
        const radioInputs = card.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            this.enhanceRadioOptionForMobile(input);
        });

        // إضافة event listeners
        card.addEventListener('click', (e) => {
            this.handleMobileQuestionClick(card, e);
        });
    }

    enhanceRadioOptionForMobile(input) {
        const label = input.closest('label') || input.nextElementSibling;
        if (label) {
            const option = label.closest('.form-check') || label.parentElement;
            option.classList.add('mobile-radio-option');
            
            const labelText = option.querySelector('label');
            if (labelText) {
                labelText.classList.add('mobile-radio-label');
            }
            
            input.classList.add('mobile-radio-input');
            
            // إضافة event listener للخيار
            option.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMobileRadioSelection(input, option);
            });
        }
    }

    handleMobileQuestionClick(card, event) {
        // منع الـ default behavior
        event.preventDefault();
        
        // إزالة التحديد من الأسئلة الأخرى
        const parent = card.closest('form');
        if (parent) {
            const otherCards = parent.querySelectorAll('.mobile-question-card.selected');
            otherCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.classList.remove('selected');
                }
            });
        }
        
        // إضافة التحديد للبطاقة الحالية
        card.classList.add('selected');
        
        // تأثير بصري
        card.style.transform = 'scale(0.98)';
        setTimeout(() => {
            card.style.transform = '';
        }, 150);
    }

    handleMobileRadioSelection(input, option) {
        // إزالة التحديد من الخيارات الأخرى في نفس السؤال
        const questionCard = input.closest('.mobile-question-card');
        const otherOptions = questionCard.querySelectorAll('.mobile-radio-option');
        otherOptions.forEach(opt => {
            if (opt !== option) {
                opt.classList.remove('selected');
                const otherInput = opt.querySelector('input[type="radio"]');
                if (otherInput) {
                    otherInput.checked = false;
                }
            }
        });
        
        // تحديد الخيار الحالي
        option.classList.add('selected');
        input.checked = true;
        
        // حفظ الإجابة
        const questionName = input.name;
        this.userAnswers.set(questionName, input.value);
        
        // تحديث التقدم
        const quizForm = input.closest('form');
        this.updateMobileProgress(quizForm);
        
        // تأثير بصري
        option.style.transform = 'scale(0.98)';
        setTimeout(() => {
            option.style.transform = '';
        }, 150);
    }

    addMobileProgressBar(quizForm) {
        // البحث عن شريط تقدم موجود
        let progressContainer = quizForm.querySelector('.mobile-progress-container');
        
        if (!progressContainer) {
            progressContainer = document.createElement('div');
            progressContainer.className = 'mobile-progress-container';
            progressContainer.innerHTML = `
                <div class="mobile-progress-bar">
                    <div class="mobile-progress-fill" style="width: 0%"></div>
                </div>
                <div class="text-center mt-2">
                    <span class="progress-current">0</span> من <span class="progress-total">0</span> أسئلة
                </div>
            `;
            
            // إدراج في بداية النموذج
            quizForm.insertBefore(progressContainer, quizForm.firstChild);
        }
        
        this.updateMobileProgress(quizForm);
    }

    updateMobileProgress(quizForm) {
        const totalQuestions = new Set([...quizForm.querySelectorAll('input[type="radio"]')].map(input => input.name)).size;
        const answeredQuestions = new Set([...this.userAnswers.keys()]).size;
        
        const progressFill = quizForm.querySelector('.mobile-progress-fill');
        const progressCurrent = quizForm.querySelector('.progress-current');
        const progressTotal = quizForm.querySelector('.progress-total');
        
        if (progressFill) {
            const percentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
            progressFill.style.width = `${percentage}%`;
        }
        
        if (progressCurrent) {
            progressCurrent.textContent = answeredQuestions;
        }
        
        if (progressTotal) {
            progressTotal.textContent = totalQuestions;
        }
    }

    enhanceSubmitButtonForMobile(quizForm) {
        const submitButtons = quizForm.querySelectorAll('button[type="submit"], .submit-quiz, .submit-pretest, .submit-selfeval');
        
        submitButtons.forEach(button => {
            // إخفاء الأزرار الأصلية
            button.style.display = 'none';
            
            // إنشاء زر موبايل جديد
            const mobileButton = document.createElement('button');
            mobileButton.className = 'mobile-submit-button';
            mobileButton.textContent = button.textContent || 'إرسال الإجابات';
            mobileButton.disabled = true;
            
            // إضافة الزر في نهاية النموذج
            quizForm.appendChild(mobileButton);
            
            // إضافة event listener
            mobileButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleMobileSubmit(quizForm, mobileButton);
            });
            
            // تحديث حالة الزر
            this.updateMobileSubmitButton(quizForm, mobileButton);
        });
    }

    updateMobileSubmitButton(quizForm, button) {
        const totalQuestions = new Set([...quizForm.querySelectorAll('input[type="radio"]')].map(input => input.name)).size;
        const answeredQuestions = new Set([...this.userAnswers.keys()]).size;
        
        button.disabled = answeredQuestions < totalQuestions;
        
        if (answeredQuestions === totalQuestions) {
            button.textContent = 'إرسال الإجابات ✓';
        } else {
            button.textContent = `إرسال الإجابات (${answeredQuestions}/${totalQuestions})`;
        }
    }

    async handleMobileSubmit(quizForm, button) {
        // التحقق من إكمال جميع الأسئلة
        if (!this.validateMobileQuizCompletion(quizForm)) {
            this.showMobileAlert('يرجى الإجابة على جميع الأسئلة', 'warning');
            return;
        }
        
        // بدء عملية التقييم
        this.startMobileQuizEvaluation(quizForm, button);
    }

    validateMobileQuizCompletion(quizForm) {
        const totalQuestions = new Set([...quizForm.querySelectorAll('input[type="radio"]')].map(input => input.name)).size;
        const answeredQuestions = new Set([...this.userAnswers.keys()]).size;
        
        return totalQuestions === answeredQuestions && totalQuestions > 0;
    }

    async startMobileQuizEvaluation(quizForm, button) {
        // إضافة حالة التحميل
        button.disabled = true;
        button.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>جاري التقييم...';
        
        // محاكاة تأخير التقييم
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // حساب النتيجة
        const result = this.calculateMobileQuizResult(quizForm);
        
        // عرض النتيجة
        this.showMobileQuizResult(quizForm, result);
    }

    calculateMobileQuizResult(quizForm) {
        // الحصول على الإجابات الصحيحة
        const correctAnswers = window.lessonCorrectAnswers || {};
        
        let correctCount = 0;
        let totalQuestions = 0;
        const results = new Map();
        
        // تحليل كل نوع من الأسئلة
        Object.keys(correctAnswers).forEach(questionType => {
            const answers = correctAnswers[questionType];
            
            Object.keys(answers).forEach(questionKey => {
                totalQuestions++;
                const userAnswer = this.userAnswers.get(questionType + '_' + questionKey);
                const correctAnswer = answers[questionKey];
                
                const isCorrect = userAnswer === String(correctAnswer);
                if (isCorrect) {
                    correctCount++;
                }
                
                results.set(questionType + '_' + questionKey, {
                    userAnswer,
                    correctAnswer,
                    isCorrect
                });
            });
        });
        
        const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
        
        return {
            correct: correctCount,
            total: totalQuestions,
            percentage: percentage,
            results: results
        };
    }

    showMobileQuizResult(quizForm, result) {
        // إنشاء عنصر النتيجة
        const resultContainer = document.createElement('div');
        resultContainer.className = 'mobile-results';
        resultContainer.innerHTML = `
            <div class="mobile-score">${result.percentage}%</div>
            <h3 class="mb-3">${this.getMobileResultMessage(result.percentage)}</h3>
            <p class="text-muted mb-4">
                ${result.correct} من ${result.total} أسئلة صحيحة
            </p>
            <div class="result-details">
                ${this.generateMobileResultDetails(result.results)}
            </div>
            <button class="btn btn-primary mt-3" onclick="location.reload()">
                إعادة المحاولة
            </button>
        `;
        
        // إدراج النتيجة في النموذج
        quizForm.appendChild(resultContainer);
        
        // إخفاء النموذج الأصلي
        const originalContent = quizForm.querySelector('.quiz-content, .card-body');
        if (originalContent) {
            originalContent.style.display = 'none';
        }
        
        // إخفاء زر الإرسال
        const submitButton = quizForm.querySelector('.mobile-submit-button');
        if (submitButton) {
            submitButton.style.display = 'none';
        }
        
        // تحديث حالة الأسئلة
        this.updateMobileQuestionStates(quizForm, result.results);
    }

    getMobileResultMessage(percentage) {
        if (percentage >= 90) return 'ممتاز! 🎉';
        if (percentage >= 70) return 'أحسنت! ⭐';
        if (percentage >= 50) return 'جيد! 👍';
        return 'حاول مرة أخرى! 💪';
    }

    generateMobileResultDetails(results) {
        let detailsHTML = '<div class="row">';
        
        results.forEach((result, questionKey) => {
            const statusClass = result.isCorrect ? 'text-success' : 'text-danger';
            const statusIcon = result.isCorrect ? '✅' : '❌';
            
            detailsHTML += `
                <div class="col-12 col-md-6 mb-2">
                    <div class="d-flex align-items-center">
                        <span class="me-2">${statusIcon}</span>
                        <span class="${statusClass}">
                            السؤال ${questionKey.split('_').pop()}
                        </span>
                    </div>
                </div>
            `;
        });
        
        detailsHTML += '</div>';
        return detailsHTML;
    }

    updateMobileQuestionStates(quizForm, results) {
        results.forEach((result, questionKey) => {
            const questionCard = quizForm.querySelector(`[data-question="${questionKey}"]`);
            if (questionCard) {
                if (result.isCorrect) {
                    questionCard.classList.add('correct');
                } else {
                    questionCard.classList.add('incorrect');
                }
            }
        });
    }

    showMobileAlert(message, type = 'info') {
        const alertClass = {
            'warning': 'alert-warning',
            'error': 'alert-danger',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        alert.style.cssText = 'top: 20px; left: 20px; right: 20px; z-index: 9999;';
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alert);
        
        // إزالة تلقائية بعد 5 ثوان
        setTimeout(() => {
            if (alert.parentNode) {
                alert.remove();
            }
        }, 5000);
    }

    updateMobileLayout() {
        const quizzes = document.querySelectorAll('.mobile-quiz-container');
        quizzes.forEach(quiz => {
            if (this.isMobile) {
                quiz.classList.add('mobile-quiz-container');
            } else {
                quiz.classList.remove('mobile-quiz-container');
            }
        });
    }

    // دوال عامة للتحكم
    resetMobileQuiz(quizForm) {
        // إعادة تعيين النموذج
        quizForm.reset();
        
        // إعادة تعيين المتغيرات
        this.userAnswers.clear();
        
        // إزالة النتائج
        const resultContainer = quizForm.querySelector('.mobile-results');
        if (resultContainer) {
            resultContainer.remove();
        }
        
        // إظهار المحتوى الأصلي
        const originalContent = quizForm.querySelector('.quiz-content, .card-body');
        if (originalContent) {
            originalContent.style.display = '';
        }
        
        // إظهار زر الإرسال
        const submitButton = quizForm.querySelector('.mobile-submit-button');
        if (submitButton) {
            submitButton.style.display = 'block';
        }
        
        // إعادة تعيين حالة الأسئلة
        const questionCards = quizForm.querySelectorAll('.mobile-question-card');
        questionCards.forEach(card => {
            card.classList.remove('selected', 'correct', 'incorrect');
        });
        
        const radioOptions = quizForm.querySelectorAll('.mobile-radio-option');
        radioOptions.forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // تحديث شريط التقدم
        this.updateMobileProgress(quizForm);
    }
}

// إنشاء نظام الأسئلة للموبايل
const mobileQuizSystem = new MobileQuizSystem();

// تصدير للاستخدام العام
window.mobileQuizSystem = mobileQuizSystem;

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('📱 Mobile Quiz System initialized');
});

console.log('📱 Mobile Quiz System loaded successfully!');
