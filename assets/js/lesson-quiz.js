/**
 * Enhanced Lesson Quiz System with Animations
 * نظام الاختبارات المحسن مع الأنيميشن
 * تفاعلات مذهلة للأسئلة والنتائج
 */

class LessonQuizManager {
    constructor() {
        this.currentQuiz = null;
        this.userAnswers = new Map();
        this.quizResults = new Map();
        this.animationQueue = [];
        this.isAnimating = false;
        
        this.init();
    }

    init() {
        // إعداد الأنماط CSS
        this.setupQuizStyles();
        
        // إعداد event listeners
        this.setupEventListeners();
        
        // تهيئة الاختبارات الموجودة
        this.initializeQuizzes();
        
        // مراقبة الاختبارات الجديدة
        this.setupMutationObserver();
    }

    setupQuizStyles() {
        const styles = document.createElement('style');
        styles.textContent = `
            /* Quiz Container Styles */
            .quiz-container-enhanced {
                position: relative;
                overflow: hidden;
            }

            /* Question Card Enhanced Styles */
            .question-card-quiz {
                transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                border: 2px solid transparent;
                cursor: pointer;
                position: relative;
                overflow: hidden;
                transform: translateZ(0);
            }

            .question-card-quiz::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.1), transparent);
                transition: left 0.5s ease;
            }

            .question-card-quiz:hover::before {
                left: 100%;
            }

            .question-card-quiz:hover {
                border-color: var(--primary);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.15);
                transform: translateY(-4px) scale(1.02);
            }

            .question-card-quiz.selected {
                border-color: var(--success);
                background: rgba(34, 197, 94, 0.05);
                animation: questionSelect 0.6s ease-out;
            }

            .question-card-quiz.correct {
                border-color: var(--success);
                background: rgba(34, 197, 94, 0.1);
                animation: questionCorrect 0.8s ease-out;
            }

            .question-card-quiz.incorrect {
                border-color: var(--danger);
                background: rgba(239, 68, 68, 0.1);
                animation: questionIncorrect 0.6s ease-out;
            }

            @keyframes questionSelect {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes questionCorrect {
                0% { 
                    transform: scale(1);
                    border-color: var(--success);
                }
                25% { 
                    transform: scale(1.1);
                    border-color: #10b981;
                }
                50% { 
                    transform: scale(1.05);
                    border-color: var(--success);
                }
                100% { 
                    transform: scale(1);
                    border-color: var(--success);
                }
            }

            @keyframes questionIncorrect {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }

            /* Radio Button Enhanced Styles */
            .radio-enhanced {
                position: relative;
                cursor: pointer;
            }

            .radio-enhanced input[type="radio"] {
                position: absolute;
                opacity: 0;
                cursor: pointer;
            }

            .radio-enhanced .radio-custom {
                position: relative;
                display: inline-block;
                width: 20px;
                height: 20px;
                border: 2px solid #ddd;
                border-radius: 50%;
                background: white;
                transition: all 0.3s ease;
                margin-left: 8px;
            }

            .radio-enhanced:hover .radio-custom {
                border-color: var(--primary);
                transform: scale(1.1);
            }

            .radio-enhanced input[type="radio"]:checked + .radio-custom {
                border-color: var(--success);
                background: var(--success);
            }

            .radio-enhanced input[type="radio"]:checked + .radio-custom::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: white;
                transform: translate(-50%, -50%) scale(0);
                animation: radioCheck 0.3s ease-out forwards;
            }

            @keyframes radioCheck {
                0% { transform: translate(-50%, -50%) scale(0); }
                50% { transform: translate(-50%, -50%) scale(1.3); }
                100% { transform: translate(-50%, -50%) scale(1); }
            }

            /* Progress Bar Enhanced */
            .progress-enhanced {
                position: relative;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
                margin: 20px 0;
            }

            .progress-bar-enhanced {
                height: 100%;
                background: linear-gradient(90deg, #3b82f6, #1d4ed8);
                border-radius: 4px;
                transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                position: relative;
                overflow: hidden;
            }

            .progress-bar-enhanced::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
                animation: progressShine 2s infinite;
            }

            @keyframes progressShine {
                0% { left: -100%; }
                100% { left: 100%; }
            }

            /* Results Animation */
            .quiz-results {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s ease-out;
            }

            .quiz-results.show {
                opacity: 1;
                transform: translateY(0);
            }

            .score-display {
                font-size: 3rem;
                font-weight: bold;
                text-align: center;
                margin: 20px 0;
                background: linear-gradient(45deg, #3b82f6, #1d4ed8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: scoreCountUp 2s ease-out;
            }

            @keyframes scoreCountUp {
                0% { transform: scale(0.5); opacity: 0; }
                50% { transform: scale(1.2); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
            }

            /* Submit Button Enhanced */
            .submit-button-enhanced {
                position: relative;
                overflow: hidden;
                transition: all 0.3s ease;
            }

            .submit-button-enhanced::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.6s, height 0.6s;
            }

            .submit-button-enhanced:active::before {
                width: 300px;
                height: 300px;
            }

            .submit-button-enhanced:hover {
                transform: translateY(-2px) scale(1.05);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
            }

            /* Loading State */
            .quiz-loading {
                position: relative;
                pointer-events: none;
            }

            .quiz-loading::after {
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

            /* Celebration Overlay */
            .celebration-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }

            /* Mobile Optimizations */
            @media (max-width: 768px) {
                .question-card-quiz:hover {
                    transform: none;
                }
                
                .question-card-quiz:active {
                    transform: scale(0.98);
                }
                
                .score-display {
                    font-size: 2rem;
                }
            }

            /* Reduced Motion Support */
            @media (prefers-reduced-motion: reduce) {
                .question-card-quiz,
                .radio-enhanced,
                .progress-bar-enhanced,
                .submit-button-enhanced {
                    transition: none;
                    animation: none;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // مراقبة النقر على الأسئلة
        document.addEventListener('click', (e) => {
            this.handleQuestionClick(e);
        });

        // مراقبة النقر على أزرار الإرسال
        document.addEventListener('click', (e) => {
            if (e.target.matches('.submit-quiz, .submit-pretest, .submit-selfeval')) {
                e.preventDefault();
                this.handleQuizSubmit(e.target);
            }
        });
    }

    initializeQuizzes() {
        // تهيئة جميع الاختبارات الموجودة
        const quizzes = document.querySelectorAll('form[id*="test"], form[id*="quiz"], form[id*="pretest"]');
        
        quizzes.forEach(quiz => {
            this.enhanceQuiz(quiz);
        });
    }

    enhanceQuiz(quizForm) {
        // إضافة كلاس التحسين
        quizForm.classList.add('quiz-container-enhanced');
        
        // تحسين أسئلة الاختيار من متعدد
        const radioInputs = quizForm.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            this.enhanceRadioButton(input);
        });
        
        // تحسين بطاقات الأسئلة
        const questionCards = quizForm.querySelectorAll('.question-card, .card');
        questionCards.forEach(card => {
            this.enhanceQuestionCard(card);
        });
        
        // إضافة شريط التقدم
        this.addProgressBar(quizForm);
        
        // تحسين أزرار الإرسال
        const submitButtons = quizForm.querySelectorAll('button[type="submit"], .submit-quiz, .submit-pretest, .submit-selfeval');
        submitButtons.forEach(button => {
            this.enhanceSubmitButton(button);
        });
    }

    enhanceRadioButton(input) {
        const label = input.closest('label') || input.nextElementSibling;
        if (label) {
            label.classList.add('radio-enhanced');
            
            // إضافة عنصر مخصص للراديو
            if (!label.querySelector('.radio-custom')) {
                const customRadio = document.createElement('span');
                customRadio.className = 'radio-custom';
                label.insertBefore(customRadio, label.firstChild);
            }
        }
    }

    enhanceQuestionCard(card) {
        card.classList.add('question-card-quiz');
        
        // إضافة تأثيرات التفاعل
        card.addEventListener('click', (e) => {
            if (e.target.matches('input[type="radio"]')) {
                this.handleRadioSelection(card, e.target);
            }
        });
    }

    enhanceSubmitButton(button) {
        button.classList.add('submit-button-enhanced');
        
        // إضافة تأثير loading
        const originalText = button.textContent;
        button.dataset.originalText = originalText;
    }

    addProgressBar(quizForm) {
        // البحث عن شريط تقدم موجود
        let progressContainer = quizForm.querySelector('.progress, .progress-container');
        
        if (!progressContainer) {
            // إنشاء شريط تقدم جديد
            progressContainer = document.createElement('div');
            progressContainer.className = 'progress-container';
            progressContainer.innerHTML = `
                <div class="progress-enhanced">
                    <div class="progress-bar-enhanced" style="width: 0%"></div>
                </div>
                <div class="progress-text text-center mt-2">
                    <span class="progress-current">0</span> من <span class="progress-total">0</span> أسئلة
                </div>
            `;
            
            // إدراج قبل أزرار الإرسال
            const submitButtons = quizForm.querySelectorAll('button[type="submit"], .submit-quiz, .submit-pretest, .submit-selfeval');
            if (submitButtons.length > 0) {
                submitButtons[0].parentNode.insertBefore(progressContainer, submitButtons[0]);
            }
        }
        
        // تحديث شريط التقدم
        this.updateProgress(quizForm);
    }

    handleQuestionClick(e) {
        const questionCard = e.target.closest('.question-card-quiz');
        if (questionCard) {
            this.selectQuestion(questionCard);
        }
    }

    selectQuestion(card) {
        // إزالة التحديد من البطاقات الأخرى في نفس المجموعة
        const parent = card.closest('form, .questions-container');
        if (parent) {
            const otherCards = parent.querySelectorAll('.question-card-quiz.selected');
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
        
        // تشغيل الصوت
        if (window.soundManager) {
            window.soundManager.playSound('cardClick');
        }
    }

    handleRadioSelection(card, input) {
        // تحديث حالة البطاقة
        this.selectQuestion(card);
        
        // حفظ الإجابة
        const questionName = input.name;
        this.userAnswers.set(questionName, input.value);
        
        // تحديث التقدم
        const quizForm = card.closest('form');
        this.updateProgress(quizForm);
        
        // تأثير بصري للراديو
        input.style.transform = 'scale(1.2)';
        setTimeout(() => {
            input.style.transform = '';
        }, 200);
    }

    updateProgress(quizForm) {
        const totalQuestions = quizForm.querySelectorAll('input[type="radio"]').length / 
                              quizForm.querySelectorAll('input[type="radio"]').length > 0 ? 
                              new Set([...quizForm.querySelectorAll('input[type="radio"]')].map(input => input.name)).size : 0;
        
        const answeredQuestions = new Set([...this.userAnswers.keys()]).size;
        
        const progressBar = quizForm.querySelector('.progress-bar-enhanced');
        const progressCurrent = quizForm.querySelector('.progress-current');
        const progressTotal = quizForm.querySelector('.progress-total');
        
        if (progressBar) {
            const percentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressCurrent) {
            progressCurrent.textContent = answeredQuestions;
        }
        
        if (progressTotal) {
            progressTotal.textContent = totalQuestions;
        }
    }

    async handleQuizSubmit(button) {
        const quizForm = button.closest('form');
        
        // التحقق من إكمال جميع الأسئلة
        if (!this.validateQuizCompletion(quizForm)) {
            this.showValidationMessage('يرجى الإجابة على جميع الأسئلة', 'warning');
            return;
        }
        
        // بدء عملية التقييم
        this.startQuizEvaluation(quizForm, button);
    }

    validateQuizCompletion(quizForm) {
        const questions = new Set([...quizForm.querySelectorAll('input[type="radio"]')].map(input => input.name));
        const answered = new Set([...this.userAnswers.keys()]);
        
        return questions.size === answered.size && questions.size > 0;
    }

    async startQuizEvaluation(quizForm, button) {
        // إضافة حالة التحميل
        this.setButtonLoading(button, true);
        quizForm.classList.add('quiz-loading');
        
        // محاكاة تأخير التقييم
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // حساب النتيجة
        const result = this.calculateQuizResult(quizForm);
        
        // إزالة حالة التحميل
        this.setButtonLoading(button, false);
        quizForm.classList.remove('quiz-loading');
        
        // عرض النتيجة مع الأنيميشن
        this.showQuizResult(quizForm, result);
        
        // تشغيل الاحتفالات
        this.celebrateResult(result);
    }

    calculateQuizResult(quizForm) {
        // الحصول على الإجابات الصحيحة من البيانات المحددة مسبقاً
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

    showQuizResult(quizForm, result) {
        // إنشاء عنصر النتيجة
        const resultContainer = document.createElement('div');
        resultContainer.className = 'quiz-results';
        resultContainer.innerHTML = `
            <div class="text-center p-4">
                <div class="score-display">${result.percentage}%</div>
                <h3 class="mb-3">${this.getResultMessage(result.percentage)}</h3>
                <p class="text-muted mb-4">
                    ${result.correct} من ${result.total} أسئلة صحيحة
                </p>
                <div class="result-details">
                    ${this.generateResultDetails(result.results)}
                </div>
            </div>
        `;
        
        // إدراج النتيجة في النموذج
        quizForm.appendChild(resultContainer);
        
        // إظهار النتيجة مع الأنيميشن
        setTimeout(() => {
            resultContainer.classList.add('show');
        }, 100);
        
        // إخفاء النموذج الأصلي
        const originalContent = quizForm.querySelector('.quiz-content, .card-body');
        if (originalContent) {
            originalContent.style.display = 'none';
        }
        
        // تحديث حالة الأسئلة
        this.updateQuestionStates(quizForm, result.results);
    }

    getResultMessage(percentage) {
        if (percentage >= 90) return 'ممتاز! 🎉';
        if (percentage >= 70) return 'أحسنت! ⭐';
        if (percentage >= 50) return 'جيد! 👍';
        return 'حاول مرة أخرى! 💪';
    }

    generateResultDetails(results) {
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

    updateQuestionStates(quizForm, results) {
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

    celebrateResult(result) {
        if (window.celebrationManager) {
            window.celebrationManager.celebrateAchievement(result.correct, result.total);
        }
    }

    setButtonLoading(button, isLoading) {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<i class="spinner-border spinner-border-sm me-2"></i>جاري التقييم...';
        } else {
            button.disabled = false;
            button.innerHTML = button.dataset.originalText || button.innerHTML;
        }
    }

    showValidationMessage(message, type = 'info') {
        const alertClass = {
            'warning': 'alert-warning',
            'error': 'alert-danger',
            'info': 'alert-info'
        }[type] || 'alert-info';
        
        const alert = document.createElement('div');
        alert.className = `alert ${alertClass} alert-dismissible fade show`;
        alert.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // إدراج في بداية النموذج
        const quizForm = document.querySelector('.quiz-container-enhanced');
        if (quizForm) {
            quizForm.insertBefore(alert, quizForm.firstChild);
            
            // إزالة تلقائية بعد 5 ثوان
            setTimeout(() => {
                if (alert.parentNode) {
                    alert.remove();
                }
            }, 5000);
        }
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('form[id*="test"], form[id*="quiz"], form[id*="pretest"]')) {
                            this.enhanceQuiz(node);
                        }
                        
                        // التحقق من العناصر الفرعية
                        const forms = node.querySelectorAll('form[id*="test"], form[id*="quiz"], form[id*="pretest"]');
                        forms.forEach(form => this.enhanceQuiz(form));
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // دوال عامة للتحكم
    resetQuiz(quizForm) {
        // إعادة تعيين النموذج
        quizForm.reset();
        
        // إعادة تعيين المتغيرات
        this.userAnswers.clear();
        
        // إزالة النتائج
        const resultContainer = quizForm.querySelector('.quiz-results');
        if (resultContainer) {
            resultContainer.remove();
        }
        
        // إظهار المحتوى الأصلي
        const originalContent = quizForm.querySelector('.quiz-content, .card-body');
        if (originalContent) {
            originalContent.style.display = '';
        }
        
        // إعادة تعيين حالة الأسئلة
        const questionCards = quizForm.querySelectorAll('.question-card-quiz');
        questionCards.forEach(card => {
            card.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // تحديث شريط التقدم
        this.updateProgress(quizForm);
    }

    // تنظيف الموارد
    destroy() {
        this.userAnswers.clear();
        this.quizResults.clear();
        this.animationQueue = [];
    }
}

// إنشاء مدير الاختبارات
const lessonQuizManager = new LessonQuizManager();

// تصدير للاستخدام العام
window.lessonQuizManager = lessonQuizManager;

// دوال مختصرة للاستخدام السهل
window.resetQuiz = (quizForm) => lessonQuizManager.resetQuiz(quizForm);

// تهيئة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    console.log('📝 Lesson Quiz System initialized');
});

console.log('📝 Lesson Quiz System loaded successfully!');
