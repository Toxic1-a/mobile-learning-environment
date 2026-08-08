/**
 * 🚀 MAIN JAVASCRIPT - الملف الموحد لجميع الوظائف
 * بيئة التعلم النقال - Mobile Learning Environment
 * 
 * ملف موحد يحتوي على جميع وظائف الموقع
 * تم دمج 17 ملف JavaScript في ملف واحد لتحسين الأداء
 * 
 * @version 1.0 - Unified Functions
 * @date December 2024
 */

// ============================================
// COMMON FUNCTIONS - الوظائف المشتركة
// ============================================

// فحص تسجيل دخول الإدارة للوصول لرابط لوحة المتابعة
function isAdminLoggedIn() {
  if (localStorage.getItem('adminLoggedIn') === 'true' && localStorage.getItem('adminUser')) {
    return true;
  }
  return localStorage.getItem('userType') === 'admin';
}

function checkAdminAccess() {
  const dashboardLink = document.querySelector('a[href="dashboard.html"], a[href="admin-login.html"]');
  
  if (dashboardLink) {
    if (isAdminLoggedIn()) {
      dashboardLink.href = 'dashboard.html';
      dashboardLink.style.display = 'block';
      dashboardLink.innerHTML = '📊 لوحة المتابعة';
    } else {
      dashboardLink.href = 'admin-login.html';
      dashboardLink.innerHTML = '🔐 تسجيل دخول الإدارة';
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

// ============================================
// FLOATING GO UP BUTTON SYSTEM
// ============================================

// Initialize floating go up button
function initFloatingGoUpButton() {
    // Create floating go up button
    const goUpButton = document.createElement('button');
    goUpButton.id = 'floating-go-up';
    goUpButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
    goUpButton.className = 'floating-go-up-btn';
    goUpButton.setAttribute('aria-label', 'العودة للأعلى');
    goUpButton.setAttribute('title', 'العودة للأعلى');
    
    // Add styles
    const styles = document.createElement('style');
    styles.textContent = `
        .floating-go-up-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            border: none;
            cursor: pointer;
            z-index: 1000;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
            transition: all 0.3s ease;
        }
        
        .floating-go-up-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
        }
        
        .floating-go-up-btn.show {
            display: flex;
        }
    `;
    document.head.appendChild(styles);
    
    // Add to page
    document.body.appendChild(goUpButton);
    
    // Show/hide based on scroll
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            goUpButton.classList.add('show');
        } else {
            goUpButton.classList.remove('show');
        }
    });
    
    // Scroll to top on click
    goUpButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// LESSON QUIZ SYSTEM
// ============================================

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

            .question-card-quiz:hover {
                transform: translateY(-2px) scale(1.02);
                box-shadow: 0 8px 25px rgba(79, 172, 254, 0.15);
                border-color: rgba(79, 172, 254, 0.3);
            }

            .question-card-quiz.selected {
                border-color: #4facfe;
                background: linear-gradient(135deg, rgba(79, 172, 254, 0.05) 0%, rgba(0, 242, 254, 0.05) 100%);
                transform: translateY(-3px) scale(1.03);
                box-shadow: 0 10px 30px rgba(79, 172, 254, 0.2);
            }

            .question-card-quiz.correct {
                border-color: #10b981;
                background: linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%);
                animation: correctPulse 0.6s ease-out;
            }

            .question-card-quiz.incorrect {
                border-color: #ef4444;
                background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
                animation: incorrectShake 0.6s ease-out;
            }

            @keyframes correctPulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.05); }
                100% { transform: scale(1); }
            }

            @keyframes incorrectShake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }

            /* Progress Bar */
            .quiz-progress {
                height: 8px;
                background: rgba(79, 172, 254, 0.2);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 20px;
            }

            .quiz-progress-bar {
                height: 100%;
                background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                width: 0%;
                transition: width 0.5s ease;
                border-radius: 4px;
            }

            /* Results Animation */
            .quiz-results {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }

            .quiz-results.show {
                opacity: 1;
                transform: translateY(0);
            }
        `;
        document.head.appendChild(styles);
    }

    setupEventListeners() {
        // Use closest() so clicks on icons/text inside buttons still work
        document.addEventListener('click', (e) => {
            const submitBtn = e.target.closest('#submit-pretest, #submit-quiz');
            if (submitBtn) {
                e.preventDefault();
                this.handleQuizSubmit(submitBtn);
                return;
            }

            const resetBtn = e.target.closest('#reset-pretest, #reset-quiz');
            if (resetBtn) {
                e.preventDefault();
                this.resetQuiz();
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.handleAnswerSelection(e.target);
            }
        });
    }

    initializeQuizzes() {
        // Event delegation in setupEventListeners handles submit/reset;
        // only ensure progress UI exists for current forms.
        const quizForms = document.querySelectorAll('form[id$="-form"]');
        quizForms.forEach(() => {
            this.updateProgress();
        });
    }

    handleAnswerSelection(radioInput) {
        const questionCard = radioInput.closest('.question-card, .question-card-quiz');
        if (questionCard) {
            // Remove selection from siblings
            const siblings = questionCard.parentElement.querySelectorAll('.question-card, .question-card-quiz');
            siblings.forEach(sibling => {
                sibling.classList.remove('selected');
            });
            
            // Add selection to current
            questionCard.classList.add('selected');
            
            // Update progress
            this.updateProgress();
        }
    }

    updateProgress() {
        const form = document.querySelector('form[id$="-form"]');
        if (!form) return;

        // Count unique question names (supports TF with 2 options and MCQ with 3+)
        const radioInputs = form.querySelectorAll('input[type="radio"]');
        const questionNames = new Set();
        radioInputs.forEach((input) => {
            if (input.name) {
                questionNames.add(input.name);
            }
        });
        const totalQuestions = questionNames.size;
        const answeredQuestions = form.querySelectorAll('input[type="radio"]:checked').length;
        const progress = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
        
        let progressBar = form.querySelector('.quiz-progress-bar');
        if (!progressBar) {
            const progressContainer = document.createElement('div');
            progressContainer.className = 'quiz-progress';
            progressContainer.innerHTML = '<div class="quiz-progress-bar"></div>';
            form.insertBefore(progressContainer, form.firstChild);
            progressBar = progressContainer.querySelector('.quiz-progress-bar');
        }
        
        progressBar.style.width = `${progress}%`;
    }

    handleQuizSubmit(button) {
        const form = button.closest('form');
        if (!form || form.dataset.submitted === 'true') return;

        form.dataset.submitted = 'true';
        
        const quizId = form.id.replace('-form', '');
        const answers = this.collectAnswers(form);
        const results = this.calculateResults(answers, quizId);
        
        this.displayResults(results, form);
        this.saveResults(quizId, results);
    }

    collectAnswers(form) {
        const answers = {};
        const radioGroups = form.querySelectorAll('input[type="radio"]:checked');
        
        radioGroups.forEach(input => {
            const questionName = input.name;
            const answer = input.value;
            answers[questionName] = answer;
        });
        
        return answers;
    }

    calculateResults(answers, quizId) {
        const correctAnswers = window.lessonCorrectAnswers || {};
        let correct = 0;
        let total = 0;
        const details = {};
        
        Object.keys(answers).forEach(questionName => {
            total++;
            const userAnswer = answers[questionName];
            const correctAnswer = this.getCorrectAnswer(questionName, correctAnswers);
            const isCorrect = this.answersMatch(userAnswer, correctAnswer);
            
            if (isCorrect) {
                correct++;
                details[questionName] = { correct: true, userAnswer, correctAnswer };
            } else {
                details[questionName] = { correct: false, userAnswer, correctAnswer };
            }
        });
        
        const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
        
        return {
            correct,
            total,
            percentage,
            details,
            passed: percentage >= 60
        };
    }

    /**
     * Normalize and compare user/correct answers (handles boolean vs "true"/"false").
     */
    answersMatch(userAnswer, correctAnswer) {
        if (userAnswer == null || correctAnswer == null) {
            return false;
        }

        const normalize = (value) => {
            if (typeof value === 'boolean') {
                return value ? 'true' : 'false';
            }
            return String(value).trim().toLowerCase();
        };

        return normalize(userAnswer) === normalize(correctAnswer);
    }

    getCorrectAnswer(questionName, correctAnswers) {
        if (questionName.includes('_tf_')) {
            const questionNum = questionName.split('_tf_')[1];
            const entry = correctAnswers.pretest_tf?.[questionNum];
            return entry && typeof entry === 'object' ? entry.answer : entry;
        } else if (questionName.includes('_mcq_')) {
            const questionNum = questionName.split('_mcq_')[1];
            const entry = correctAnswers.pretest_mcq?.[questionNum];
            return entry && typeof entry === 'object' ? entry.answer : entry;
        }
        return null;
    }

    displayResults(results, form) {
        // Hide form
        form.style.display = 'none';
        
        // Create results container
        const resultsContainer = document.createElement('div');
        resultsContainer.className = 'quiz-results';
        resultsContainer.innerHTML = this.generateResultsHTML(results);
        
        // Insert results
        form.parentElement.appendChild(resultsContainer);
        
        // Show results with animation
        setTimeout(() => {
            resultsContainer.classList.add('show');
        }, 100);
        
        // Show lesson content if passed
        if (results.passed) {
            this.showLessonContent();
        }
    }

    generateResultsHTML(results) {
        const statusClass = results.passed ? 'success' : 'danger';
        const statusIcon = results.passed ? 'bi-check-circle-fill' : 'bi-x-circle-fill';
        const statusText = results.passed ? 'ممتاز!' : 'تحتاج للمحاولة مرة أخرى';
        
        return `
            <div class="card shadow-lg border-0">
                <div class="card-header text-white bg-${statusClass}">
                    <h3 class="h4 mb-0">
                        <i class="bi ${statusIcon} me-2"></i>نتائج الاختبار
                    </h3>
                </div>
                <div class="card-body text-center">
                    <div class="mb-4">
                        <div class="display-1 fw-bold text-${statusClass}">${results.percentage}%</div>
                        <p class="lead">${statusText}</p>
                    </div>
                    
                    <div class="row mb-4">
                        <div class="col-6">
                            <div class="card bg-light">
                                <div class="card-body">
                                    <h5 class="text-success">${results.correct}</h5>
                                    <small>إجابات صحيحة</small>
                                </div>
                            </div>
                        </div>
                        <div class="col-6">
                            <div class="card bg-light">
                                <div class="card-body">
                                    <h5 class="text-danger">${results.total - results.correct}</h5>
                                    <small>إجابات خاطئة</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${results.passed ? 
                        '<div class="alert alert-success"><strong>تهانينا!</strong> يمكنك الآن مشاهدة محتوى الدرس.</div>' :
                        '<div class="alert alert-warning"><strong>نصيحة:</strong> حاول مرة أخرى لتحسين نتيجتك.</div>'
                    }
                    
                    <button type="button" class="btn btn-secondary" onclick="location.reload()">
                        <i class="bi bi-arrow-clockwise me-2"></i>إعادة الاختبار
                    </button>
                </div>
            </div>
        `;
    }

    showLessonContent() {
        const lessonContent = document.getElementById('lesson-content');
        if (lessonContent) {
            lessonContent.style.display = 'block';
            lessonContent.scrollIntoView({ behavior: 'smooth' });
        }
    }

    saveResults(quizId, results) {
        const studentData = JSON.parse(localStorage.getItem('studentData') || '{}');
        if (!studentData.quizResults) {
            studentData.quizResults = {};
        }
        
        studentData.quizResults[quizId] = {
            ...results,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem('studentData', JSON.stringify(studentData));
    }

    resetQuiz() {
        location.reload();
    }

    setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const forms = node.querySelectorAll ? node.querySelectorAll('form[id$="-form"]') : [];
                            forms.forEach(form => this.setupQuizForm(form));
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

// ============================================
// ANIMATIONS SYSTEM
// ============================================

class AnimationManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupFloatingElements();
        this.setupButtonInteractions();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);

        // Observe elements with animation classes
        document.querySelectorAll('.fade-in-scroll, .slide-up-scroll, .slide-left-scroll, .slide-right-scroll').forEach(el => {
            observer.observe(el);
        });
    }

    setupFloatingElements() {
        // Create floating shapes
        const shapes = ['circle', 'triangle', 'square'];
        shapes.forEach((shape, index) => {
            const element = document.createElement('div');
            element.className = `floating-shape ${shape}`;
            element.style.animationDelay = `${index * 2}s`;
            document.body.appendChild(element);
        });
    }

    setupButtonInteractions() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn, .btn *')) {
                this.animateButton(e.target.closest('.btn'));
            }
        });
    }

    animateButton(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }
}

// ============================================
// MOBILE OPTIMIZATIONS
// ============================================

class MobileOptimizer {
    constructor() {
        this.init();
    }

    init() {
        this.preventZoom();
        this.optimizeTouchEvents();
        this.setupMobileQuiz();
    }

    preventZoom() {
        document.addEventListener('touchstart', (e) => {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });

        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);
    }

    optimizeTouchEvents() {
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('.question-card, .question-card-quiz')) {
                e.target.style.transform = 'scale(0.98)';
            }
        });

        document.addEventListener('touchend', (e) => {
            if (e.target.matches('.question-card, .question-card-quiz')) {
                e.target.style.transform = '';
            }
        });
    }

    setupMobileQuiz() {
        // Enhanced mobile quiz interactions
        document.addEventListener('touchstart', (e) => {
            if (e.target.matches('input[type="radio"]')) {
                const questionCard = e.target.closest('.question-card, .question-card-quiz');
                if (questionCard) {
                    questionCard.classList.add('mobile-selected');
                }
            }
        });
    }
}

// ============================================
// INITIALIZATION
// ============================================

// Initialize all systems when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize common functions
    checkAdminAccess();
    displayStudentInfo();
    
    // Initialize floating go up button
    initFloatingGoUpButton();
    
    // Initialize quiz system
    window.quizManager = new LessonQuizManager();
    
    // Initialize animations
    window.animationManager = new AnimationManager();
    
    // Initialize mobile optimizations
    if (window.innerWidth <= 768) {
        window.mobileOptimizer = new MobileOptimizer();
    }
    
    // Initialize theme system
    if (typeof initThemeSystem === 'function') {
        initThemeSystem();
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

// Smooth scroll to element
function smoothScrollTo(element) {
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Show loading state
function showLoading(element) {
    if (element) {
        element.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>جاري التحميل...';
        element.disabled = true;
    }
}

// Hide loading state
function hideLoading(element, originalText) {
    if (element) {
        element.innerHTML = originalText;
        element.disabled = false;
    }
}

// Show success message
function showSuccess(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show';
    alert.innerHTML = `
        <i class="bi bi-check-circle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// Show error message
function showError(message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger alert-dismissible fade show';
    alert.innerHTML = `
        <i class="bi bi-exclamation-triangle me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.insertBefore(alert, document.body.firstChild);
    
    setTimeout(() => {
        alert.remove();
    }, 5000);
}

// ============================================
// EXPORT FOR GLOBAL ACCESS
// ============================================

// Make functions globally available
window.smoothScrollTo = smoothScrollTo;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.showSuccess = showSuccess;
window.showError = showError;
