/**
 * 📚 LESSON SYSTEM - نظام إدارة الدروس والاختبارات
 * 
 * نظام شامل لإدارة الدروس والاختبارات مع قفل المحتوى
 * الاختبار القبلي لتحديد المستوى فقط (يفتح المحتوى بأي نتيجة)
 * الاختبار النهائي يتطلب 60% على الأقل
 * 
 * @version 1.0 - Kids Learning Platform
 * @date December 2024
 */

class LessonSystem {
    constructor() {
        this.currentLesson = null;
        this.quizData = null;
        this.studentAnswers = {};
        this.correctAnswers = {};
        this.minimumScore = 60; // final/posttest only — pretest always unlocks
        this.init();
    }

    /**
     * Initialize the lesson system
     */
    init() {
        this.detectCurrentLesson();
        this.loadQuizData();
        this.setupEventListeners();
        this.checkLessonAccess();
        this.updateProgress();
    }

    /**
     * Detect current lesson from URL or page data
     */
    detectCurrentLesson() {
        const path = window.location.pathname;
        const lessonMatch = path.match(/group(\d+)-lesson(\d+)\.html/);
        
        if (lessonMatch) {
            this.currentLesson = {
                group: parseInt(lessonMatch[1]),
                lesson: parseInt(lessonMatch[2])
            };
        } else {
            // Try to get from meta tag
            const lessonMeta = document.querySelector('meta[name="lesson-meta"]');
            if (lessonMeta) {
                this.currentLesson = {
                    group: parseInt(lessonMeta.dataset.group),
                    lesson: parseInt(lessonMeta.dataset.lesson)
                };
            }
        }
    }

    /**
     * Load quiz data and correct answers
     */
    loadQuizData() {
        // Get correct answers from window object (set in HTML)
        if (window.lessonCorrectAnswers) {
            this.correctAnswers = window.lessonCorrectAnswers;
        }

        // Load student progress from localStorage
        const progressKey = `lesson_${this.currentLesson.group}_${this.currentLesson.lesson}_progress`;
        const savedProgress = localStorage.getItem(progressKey);
        
        if (savedProgress) {
            try {
                const progress = JSON.parse(savedProgress);
                this.studentAnswers = progress.answers || {};
                this.quizData = progress;
            } catch (error) {
                console.error('Error loading lesson progress:', error);
            }
        }
    }

    /**
     * Setup event listeners for quiz interactions
     */
    setupEventListeners() {
        // Listen for quiz form submissions
        const quizForm = document.getElementById('pretest-form');
        if (quizForm) {
            quizForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuizSubmission();
            });
        }

        // Listen for submit button clicks
        const submitBtn = document.getElementById('submit-pretest');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.handleQuizSubmission();
            });
        }

        // Listen for radio button changes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'radio') {
                this.handleAnswerSelection(e.target);
            }
        });

        // Listen for reset button
        const resetBtn = document.getElementById('reset-pretest');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetQuiz();
            });
        }
    }

    /**
     * Handle answer selection
     */
    handleAnswerSelection(radioInput) {
        const questionName = radioInput.name;
        const answerValue = radioInput.value;
        
        this.studentAnswers[questionName] = answerValue;
        
        // Visual feedback
        this.updateAnswerVisual(radioInput);
        
        // Save progress
        this.saveProgress();
    }

    /**
     * Update visual feedback for selected answers
     */
    updateAnswerVisual(radioInput) {
        const questionContainer = radioInput.closest('.question-card, .quiz-question');
        if (!questionContainer) return;

        // Remove previous selections
        const allOptions = questionContainer.querySelectorAll('.quiz-option, .form-check-label');
        allOptions.forEach(option => {
            option.classList.remove('selected');
        });

        // Highlight selected option
        const selectedLabel = radioInput.closest('.quiz-option, .form-check-label');
        if (selectedLabel) {
            selectedLabel.classList.add('selected');
        }
    }

    /**
     * Handle quiz submission
     */
    handleQuizSubmission() {
        if (!this.validateQuizCompletion()) {
            this.showMessage('يرجى الإجابة على جميع الأسئلة قبل التقييم', 'warning');
            return;
        }

        const results = this.calculateQuizResults();
        this.displayQuizResults(results);
        this.saveProgress(results);
        this.updateProgress();
    }

    /**
     * Validate that all questions are answered
     */
    validateQuizCompletion() {
        const requiredQuestions = Object.keys(this.correctAnswers.pretest_tf || {});
        const mcqQuestions = Object.keys(this.correctAnswers.pretest_mcq || {});
        const allQuestions = [...requiredQuestions, ...mcqQuestions];

        for (const question of allQuestions) {
            if (!this.studentAnswers[`pretest_tf_${question}`] && 
                !this.studentAnswers[`pretest_mcq_${question}`]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Calculate quiz results
     */
    calculateQuizResults() {
        const results = {
            totalQuestions: 0,
            correctAnswers: 0,
            percentage: 0,
            passed: false,
            details: {}
        };

        // Check True/False questions
        if (this.correctAnswers.pretest_tf) {
            Object.keys(this.correctAnswers.pretest_tf).forEach(questionNum => {
                const questionName = `pretest_tf_${questionNum}`;
                const entry = this.correctAnswers.pretest_tf[questionNum];
                const correctAnswer = entry && typeof entry === 'object' ? entry.answer : entry;
                const studentAnswer = this.studentAnswers[questionName];
                const normalizedCorrect = typeof correctAnswer === 'boolean'
                    ? String(correctAnswer)
                    : String(correctAnswer ?? '').toLowerCase();
                const normalizedStudent = String(studentAnswer ?? '').toLowerCase();
                const isCorrect = normalizedStudent === normalizedCorrect;
                
                results.totalQuestions++;
                results.details[questionName] = {
                    correct: isCorrect,
                    correctAnswer: correctAnswer,
                    studentAnswer: studentAnswer
                };
                
                if (isCorrect) {
                    results.correctAnswers++;
                }
            });
        }

        // Check Multiple Choice questions
        if (this.correctAnswers.pretest_mcq) {
            Object.keys(this.correctAnswers.pretest_mcq).forEach(questionNum => {
                const questionName = `pretest_mcq_${questionNum}`;
                const entry = this.correctAnswers.pretest_mcq[questionNum];
                const correctAnswer = entry && typeof entry === 'object' ? entry.answer : entry;
                const studentAnswer = this.studentAnswers[questionName];
                const isCorrect = String(studentAnswer ?? '') === String(correctAnswer ?? '');
                
                results.totalQuestions++;
                results.details[questionName] = {
                    correct: isCorrect,
                    correctAnswer: correctAnswer,
                    studentAnswer: studentAnswer
                };
                
                if (isCorrect) {
                    results.correctAnswers++;
                }
            });
        }

        results.percentage = Math.round((results.correctAnswers / results.totalQuestions) * 100);
        // Pretest is diagnostic: always continue. Final exam still needs ≥60%.
        results.isPretest = true;
        results.passed = true;
        results.unlocksContent = true;

        return results;
    }

    /**
     * Display quiz results
     */
    displayQuizResults(results) {
        // Update answer visuals
        this.updateAnswerVisuals(results);

        // Show results message
        const message = this.createResultsMessage(results);
        this.showMessage(message, 'success');

        // Pretest always unlocks content
        this.toggleLessonContent(results.unlocksContent !== false);

        // Update buttons
        this.updateQuizButtons(true);
    }

    /**
     * Update answer visuals based on results
     */
    updateAnswerVisuals(results) {
        Object.keys(results.details).forEach(questionName => {
            const detail = results.details[questionName];
            const radioInput = document.querySelector(`input[name="${questionName}"]:checked`);
            
            if (radioInput) {
                const optionContainer = radioInput.closest('.quiz-option, .form-check-label');
                if (optionContainer) {
                    optionContainer.classList.remove('selected');
                    optionContainer.classList.add(detail.correct ? 'correct' : 'incorrect');
                }
            }
        });
    }

    /**
     * Create results message
     */
    createResultsMessage(results) {
        const scoreText = `نتيجتك: ${results.correctAnswers}/${results.totalQuestions} (${results.percentage}%)`;
        
        return `📊 ${scoreText}<br>الاختبار القبلي لتحديد المستوى فقط — يمكنك الآن مشاهدة محتوى الدرس.`;
    }

    /**
     * Toggle lesson content visibility
     */
    toggleLessonContent(showContent) {
        const lessonContent = document.getElementById('lesson-content');
        const pretestSection = document.getElementById('pretest-section');
        
        if (lessonContent && pretestSection) {
            if (showContent) {
                lessonContent.style.display = 'block';
                lessonContent.classList.add('animate-fadeIn');
                pretestSection.style.opacity = '0.7';
            } else {
                lessonContent.style.display = 'none';
                pretestSection.style.opacity = '1';
            }
        }
    }

    /**
     * Update quiz buttons
     */
    updateQuizButtons(hasPassed) {
        const submitBtn = document.getElementById('submit-pretest');
        const resetBtn = document.getElementById('reset-pretest');
        
        if (submitBtn && resetBtn) {
            if (hasPassed) {
                submitBtn.style.display = 'none';
                resetBtn.style.display = 'inline-block';
            } else {
                submitBtn.style.display = 'inline-block';
                resetBtn.style.display = 'inline-block';
            }
        }
    }

    /**
     * Reset quiz
     */
    resetQuiz() {
        // Clear answers
        this.studentAnswers = {};
        
        // Reset form
        const quizForm = document.getElementById('pretest-form');
        if (quizForm) {
            quizForm.reset();
        }
        
        // Clear visual states
        document.querySelectorAll('.quiz-option, .form-check-label').forEach(option => {
            option.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Hide lesson content
        this.toggleLessonContent(false);
        
        // Reset buttons
        this.updateQuizButtons(false);
        
        // Clear saved progress
        this.saveProgress();
        
        // Clear message
        this.clearMessage();
    }

    /**
     * Save progress to localStorage
     */
    saveProgress(results = null) {
        const progressKey = `lesson_${this.currentLesson.group}_${this.currentLesson.lesson}_progress`;
        const progress = {
            answers: this.studentAnswers,
            results: results,
            timestamp: new Date().toISOString()
        };
        
        localStorage.setItem(progressKey, JSON.stringify(progress));
        this.quizData = progress;
    }

    /**
     * Check lesson access and restore state
     */
    checkLessonAccess() {
        if (this.quizData && this.quizData.results) {
            const hasPassed = this.quizData.results.passed;
            this.toggleLessonContent(hasPassed);
            this.updateQuizButtons(hasPassed);
            
            if (hasPassed) {
                this.displayQuizResults(this.quizData.results);
            }
        }
    }

    /**
     * Update progress indicators
     */
    updateProgress() {
        // Update progress in group page if available
        const progressKey = `lesson_${this.currentLesson.group}_${this.currentLesson.lesson}_progress`;
        const progress = localStorage.getItem(progressKey);
        
        if (progress) {
            try {
                const data = JSON.parse(progress);
                if (data.results && data.results.passed) {
                    // Mark lesson as completed in group page
                    this.markLessonCompleted();
                }
            } catch (error) {
                console.error('Error updating progress:', error);
            }
        }
    }

    /**
     * Mark lesson as completed
     */
    markLessonCompleted() {
        const lessonKey = `lesson_${this.currentLesson.group}_${this.currentLesson.lesson}_completed`;
        localStorage.setItem(lessonKey, 'true');
        
        // Update group progress
        const groupKey = `group_${this.currentLesson.group}_progress`;
        const groupProgress = JSON.parse(localStorage.getItem(groupKey) || '{}');
        groupProgress[`lesson_${this.currentLesson.lesson}`] = true;
        localStorage.setItem(groupKey, JSON.stringify(groupProgress));
    }

    /**
     * Show message to user
     */
    showMessage(message, type = 'info') {
        // Remove existing messages
        this.clearMessage();
        
        // Create message element
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type} alert-dismissible fade show`;
        messageDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insert message
        const pretestSection = document.getElementById('pretest-section');
        if (pretestSection) {
            pretestSection.insertBefore(messageDiv, pretestSection.firstChild);
        }
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.remove();
            }
        }, 5000);
    }

    /**
     * Clear existing messages
     */
    clearMessage() {
        const existingMessages = document.querySelectorAll('.alert');
        existingMessages.forEach(msg => msg.remove());
    }

    /**
     * Get lesson statistics
     */
    getLessonStats() {
        const stats = {
            totalLessons: 28, // 4 groups × 7 lessons
            completedLessons: 0,
            totalScore: 0,
            averageScore: 0
        };
        
        for (let group = 1; group <= 4; group++) {
            for (let lesson = 1; lesson <= 7; lesson++) {
                const progressKey = `lesson_${group}_${lesson}_progress`;
                const progress = localStorage.getItem(progressKey);
                
                if (progress) {
                    try {
                        const data = JSON.parse(progress);
                        if (data.results && data.results.passed) {
                            stats.completedLessons++;
                            stats.totalScore += data.results.percentage;
                        }
                    } catch (error) {
                        console.error('Error reading lesson stats:', error);
                    }
                }
            }
        }
        
        stats.averageScore = stats.completedLessons > 0 ? 
            Math.round(stats.totalScore / stats.completedLessons) : 0;
        
        return stats;
    }
}

// Initialize lesson system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on lesson pages
    if (window.location.pathname.includes('lesson')) {
        window.lessonSystem = new LessonSystem();
    }
});

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LessonSystem;
}

