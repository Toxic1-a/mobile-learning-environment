/*
  منطق التطبيق البسيط باستخدام LocalStorage
  - إدارة جلسة الطالب (login/logout)
  - تدرج الدرس الأول: قبلي -> محتوى -> بعدي
  - حفظ الدرجات وعرضها في لوحة التحكم
*/
(function() {
  const storageKeys = {
    students: 'mnle_students',
    session: 'mnle_session',
    progress: 'mnle_progress', // keyed by student name
  };

  function readJson(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
    catch { return fallback; }
  }
  function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function getSession() {
    // Check both session storage methods
    const session = readJson(storageKeys.session, null);
    if (session) return session;
    
    // Check currentUser from localStorage
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      try {
        return JSON.parse(currentUser);
      } catch (e) {
        return null;
      }
    }
    
    return null;
  }

  function setSession(session) {
    writeJson(storageKeys.session, session);
    updateAuthUI();
  }

  function logout() {
    try {
      // إزالة جميع آثار الجلسة الحالية مع الإبقاء على تقدم الطالب إن وجد
      localStorage.removeItem(storageKeys.session);
      localStorage.removeItem('currentUser');
      // تحديث الواجهة وإعادة التوجيه إلى صفحة الدخول
      updateAuthUI();
      if (window.location.pathname.toLowerCase().includes('login.html') === false) {
        window.location.href = 'login.html';
      }
    } catch (_) {
      window.location.href = 'login.html';
    }
  }

  function ensureStudentRecord(name, group) {
    const students = readJson(storageKeys.students, []);
    const exists = students.find(s => s.name === name);
    if (!exists) {
      students.push({ name, group });
      writeJson(storageKeys.students, students);
    } else if (group && exists.group !== group) {
      exists.group = group;
      writeJson(storageKeys.students, students);
    }
  }

  function getProgress(name) {
    const all = readJson(storageKeys.progress, {});
    return all[name] || { preScore: null, contentDone: false, postScore: null };
  }

  function setProgress(name, patch) {
    const all = readJson(storageKeys.progress, {});
    const current = all[name] || { preScore: null, contentDone: false, postScore: null };
    all[name] = { ...current, ...patch };
    writeJson(storageKeys.progress, all);
  }

  function updateAuthUI() {
    const session = getSession();
    const signedSpan = document.getElementById('signedInUser');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const headerLogoutBtn = document.getElementById('headerLogoutBtn');
    
    if (signedSpan) {
      signedSpan.textContent = session ? `مسجل: ${session.name} (${session.group})` : 'غير مسجل';
    }
    if (loginBtn) loginBtn.hidden = !!session;
    if (logoutBtn) {
      logoutBtn.hidden = !session;
      logoutBtn.onclick = () => logout();
    }

    // تعطيل تبديل المظهر نهائياً: وضع واحد فقط (فاتح)
    document.body.classList.remove('theme-dark');
    localStorage.removeItem('mnle_theme');
  }

  function requireLogin() {
    if (!getSession()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }

  function initLoginPage() {
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentName').value.trim();
      const group = document.getElementById('groupSelect').value;
      if (!name || !group) {
        form.classList.add('was-validated');
        return;
      }
      ensureStudentRecord(name, group);
      setSession({ name, group });
      window.location.href = 'index.html';
    });
  }

  function initLesson1Page() {
    if (!requireStudentLogin()) return;
    const session = getSession();
    const preForm = document.getElementById('preQuizForm');
    const preResult = document.getElementById('preQuizResult');
    const postForm = document.getElementById('postQuizForm');
    const postResult = document.getElementById('postQuizResult');
    const tabContentBtn = document.getElementById('tab-content');
    const tabPostBtn = document.getElementById('tab-post');
    const markContentDoneBtn = document.getElementById('markContentDone');
    const submitPostQuizBtn = document.getElementById('submitPostQuiz');
    const progressBar = document.getElementById('lessonProgress');

    const prog = getProgress(session.name);
    if (prog.preScore !== null) tabContentBtn.classList.remove('disabled');
    if (prog.contentDone) submitPostQuizBtn.disabled = false, tabPostBtn.classList.remove('disabled');

    function refreshProgressUi() {
      const p = getProgress(session.name);
      let step = 0;
      if (p.preScore !== null) step = 33;
      if (p.contentDone) step = 66;
      if (p.postScore !== null) step = 100;
      if (progressBar) {
        progressBar.style.width = step + '%';
        progressBar.setAttribute('aria-valuenow', String(step));
        progressBar.textContent = step + '%';
      }
    }
    refreshProgressUi();

    preForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const q1 = preForm.querySelector('input[name="q1"]:checked');
      const q2 = preForm.querySelector('input[name="q2"]:checked');
      if (!q1 || !q2) {
        preResult.innerHTML = '<div class="alert alert-warning">أجب على جميع الأسئلة.</div>';
        return;
      }
      let score = 0;
      if (q1.value === 'true') score++;
      if (q2.value === 'true') score++;
      const percent = Math.round((score / 2) * 100);
      setProgress(session.name, { preScore: percent });
      preResult.innerHTML = `<div class="alert alert-success">درجتك: ${percent}% - تم فتح المحتوى.</div>`;
      tabContentBtn.classList.remove('disabled');
      const contentTab = new bootstrap.Tab(document.querySelector('#tab-content'));
      contentTab.show();
      refreshProgressUi();
    });

    markContentDoneBtn?.addEventListener('click', () => {
      setProgress(session.name, { contentDone: true });
      submitPostQuizBtn.disabled = false;
      tabPostBtn.classList.remove('disabled');
      const postTab = new bootstrap.Tab(document.querySelector('#tab-post'));
      postTab.show();
      refreshProgressUi();
    });

    postForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitPostQuizBtn.disabled) return;
      const p1 = postForm.querySelector('input[name="p1"]:checked');
      const p2 = postForm.querySelector('input[name="p2"]:checked');
      if (!p1 || !p2) {
        postResult.innerHTML = '<div class="alert alert-warning">أجب على جميع الأسئلة.</div>';
        return;
      }
      let score = 0;
      if (p1.value === 'true') score++;
      if (p2.value === 'true') score++;
      const percent = Math.round((score / 2) * 100);
      setProgress(session.name, { postScore: percent });
      postResult.innerHTML = `<div class="alert alert-success">درجتك: ${percent}%</div>`;
      refreshProgressUi();
    });
  }

  function initDashboard() {
    const tableBody = document.querySelector('#studentsTable tbody');
    const form = document.getElementById('studentForm');
    const groupsSummary = document.getElementById('groupsSummary');
    const exportCsvBtn = document.getElementById('exportCsvBtn');
    const resetAllBtn = document.getElementById('resetAllBtn');
    const overviewStats = document.getElementById('overviewStats');
    if (!tableBody || !form) return;

    function refresh() {
      const students = readJson(storageKeys.students, []);
      const progressAll = readJson(storageKeys.progress, {});
      tableBody.innerHTML = '';
      students.forEach((s, idx) => {
        const prog = progressAll[s.name] || {};
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${s.name}</td>
          <td>${s.group}</td>
          <td>${prog.preScore ?? '-'}</td>
          <td>${prog.postScore ?? '-'}</td>
          <td><button class="btn btn-sm btn-outline-danger" data-del="${idx}">حذف</button></td>`;
        tableBody.appendChild(tr);
      });

      // مقارنة المجموعات
      const groupKeys = ['A1','A2','B1','B2'];
      const blocks = groupKeys.map(g => {
        const members = students.filter(s => s.group === g);
        const scores = members.map(m => (progressAll[m.name]?.postScore ?? null)).filter(v => typeof v === 'number');
        const avg = scores.length ? Math.round(scores.reduce((a,b)=>a+b,0)/scores.length) : '-';
        return `<div class="col-12 col-md-3"><div class="p-3 border rounded-3 h-100">
          <div class="fw-bold mb-1">المجموعة ${g}</div>
          <div class="small text-muted">عدد الطلاب: ${members.length}</div>
          <div>متوسط البعدي: ${avg}</div>
        </div></div>`;
      }).join('');
      if (groupsSummary) groupsSummary.innerHTML = blocks;

      // نظرة عامة
      if (overviewStats) {
        const preScores = Object.values(progressAll).map(p => p?.preScore).filter(v => typeof v === 'number');
        const postScores = Object.values(progressAll).map(p => p?.postScore).filter(v => typeof v === 'number');
        const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : '-';
        const improvement = (avg(postScores) !== '-' && avg(preScores) !== '-') ? (avg(postScores) - avg(preScores)) : '-';
        overviewStats.innerHTML = `
          <div class="col-12 col-md-4"><div class="p-3 border rounded-3 h-100"><div class="fw-bold">عدد الطلاب</div><div>${students.length}</div></div></div>
          <div class="col-12 col-md-4"><div class="p-3 border rounded-3 h-100"><div class="fw-bold">متوسط القبلي</div><div>${avg(preScores)}</div></div></div>
          <div class="col-12 col-md-4"><div class="p-3 border rounded-3 h-100"><div class="fw-bold">متوسط البعدي</div><div>${avg(postScores)}</div></div></div>
          <div class="col-12"><div class="p-3 border rounded-3"><div class="fw-bold">التحسن الكلي (بعدي - قبلي)</div><div>${improvement}</div></div></div>
        `;
      }
    }

    tableBody.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-del]');
      if (!btn) return;
      const index = Number(btn.getAttribute('data-del'));
      const students = readJson(storageKeys.students, []);
      const removed = students.splice(index, 1)[0];
      writeJson(storageKeys.students, students);
      // لا نحذف التقدم للحفاظ على السجل، يمكن تنظيفه لاحقًا إذا لزم
      refresh();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('studentNameInput').value.trim();
      const group = document.getElementById('studentGroupInput').value;
      if (!name || !group) return;
      ensureStudentRecord(name, group);
      form.reset();
      refresh();
    });

    exportCsvBtn?.addEventListener('click', () => {
      const students = readJson(storageKeys.students, []);
      const progressAll = readJson(storageKeys.progress, {});
      const rows = [['الاسم','المجموعة','القبلي','البعدي']]
        .concat(students.map(s => [s.name, s.group, progressAll[s.name]?.preScore ?? '', progressAll[s.name]?.postScore ?? '']));
      const csv = rows.map(r => r.map(x => `"${String(x).replace(/"/g,'""')}"`).join(',')).join('\n');
      const blob = new Blob(["\ufeff" + csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'results.csv'; a.click();
      URL.revokeObjectURL(url);
    });

    resetAllBtn?.addEventListener('click', () => {
      if (!confirm('سيتم مسح جميع الطلاب والتقدم والدرجات. هل أنت متأكد؟')) return;
      localStorage.removeItem(storageKeys.students);
      localStorage.removeItem(storageKeys.progress);
      refresh();
    });

    refresh();
  }

  // Enhanced Visual Effects with Modern Animations
  function addVisualEffects() {
    // Enhanced Button Effects
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
        this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.15)';
      });
      btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });

    // Enhanced Card Effects
    document.querySelectorAll('.card').forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.1)';
      });
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '';
      });
    });

    // Enhanced Form Effects
    document.querySelectorAll('.form-control, .form-select').forEach(input => {
      input.addEventListener('focus', function() {
        this.style.transform = 'scale(1.02)';
        this.style.borderColor = 'var(--primary)';
        this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
      });
      input.addEventListener('blur', function() {
        this.style.transform = 'scale(1)';
        this.style.borderColor = 'var(--border-color)';
        this.style.boxShadow = '';
      });
    });

    // Enhanced Navigation Effects
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        this.style.animation = 'pulse 0.5s ease-out';
        setTimeout(() => {
          this.style.animation = '';
        }, 500);
      });
    });
  }

  // Scroll-triggered Animations
  function initScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    // Observe elements for scroll animations
    document.querySelectorAll('.fade-in-on-scroll').forEach(el => {
      observer.observe(el);
    });

    document.querySelectorAll('.slide-in-left').forEach(el => {
      observer.observe(el);
    });

    document.querySelectorAll('.slide-in-right').forEach(el => {
      observer.observe(el);
    });
  }

  // Sticky Navigation Enhancement
  function initStickyNavigation() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 100) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
      
      lastScrollY = currentScrollY;
    });
  }

  // Smooth Scrolling for Navigation Links
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  // Theme management has been removed - Using unified light theme only

  // Enhanced Loading States
  function showEnhancedLoading(element, message = 'جاري التحميل...') {
    if (element) {
      element.style.opacity = '0.6';
      element.style.pointerEvents = 'none';
      
      const loadingOverlay = document.createElement('div');
      loadingOverlay.className = 'loading-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center';
      loadingOverlay.style.background = 'rgba(255,255,255,0.9)';
      loadingOverlay.style.zIndex = '1000';
      loadingOverlay.innerHTML = `
        <div class="text-center">
          <div class="spinner-border text-primary mb-2" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="small text-muted">${message}</div>
        </div>
      `;
      
      element.style.position = 'relative';
      element.appendChild(loadingOverlay);
    }
  }

  function hideEnhancedLoading(element) {
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
      const loadingOverlay = element.querySelector('.loading-overlay');
      if (loadingOverlay) {
        loadingOverlay.remove();
      }
    }
  }

  // تأثيرات التحميل
  function showLoadingEffect(element) {
    if (element) {
      element.style.opacity = '0.5';
      element.style.pointerEvents = 'none';
      const spinner = document.createElement('div');
      spinner.className = 'loading text-center';
      spinner.innerHTML = '<i class="bi bi-arrow-clockwise"></i>';
      element.appendChild(spinner);
    }
  }

  function hideLoadingEffect(element) {
    if (element) {
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
      const spinner = element.querySelector('.loading');
      if (spinner) spinner.remove();
    }
  }

  // تأثيرات النجاح والخطأ
  function showSuccessMessage(element, message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-success success-animation';
    alert.innerHTML = `<i class="bi bi-check-circle me-2"></i>${message}`;
    element.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }

  function showErrorMessage(element, message) {
    const alert = document.createElement('div');
    alert.className = 'alert alert-danger error-shake';
    alert.innerHTML = `<i class="bi bi-exclamation-triangle me-2"></i>${message}`;
    element.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
  }

  // Responsive Navigation Management
  function initResponsiveNavigation() {
    const navbar = document.querySelector('.navbar');
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
      // Enhanced mobile menu toggle with smooth animation
      navbarToggler.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const isOpen = navbarCollapse.classList.contains('show');
        
        if (isOpen) {
          // Close menu with animation
          navbarCollapse.style.maxHeight = navbarCollapse.scrollHeight + 'px';
          setTimeout(() => {
            navbarCollapse.style.maxHeight = '0px';
            setTimeout(() => {
              navbarCollapse.classList.remove('show');
              navbarCollapse.style.maxHeight = '';
              navbarToggler.setAttribute('aria-expanded', 'false');
            }, 150);
          }, 10);
        } else {
          // Open menu with animation
          navbarCollapse.classList.add('show');
          navbarToggler.setAttribute('aria-expanded', 'true');
          navbarCollapse.style.maxHeight = '0px';
          setTimeout(() => {
            navbarCollapse.style.maxHeight = navbarCollapse.scrollHeight + 'px';
            setTimeout(() => {
              navbarCollapse.style.maxHeight = '';
            }, 300);
          }, 10);
        }
      });
      
      // Close mobile menu when clicking outside
      document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navbarCollapse.classList.contains('show')) {
          navbarToggler.click();
        }
      });
      
      // Close mobile menu when clicking on nav links
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          if (navbarCollapse.classList.contains('show')) {
            navbarToggler.click();
          }
        });
      });
      
      // Handle window resize
      window.addEventListener('resize', () => {
        if (window.innerWidth > 991.98 && navbarCollapse.classList.contains('show')) {
          navbarCollapse.classList.remove('show');
          navbarCollapse.style.maxHeight = '';
          navbarToggler.setAttribute('aria-expanded', 'false');
        }
      });
    }
  }

  // Responsive Image Loading
  function initResponsiveImages() {
    // Add responsive image classes to all images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (!img.classList.contains('responsive-img') && !img.classList.contains('hero-img')) {
        img.classList.add('responsive-img');
      }
      
      // Add loading="lazy" for better performance
      if (!img.hasAttribute('loading')) {
        img.setAttribute('loading', 'lazy');
      }
    });
    
    // Handle responsive hero images
    const heroImages = document.querySelectorAll('.hero img, .hero-banner img');
    heroImages.forEach(img => {
      img.classList.add('hero-img');
    });
  }

  // Touch-friendly Interactions
  function initTouchInteractions() {
    // Add touch feedback for buttons
    document.querySelectorAll('.btn, .nav-link, .card').forEach(element => {
      element.addEventListener('touchstart', function() {
        this.style.transform = 'scale(0.98)';
      });
      
      element.addEventListener('touchend', function() {
        this.style.transform = 'scale(1)';
      });
    });
  }

  // Hero Section Animations
  function initHeroAnimations() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Add entrance animation class
    hero.classList.add('hero-loaded');

    // Animate floating elements on scroll
    const floatingElements = hero.querySelectorAll('.floating-icon');
    floatingElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.5}s`;
    });

    // Add parallax effect to floating elements
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      floatingElements.forEach((element, index) => {
        const speed = (index + 1) * 0.1;
        element.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }

  // Enhanced Button Interactions
  function initHeroButtonEffects() {
    const heroButtons = document.querySelectorAll('.btn-hero-primary, .btn-hero-secondary');
    
    heroButtons.forEach(button => {
      // Add ripple effect on click
      button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Course Card Interactions
  function initCourseCardEffects() {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach(card => {
      // Add hover sound effect (optional)
      card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      });
      
      // Add click ripple effect
      card.addEventListener('click', function(e) {
        if (this.classList.contains('course-coming-soon')) return;
        
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        ripple.style.background = 'rgba(37, 99, 235, 0.1)';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
      
      // Add focus effects for accessibility
      card.addEventListener('focus', function() {
        this.style.outline = '2px solid var(--primary)';
        this.style.outlineOffset = '2px';
      });
      
      card.addEventListener('blur', function() {
        this.style.outline = 'none';
      });
    });
  }

  // Course Progress Animation
  function animateCourseProgress() {
    const progressElements = document.querySelectorAll('.course-progress');
    
    progressElements.forEach(element => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const progressText = entry.target.textContent;
            const progressMatch = progressText.match(/(\d+)%/);
            if (progressMatch) {
              const targetProgress = parseInt(progressMatch[1]);
              animateProgressBar(entry.target, targetProgress);
            }
            observer.unobserve(entry.target);
          }
        });
      });
      
      observer.observe(element);
    });
  }

  function animateProgressBar(element, targetProgress) {
    let currentProgress = 0;
    const increment = targetProgress / 30; // 30 frames for smooth animation
    
    const interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress >= targetProgress) {
        currentProgress = targetProgress;
        clearInterval(interval);
      }
      element.textContent = element.textContent.replace(/\d+%/, Math.round(currentProgress) + '%');
    }, 50);
  }

  // Course Search and Filter System
  function initCourseSearchAndFilter() {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const durationFilter = document.getElementById('durationFilter');
    const clearFiltersBtn = document.getElementById('clearFilters');
    const resultsCount = document.getElementById('resultsCount');
    const coursesContainer = document.getElementById('coursesContainer');
    
    if (!searchInput || !coursesContainer) return;

    let allCourses = Array.from(document.querySelectorAll('.course-card'));
    let filteredCourses = [...allCourses];

    // Search functionality
    function performSearch() {
      const searchTerm = searchInput.value.toLowerCase().trim();
      const category = categoryFilter.value;
      const difficulty = difficultyFilter.value;
      const duration = durationFilter.value;

      filteredCourses = allCourses.filter(course => {
        // Search filter
        const searchText = course.dataset.searchText.toLowerCase();
        const matchesSearch = !searchTerm || searchText.includes(searchTerm);

        // Category filter
        const courseCategory = course.dataset.category;
        const matchesCategory = !category || courseCategory === category;

        // Difficulty filter
        const courseDifficulty = course.dataset.difficulty;
        const matchesDifficulty = !difficulty || courseDifficulty === difficulty;

        // Duration filter
        const courseDuration = course.dataset.durationType;
        const matchesDuration = !duration || courseDuration === duration;

        return matchesSearch && matchesCategory && matchesDifficulty && matchesDuration;
      });

      updateResults();
    }

    // Update results with animations
    function updateResults() {
      // Remove existing no-results message
      const existingNoResults = coursesContainer.querySelector('.no-results');
      if (existingNoResults) {
        existingNoResults.remove();
      }

      // Animate out filtered courses
      allCourses.forEach((course, index) => {
        const shouldShow = filteredCourses.includes(course);
        
        if (shouldShow) {
          course.classList.remove('filtered-out');
          course.classList.add('filtered-in');
          course.style.display = 'block';
        } else {
          course.classList.add('filtered-out');
          course.classList.remove('filtered-in');
          
          setTimeout(() => {
            course.style.display = 'none';
          }, 400);
        }
      });

      // Show no results message if needed
      if (filteredCourses.length === 0) {
        showNoResults();
      }

      // Update results counter
      updateResultsCounter();
    }

    // Show no results message
    function showNoResults() {
      const noResultsDiv = document.createElement('div');
      noResultsDiv.className = 'no-results';
      noResultsDiv.innerHTML = `
        <i class="bi bi-search"></i>
        <h3>لا توجد نتائج</h3>
        <p>جرب تغيير معايير البحث أو الفلترة</p>
      `;
      
      coursesContainer.appendChild(noResultsDiv);
      
      // Animate in
      setTimeout(() => {
        noResultsDiv.style.opacity = '1';
        noResultsDiv.style.transform = 'translateY(0)';
      }, 100);
    }

    // Update results counter
    function updateResultsCounter() {
      const total = allCourses.length;
      const visible = filteredCourses.length;
      
      if (visible === total) {
        resultsCount.textContent = 'عرض جميع الدورات';
      } else {
        resultsCount.textContent = `عرض ${visible} من ${total} دورة`;
      }
    }

    // Clear all filters
    function clearAllFilters() {
      searchInput.value = '';
      categoryFilter.value = '';
      difficultyFilter.value = '';
      durationFilter.value = '';
      
      filteredCourses = [...allCourses];
      updateResults();
    }

    // Highlight search terms
    function highlightSearchTerms() {
      const searchTerm = searchInput.value.trim();
      if (!searchTerm) return;

      filteredCourses.forEach(course => {
        const title = course.querySelector('.course-title');
        const description = course.querySelector('.course-description');
        
        if (title && description) {
          highlightText(title, searchTerm);
          highlightText(description, searchTerm);
        }
      });
    }

    function highlightText(element, searchTerm) {
      const text = element.textContent;
      const regex = new RegExp(`(${searchTerm})`, 'gi');
      const highlightedText = text.replace(regex, '<span class="search-highlight">$1</span>');
      element.innerHTML = highlightedText;
    }

    // Event listeners
    searchInput.addEventListener('input', debounce(performSearch, 300));
    categoryFilter.addEventListener('change', performSearch);
    difficultyFilter.addEventListener('change', performSearch);
    durationFilter.addEventListener('change', performSearch);
    clearFiltersBtn.addEventListener('click', clearAllFilters);

    // Initialize
    updateResultsCounter();
  }

  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Testimonials Carousel System
  function initTestimonialsCarousel() {
    const carousel = document.getElementById('testimonialsCarousel');
    const prevBtn = document.getElementById('testimonialPrev');
    const nextBtn = document.getElementById('testimonialNext');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!carousel || !prevBtn || !nextBtn) return;

    const cards = carousel.querySelectorAll('.testimonial-card');
    let currentIndex = 0;
    let autoSlideInterval;
    const autoSlideDelay = 5000; // 5 seconds

    // Initialize carousel
    function initCarousel() {
      showCard(0);
      startAutoSlide();
    }

    // Show specific card with animation
    function showCard(index, direction = 'next') {
      // Remove active class from all cards and indicators
      cards.forEach(card => card.classList.remove('active'));
      indicators.forEach(indicator => indicator.classList.remove('active'));

      // Add active class to current card and indicator
      if (cards[index]) {
        cards[index].classList.add('active');
        
        // Add animation class based on direction
        if (direction === 'next') {
          cards[index].style.animation = 'slideInFromRight 0.6s ease-out';
        } else {
          cards[index].style.animation = 'slideInFromLeft 0.6s ease-out';
        }
      }
      
      if (indicators[index]) {
        indicators[index].classList.add('active');
      }

      currentIndex = index;
    }

    // Go to next card
    function nextCard() {
      const nextIndex = (currentIndex + 1) % cards.length;
      showCard(nextIndex, 'next');
    }

    // Go to previous card
    function prevCard() {
      const prevIndex = currentIndex === 0 ? cards.length - 1 : currentIndex - 1;
      showCard(prevIndex, 'prev');
    }

    // Go to specific card
    function goToCard(index) {
      const direction = index > currentIndex ? 'next' : 'prev';
      showCard(index, direction);
    }

    // Start auto-slide
    function startAutoSlide() {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextCard, autoSlideDelay);
    }

    // Stop auto-slide
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
      nextCard();
      startAutoSlide(); // Restart auto-slide
    });

    prevBtn.addEventListener('click', () => {
      prevCard();
      startAutoSlide(); // Restart auto-slide
    });

    // Indicator click events
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToCard(index);
        startAutoSlide(); // Restart auto-slide
      });
    });

    // Pause auto-slide on hover
    carousel.addEventListener('mouseenter', stopAutoSlide);
    carousel.addEventListener('mouseleave', startAutoSlide);

    // Touch/swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    });

    function handleSwipe() {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swipe left - next card
          nextCard();
        } else {
          // Swipe right - previous card
          prevCard();
        }
        startAutoSlide();
      }
    }

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (carousel.closest('.testimonials-section').matches(':hover') || 
          document.activeElement === prevBtn || 
          document.activeElement === nextBtn) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          prevCard();
          startAutoSlide();
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          nextCard();
          startAutoSlide();
        }
      }
    });

    // Intersection Observer for auto-play when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoSlide();
        } else {
          stopAutoSlide();
        }
      });
    }, { threshold: 0.5 });

    observer.observe(carousel);

    // Initialize carousel
    initCarousel();
  }

  // Statistics Counter Animation System
  function initStatisticsCounters() {
    const statCards = document.querySelectorAll('.stat-card');
    const counters = document.querySelectorAll('.counter');
    
    if (!statCards.length || !counters.length) return;

    // Intersection Observer for scroll-triggered animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const counter = card.querySelector('.counter');
          
          if (counter && !card.classList.contains('animated')) {
            animateCounter(counter);
            card.classList.add('animated', 'animate-in');
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -50px 0px'
    });

    // Observe all stat cards
    statCards.forEach(card => {
      observer.observe(card);
    });

    // Animate counter function
    function animateCounter(counterElement) {
      const target = parseInt(counterElement.dataset.target);
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        
        // Format number with commas for large numbers
        counterElement.textContent = Math.floor(current).toLocaleString('ar-EG');
      }, 16);
    }

    // Add hover effects to stat cards
    statCards.forEach(card => {
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
      });
    });

    // Add click effects for interactive feedback
    statCards.forEach(card => {
      card.addEventListener('click', function() {
        // Add ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        ripple.style.background = 'rgba(37, 99, 235, 0.1)';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
          ripple.remove();
        }, 600);
      });
    });
  }

  // Enhanced Statistics with Real-time Updates
  function initStatisticsEnhancements() {
    const statCards = document.querySelectorAll('.stat-card');
    
    // Add loading states
    statCards.forEach(card => {
      card.classList.add('loading');
      
      // Simulate data loading
      setTimeout(() => {
        card.classList.remove('loading');
        card.classList.add('success');
      }, Math.random() * 1000 + 500);
    });

    // Add periodic updates for dynamic feel
    setInterval(() => {
      const randomCard = statCards[Math.floor(Math.random() * statCards.length)];
      if (randomCard && randomCard.classList.contains('animated')) {
        // Add subtle pulse animation
        randomCard.style.animation = 'pulse 0.6s ease-in-out';
        setTimeout(() => {
          randomCard.style.animation = '';
        }, 600);
      }
    }, 10000); // Every 10 seconds
  }

  // Contact Form System
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const messageCounter = document.getElementById('messageCounter');
    const messageField = document.getElementById('contactMessage');
    const successModal = new bootstrap.Modal(document.getElementById('successModal'));
    
    if (!form || !submitBtn) return;

    // Real-time validation
    const fields = {
      name: {
        element: document.getElementById('contactName'),
        validator: (value) => value.trim().length >= 2,
        message: 'يجب أن يكون الاسم حرفين على الأقل'
      },
      email: {
        element: document.getElementById('contactEmail'),
        validator: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'يرجى إدخال بريد إلكتروني صحيح'
      },
      message: {
        element: document.getElementById('contactMessage'),
        validator: (value) => value.trim().length >= 10,
        message: 'يجب أن تكون الرسالة 10 أحرف على الأقل'
      }
    };

    // Message counter
    if (messageField && messageCounter) {
      messageField.addEventListener('input', function() {
        const length = this.value.length;
        messageCounter.textContent = length;
        
        if (length > 800) {
          messageCounter.style.color = '#ef4444';
        } else if (length > 600) {
          messageCounter.style.color = '#f59e0b';
        } else {
          messageCounter.style.color = 'var(--primary)';
        }
      });
    }

    // Real-time validation for each field
    Object.keys(fields).forEach(fieldName => {
      const field = fields[fieldName];
      if (!field.element) return;

      field.element.addEventListener('blur', function() {
        validateField(fieldName, field);
      });

      field.element.addEventListener('input', function() {
        if (this.classList.contains('is-invalid')) {
          validateField(fieldName, field);
        }
      });
    });

    // Field validation function
    function validateField(fieldName, field) {
      const value = field.element.value.trim();
      const isValid = field.validator(value);
      
      if (isValid) {
        field.element.classList.remove('is-invalid');
        field.element.classList.add('is-valid');
        showSuccessMessage(field.element);
      } else {
        field.element.classList.remove('is-valid');
        field.element.classList.add('is-invalid');
        showErrorMessage(field.element, field.message);
      }
      
      return isValid;
    }

    // Show success message
    function showSuccessMessage(element) {
      const feedback = element.parentNode.querySelector('.valid-feedback');
      if (feedback) {
        feedback.style.display = 'block';
        feedback.style.animation = 'slideInUp 0.3s ease-out';
      }
    }

    // Show error message
    function showErrorMessage(element, message) {
      const feedback = element.parentNode.querySelector('.invalid-feedback');
      if (feedback) {
        feedback.textContent = message;
        feedback.style.display = 'block';
        feedback.style.animation = 'slideInUp 0.3s ease-out';
      }
      
      // Add shake animation
      element.style.animation = 'shake 0.5s ease-in-out';
      setTimeout(() => {
        element.style.animation = '';
      }, 500);
    }

    // Hide feedback messages
    function hideFeedback(element) {
      const validFeedback = element.parentNode.querySelector('.valid-feedback');
      const invalidFeedback = element.parentNode.querySelector('.invalid-feedback');
      
      if (validFeedback) validFeedback.style.display = 'none';
      if (invalidFeedback) invalidFeedback.style.display = 'none';
    }

    // Form submission
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Validate all fields
      let isFormValid = true;
      Object.keys(fields).forEach(fieldName => {
        const field = fields[fieldName];
        if (!validateField(fieldName, field)) {
          isFormValid = false;
        }
      });

      if (!isFormValid) {
        // Focus on first invalid field
        const firstInvalid = form.querySelector('.is-invalid');
        if (firstInvalid) {
          firstInvalid.focus();
          firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Show loading state
      showLoadingState();
      
      // Simulate form submission
      setTimeout(() => {
        hideLoadingState();
        showSuccessModal();
        resetForm();
      }, 2000);
    });

    // Show loading state
    function showLoadingState() {
      submitBtn.disabled = true;
      submitBtn.querySelector('.btn-text').classList.add('d-none');
      submitBtn.querySelector('.btn-loading').classList.remove('d-none');
      form.classList.add('loading');
    }

    // Hide loading state
    function hideLoadingState() {
      submitBtn.disabled = false;
      submitBtn.querySelector('.btn-text').classList.remove('d-none');
      submitBtn.querySelector('.btn-loading').classList.add('d-none');
      form.classList.remove('loading');
    }

    // Show success modal
    function showSuccessModal() {
      successModal.show();
    }

    // Reset form
    function resetForm() {
      form.reset();
      messageCounter.textContent = '0';
      messageCounter.style.color = 'var(--primary)';
      
      // Remove validation classes
      Object.values(fields).forEach(field => {
        if (field.element) {
          field.element.classList.remove('is-valid', 'is-invalid');
          hideFeedback(field.element);
        }
      });
      
      form.classList.remove('error', 'success');
    }

    // Add form animations
    const formGroups = form.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      group.style.animationDelay = `${index * 0.1}s`;
      group.classList.add('fade-in-on-scroll');
    });
  }

  // Sequential Access System
  function initSequentialAccess() {
    const firstCourseBtn = document.getElementById('firstCourseBtn');
    const nextButton = document.getElementById('nextButton');
    const lockedCourses = document.querySelectorAll('.course-locked, .course-coming-soon');
    
    if (firstCourseBtn) {
      firstCourseBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Mark first course as completed
        localStorage.setItem('course1_completed', 'true');
        updateProgress();
        // Enable next button
        if (nextButton) {
          nextButton.disabled = false;
          nextButton.innerHTML = '<i class="bi bi-arrow-left me-2"></i>التالي: الدرس الأول';
        }
        // Redirect to lesson
        window.location.href = 'lesson1.html';
      });
    }
    
    // Disable locked courses
    lockedCourses.forEach(course => {
      const btn = course.querySelector('button');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="bi bi-lock me-2"></i>مقفل - أكمل الدرس السابق';
      }
    });
  }

  // Progress Tracking System
  function initProgressTracking() {
    updateProgress();
  }

  function updateProgress() {
    const progressBar = document.getElementById('learningProgress');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    if (!progressBar || !progressPercentage) return;
    
    let completedCourses = 0;
    const totalCourses = 4; // Total number of courses
    
    // Check completed courses
    for (let i = 1; i <= totalCourses; i++) {
      if (localStorage.getItem(`course${i}_completed`)) {
        completedCourses++;
      }
    }
    
    const progress = (completedCourses / totalCourses) * 100;
    progressBar.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
    
    // Update course cards based on progress
    updateCourseCards(completedCourses);
  }

  function updateCourseCards(completedCourses) {
    const courseCards = document.querySelectorAll('.course-card');
    
    courseCards.forEach((card, index) => {
      if (index === 0) {
        // First course is always available
        return;
      }
      
      if (index <= completedCourses) {
        // Course is unlocked
        card.classList.remove('course-locked', 'course-coming-soon');
        card.classList.add('course-available');
        const btn = card.querySelector('button');
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i class="bi bi-play-circle me-2"></i>ابدأ التعلم الآن';
        }
      } else {
        // Course is locked
        card.classList.add('course-locked');
        const btn = card.querySelector('button');
        if (btn) {
          btn.disabled = true;
          btn.innerHTML = '<i class="bi bi-lock me-2"></i>مقفل - أكمل الدرس السابق';
        }
      }
    });
  }

  // Access Control System
  function checkAccess(userType, pageType) {
    const currentUserType = localStorage.getItem('userType');
    
    if (!currentUserType) {
      // No user logged in
      return false;
    }
    
    if (pageType === 'admin' && currentUserType !== 'admin') {
      // Non-admin trying to access admin page
      return false;
    }
    
    if (pageType === 'student' && currentUserType !== 'student') {
      // Non-student trying to access student page
      return false;
    }
    
    return true;
  }
  
  function redirectToLogin() {
    window.location.href = 'login.html';
  }
  
  function requireStudentLogin() {
    if (!checkAccess('student', 'student')) {
      redirectToLogin();
      return false;
    }
    return true;
  }
  
  function requireAdminLogin() {
    if (!checkAccess('admin', 'admin')) {
      redirectToLogin();
      return false;
    }
    return true;
  }
  
  // Login System
  function initLoginSystem() {
    const loginForm = document.getElementById('loginForm');
    const googleSignIn = document.getElementById('googleSignIn');
    const studentListSection = document.getElementById('studentListSection');
    
    if (loginForm) {
      loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin();
      });
    }
    
    if (googleSignIn) {
      googleSignIn.addEventListener('click', function() {
        handleGoogleSignIn();
      });
    }
    
    // Show student list for admin
    if (studentListSection) {
      showStudentList();
    }
    
  }

  function handleLogin() {
    const studentName = document.getElementById('studentName').value;
    const password = document.getElementById('studentPassword').value;
    const group = document.getElementById('groupSelect').value;
    
    if (!studentName || !password || !group) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    // Store student data
    const studentData = {
      name: studentName,
      group: group,
      loginTime: new Date().toLocaleString('ar-SA'),
      status: 'نشط'
    };
    
    localStorage.setItem('currentStudent', JSON.stringify(studentData));
    
    // Add to student list
    addStudentToList(studentData);
    
    
    // Redirect to goals page
    window.location.href = 'goals.html';
  }

  function handleGoogleSignIn() {
    // Simulate Google sign-in
    alert('تسجيل الدخول عبر Google (محاكاة)');
    
    const studentData = {
      name: 'طالب Google',
      group: 'A1',
      loginTime: new Date().toLocaleString('ar-SA'),
      status: 'نشط'
    };
    
    localStorage.setItem('currentStudent', JSON.stringify(studentData));
    addStudentToList(studentData);
    
    window.location.href = 'goals.html';
  }

  function addStudentToList(studentData) {
    const studentListBody = document.getElementById('studentListBody');
    if (!studentListBody) return;
    
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${studentData.name}</td>
      <td>${studentData.group}</td>
      <td>${studentData.loginTime}</td>
      <td><span class="badge bg-success">${studentData.status}</span></td>
    `;
    
    studentListBody.appendChild(row);
  }

  function showStudentList() {
    const studentListSection = document.getElementById('studentListSection');
    if (studentListSection) {
      studentListSection.style.display = 'block';
    }
  }

  // Dashboard System
  function initDashboard() {
    if (window.pageId !== 'dashboard') return;

    // Check admin authentication
    if (!requireAdminLogin()) {
      return;
    }

    // Add fade-in animation
    document.body.classList.add('dashboard-loaded');

    initDashboardData();
    initStudentManagement();
    initCharts();
    initExportFunctionality();
    initDashboardFilters();
    initLogoutFunctionality();
  }

  function checkAdminAuth() {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }

  function initLogoutFunctionality() {
    const logoutBtn = document.getElementById('logoutBtn');
    
    function handleLogout() {
      if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // Clear all session data for both students and admin
        localStorage.removeItem('currentUser');
        localStorage.removeItem('userType');
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminRememberMe');
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('mnle_session');
        localStorage.removeItem('mnle_students');
        localStorage.removeItem('mnle_progress');

        // Show logout animation
        if (logoutBtn) {
          logoutBtn.innerHTML = '<i class="bi bi-hourglass-split me-1"></i>جاري تسجيل الخروج...';
          logoutBtn.disabled = true;
        }

        setTimeout(() => {
          // Redirect based on current page
          if (window.location.pathname.includes('dashboard.html')) {
            window.location.href = 'admin-login.html';
          } else {
            window.location.href = 'login.html';
          }
        }, 1000);
      }
    }

    if (logoutBtn) {
      logoutBtn.addEventListener('click', handleLogout);
    }
  }


  function initDashboardData() {
    // Load sample data if none exists
    if (!localStorage.getItem('dashboardStudents')) {
      const sampleStudents = generateSampleData();
      localStorage.setItem('dashboardStudents', JSON.stringify(sampleStudents));
    }
    
    updateDashboardStats();
    loadStudentsTable();
    generateGroupPerformanceCards();
  }

  function generateSampleData() {
    const groups = ['A1', 'A2', 'B1', 'B2'];
    const students = [];
    
    for (let i = 1; i <= 20; i++) {
      const group = groups[Math.floor(Math.random() * groups.length)];
      const preTestScore = Math.floor(Math.random() * 40) + 30; // 30-70
      const postTestScore = Math.floor(Math.random() * 30) + preTestScore; // Improvement
      const lastLogin = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);
      
      students.push({
        id: i,
        name: `طالب ${i}`,
        group: group,
        email: `student${i}@example.com`,
        preTestScore: preTestScore,
        postTestScore: Math.min(postTestScore, 100),
        lastLogin: lastLogin.toISOString(),
        status: Math.random() > 0.2 ? 'active' : 'inactive',
        progress: Math.floor(Math.random() * 100),
        lessonsCompleted: Math.floor(Math.random() * 4)
      });
    }
    
    return students;
  }

  function updateDashboardStats() {
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    
    const totalStudents = students.length;
    const activeStudents = students.filter(s => s.status === 'active').length;
    const completedLessons = students.reduce((sum, s) => sum + s.lessonsCompleted, 0);
    const averageScore = students.length > 0 ? 
      Math.round(students.reduce((sum, s) => sum + s.postTestScore, 0) / students.length) : 0;
    
    document.getElementById('totalStudents').textContent = totalStudents;
    document.getElementById('activeStudents').textContent = activeStudents;
    document.getElementById('completedLessons').textContent = completedLessons;
    document.getElementById('averageScore').textContent = averageScore + '%';
    
    // Animate numbers
    animateNumbers();
  }

  function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(element => {
      const finalValue = parseInt(element.textContent);
      animateNumber(element, 0, finalValue, 1000);
    });
  }

  function animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    
    function updateNumber(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      
      element.textContent = current + (element.textContent.includes('%') ? '%' : '');
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      }
    }
    
    requestAnimationFrame(updateNumber);
  }

  function initStudentManagement() {
    const addStudentBtn = document.getElementById('saveStudentBtn');
    const updateStudentBtn = document.getElementById('updateStudentBtn');
    const studentSearch = document.getElementById('studentSearch');
    const groupFilter = document.getElementById('groupFilter');
    const statusFilter = document.getElementById('statusFilter');
    const clearFilters = document.getElementById('clearFilters');
    
    if (addStudentBtn) {
      addStudentBtn.addEventListener('click', addNewStudent);
    }
    
    if (updateStudentBtn) {
      updateStudentBtn.addEventListener('click', updateStudent);
    }
    
    if (studentSearch) {
      studentSearch.addEventListener('input', debounce(filterStudents, 300));
    }
    
    if (groupFilter) {
      groupFilter.addEventListener('change', filterStudents);
    }
    
    if (statusFilter) {
      statusFilter.addEventListener('change', filterStudents);
    }
    
    if (clearFilters) {
      clearFilters.addEventListener('click', clearAllFilters);
    }
  }

  function addNewStudent() {
    const name = document.getElementById('newStudentName').value;
    const group = document.getElementById('newStudentGroup').value;
    const email = document.getElementById('newStudentEmail').value;
    
    if (!name || !group) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const newStudent = {
      id: Date.now(),
      name: name,
      group: group,
      email: email,
      preTestScore: 0,
      postTestScore: 0,
      lastLogin: new Date().toISOString(),
      status: 'active',
      progress: 0,
      lessonsCompleted: 0
    };
    
    students.push(newStudent);
    localStorage.setItem('dashboardStudents', JSON.stringify(students));
    
    // Close modal and refresh
    bootstrap.Modal.getInstance(document.getElementById('addStudentModal')).hide();
    document.getElementById('addStudentForm').reset();
    loadStudentsTable();
    updateDashboardStats();
    
    showNotification('تم إضافة الطالب بنجاح', 'success');
  }

  function updateStudent() {
    const id = parseInt(document.getElementById('editStudentId').value);
    const name = document.getElementById('editStudentName').value;
    const group = document.getElementById('editStudentGroup').value;
    const email = document.getElementById('editStudentEmail').value;
    
    if (!name || !group) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }
    
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const studentIndex = students.findIndex(s => s.id === id);
    
    if (studentIndex !== -1) {
      students[studentIndex] = {
        ...students[studentIndex],
        name: name,
        group: group,
        email: email
      };
      
      localStorage.setItem('dashboardStudents', JSON.stringify(students));
      
      // Close modal and refresh
      bootstrap.Modal.getInstance(document.getElementById('editStudentModal')).hide();
      loadStudentsTable();
      updateDashboardStats();
      
      showNotification('تم تحديث بيانات الطالب بنجاح', 'success');
    }
  }

  function loadStudentsTable(page = 1, searchTerm = '', groupFilter = '', statusFilter = '') {
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    let filteredStudents = students;
    
    // Apply filters
    if (searchTerm) {
      filteredStudents = filteredStudents.filter(s => 
        s.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (groupFilter) {
      filteredStudents = filteredStudents.filter(s => s.group === groupFilter);
    }
    
    if (statusFilter) {
      filteredStudents = filteredStudents.filter(s => s.status === statusFilter);
    }
    
    // Pagination
    const itemsPerPage = 10;
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedStudents = filteredStudents.slice(startIndex, endIndex);
    
    // Render table
    const tbody = document.getElementById('studentsTableBody');
    if (tbody) {
      tbody.innerHTML = paginatedStudents.map(student => `
        <tr>
          <td>${student.name}</td>
          <td><span class="badge bg-info">${student.group}</span></td>
          <td>${formatDate(student.lastLogin)}</td>
          <td>${student.preTestScore}%</td>
          <td>${student.postTestScore}%</td>
          <td>
            <div class="progress" style="height: 8px;">
              <div class="progress-bar" style="width: ${student.progress}%"></div>
            </div>
            <small class="text-muted">${student.progress}%</small>
          </td>
          <td>
            <span class="badge ${student.status === 'active' ? 'bg-success' : 'bg-warning'}">
              ${student.status === 'active' ? 'نشط' : 'غير نشط'}
            </span>
          </td>
          <td>
            <div class="btn-group" role="group">
              <button class="btn btn-outline-primary btn-sm btn-action" onclick="editStudent(${student.id})">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-outline-danger btn-sm btn-action" onclick="deleteStudent(${student.id})">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </td>
        </tr>
      `).join('');
    }
    
    // Render pagination
    renderPagination(filteredStudents.length, itemsPerPage, page);
  }

  function renderPagination(totalItems, itemsPerPage, currentPage) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const pagination = document.getElementById('studentsPagination');
    
    if (!pagination || totalPages <= 1) {
      if (pagination) pagination.innerHTML = '';
      return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
      <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="loadStudentsTable(${currentPage - 1})">السابق</a>
      </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
        paginationHTML += `
          <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="loadStudentsTable(${i})">${i}</a>
          </li>
        `;
      } else if (i === currentPage - 3 || i === currentPage + 3) {
        paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
      }
    }
    
    // Next button
    paginationHTML += `
      <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
        <a class="page-link" href="#" onclick="loadStudentsTable(${currentPage + 1})">التالي</a>
      </li>
    `;
    
    pagination.innerHTML = paginationHTML;
  }

  function filterStudents() {
    const searchTerm = document.getElementById('studentSearch')?.value || '';
    const groupFilter = document.getElementById('groupFilter')?.value || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    
    loadStudentsTable(1, searchTerm, groupFilter, statusFilter);
  }

  function clearAllFilters() {
    document.getElementById('studentSearch').value = '';
    document.getElementById('groupFilter').value = '';
    document.getElementById('statusFilter').value = '';
    loadStudentsTable();
  }

  function editStudent(id) {
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const student = students.find(s => s.id === id);
    
    if (student) {
      document.getElementById('editStudentId').value = student.id;
      document.getElementById('editStudentName').value = student.name;
      document.getElementById('editStudentGroup').value = student.group;
      document.getElementById('editStudentEmail').value = student.email || '';
      
      new bootstrap.Modal(document.getElementById('editStudentModal')).show();
    }
  }

  function deleteStudent(id) {
    if (confirm('هل أنت متأكد من حذف هذا الطالب؟')) {
      const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
      const filteredStudents = students.filter(s => s.id !== id);
      
      localStorage.setItem('dashboardStudents', JSON.stringify(filteredStudents));
      loadStudentsTable();
      updateDashboardStats();
      
      showNotification('تم حذف الطالب بنجاح', 'success');
    }
  }

  function initCharts() {
    setTimeout(() => {
      initGroupComparisonChart();
      initScoreDistributionChart();
    }, 500);
  }

  function initGroupComparisonChart() {
    const ctx = document.getElementById('groupComparisonChart');
    if (!ctx) return;
    
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const groups = ['A1', 'A2', 'B1', 'B2'];
    
    const groupData = groups.map(group => {
      const groupStudents = students.filter(s => s.group === group);
      const avgScore = groupStudents.length > 0 ? 
        groupStudents.reduce((sum, s) => sum + s.postTestScore, 0) / groupStudents.length : 0;
      return Math.round(avgScore);
    });
    
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['A1', 'A2', 'B1', 'B2'],
        datasets: [{
          label: 'متوسط النتائج',
          data: groupData,
          backgroundColor: [
            'rgba(37, 99, 235, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderColor: [
            'rgba(37, 99, 235, 1)',
            'rgba(16, 185, 129, 1)',
            'rgba(251, 191, 36, 1)',
            'rgba(139, 92, 246, 1)'
          ],
          borderWidth: 2,
          borderRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            ticks: {
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }
    });
  }

  function initScoreDistributionChart() {
    const ctx = document.getElementById('scoreDistributionChart');
    if (!ctx) return;
    
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const scoreRanges = [
      { label: '0-20%', min: 0, max: 20, count: 0 },
      { label: '21-40%', min: 21, max: 40, count: 0 },
      { label: '41-60%', min: 41, max: 60, count: 0 },
      { label: '61-80%', min: 61, max: 80, count: 0 },
      { label: '81-100%', min: 81, max: 100, count: 0 }
    ];
    
    students.forEach(student => {
      const score = student.postTestScore;
      scoreRanges.forEach(range => {
        if (score >= range.min && score <= range.max) {
          range.count++;
        }
      });
    });
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: scoreRanges.map(r => r.label),
        datasets: [{
          data: scoreRanges.map(r => r.count),
          backgroundColor: [
            'rgba(239, 68, 68, 0.8)',
            'rgba(251, 191, 36, 0.8)',
            'rgba(37, 99, 235, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)'
          ],
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  }

  function generateGroupPerformanceCards() {
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    const groups = ['A1', 'A2', 'B1', 'B2'];
    const container = document.getElementById('groupPerformanceCards');
    
    if (!container) return;
    
    container.innerHTML = groups.map(group => {
      const groupStudents = students.filter(s => s.group === group);
      const avgScore = groupStudents.length > 0 ? 
        Math.round(groupStudents.reduce((sum, s) => sum + s.postTestScore, 0) / groupStudents.length) : 0;
      const completedLessons = groupStudents.reduce((sum, s) => sum + s.lessonsCompleted, 0);
      const activeStudents = groupStudents.filter(s => s.status === 'active').length;
      
      return `
        <div class="col-12 col-md-6 col-lg-3">
          <div class="group-performance-card ${group}">
            <h6 class="group-title">المجموعة ${group}</h6>
            <div class="group-stats">
              <div class="group-stat">
                <div class="group-stat-number">${avgScore}%</div>
                <div class="group-stat-label">متوسط النتائج</div>
              </div>
              <div class="group-stat">
                <div class="group-stat-number">${groupStudents.length}</div>
                <div class="group-stat-label">عدد الطلاب</div>
              </div>
              <div class="group-stat">
                <div class="group-stat-number">${completedLessons}</div>
                <div class="group-stat-label">دروس مكتملة</div>
              </div>
              <div class="group-stat">
                <div class="group-stat-number">${activeStudents}</div>
                <div class="group-stat-label">طلاب نشطين</div>
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  function initExportFunctionality() {
    const exportBtn = document.getElementById('exportReport');
    if (exportBtn) {
      exportBtn.addEventListener('click', exportToCSV);
    }
  }

  function exportToCSV() {
    const students = JSON.parse(localStorage.getItem('dashboardStudents') || '[]');
    
    const csvContent = [
      ['الاسم', 'المجموعة', 'البريد الإلكتروني', 'الاختبار القبلي', 'الاختبار البعدي', 'التقدم', 'الحالة', 'آخر دخول'],
      ...students.map(student => [
        student.name,
        student.group,
        student.email || '',
        student.preTestScore + '%',
        student.postTestScore + '%',
        student.progress + '%',
        student.status === 'active' ? 'نشط' : 'غير نشط',
        formatDate(student.lastLogin)
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `students_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('تم تصدير التقرير بنجاح', 'success');
  }

  function initDashboardFilters() {
    const refreshBtn = document.getElementById('refreshData');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        loadStudentsTable();
        updateDashboardStats();
        generateGroupPerformanceCards();
        initCharts();
        showNotification('تم تحديث البيانات', 'info');
      });
    }
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'success' ? 'success' : type === 'error' ? 'danger' : 'info'} alert-dismissible fade show position-fixed`;
    notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notification.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 3000);
  }

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Page Access Control
  function checkPageAccess() {
    const currentPath = window.location.pathname;
    const currentUserType = localStorage.getItem('userType');
    
    // Public pages (no login required)
    const publicPages = ['index.html', 'contact.html', 'instructions.html', 'goals.html', 'login.html', 'admin-login.html'];
    const currentPage = currentPath.split('/').pop();
    
    if (publicPages.includes(currentPage)) {
      return; // Allow access to public pages
    }
    
    // Protected pages
    if (currentPage === 'dashboard.html' || currentPage === 'dashboard') {
      if (!currentUserType || currentUserType !== 'admin') {
        window.location.href = 'login.html';
        return;
      }
    }
    
    if (currentPage === 'student-home.html' || currentPage === 'student-home') {
      if (!currentUserType || currentUserType !== 'student') {
        window.location.href = 'login.html';
        return;
      }
    }
    
    // Lesson pages require student login
    if (currentPage === 'lesson1.html' || currentPage === 'lesson2.html' || currentPage === 'lesson3.html') {
      if (!currentUserType || currentUserType !== 'student') {
        window.location.href = 'login.html';
        return;
      }
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Check page access first
    checkPageAccess();
    
    updateAuthUI();
    addVisualEffects();
    forceBrandVisibility();
    initScrollAnimations();
    initStickyNavigation();
    initSmoothScrolling();
    // initThemeToggle(); // Disabled - using light-only theme
    initResponsiveNavigation();
    initResponsiveImages();
    initTouchInteractions();
    initHeroAnimations();
    initHeroButtonEffects();
    initCourseCardEffects();
    animateCourseProgress();
    initCourseSearchAndFilter();
    initTestimonialsCarousel();
    initStatisticsCounters();
    initStatisticsEnhancements();
    initContactForm();
    initSequentialAccess();
    initProgressTracking();
    initLoginSystem();
    forceBrandVisibility();
    initLogoutFunctionality();
    
    const page = window.pageId;
    if (page === 'login') initLoginPage();
    if (page === 'lesson1') initLesson1Page();
    if (page === 'dashboard') initDashboard();
  });

  // Ensure a single brand title in the navbar (no injected duplicates)
  function forceBrandVisibility() {
    const existingBrand = document.querySelector(
      '.navbar-kids .navbar-brand-text, .navbar .navbar-brand-text, .navbar-brand-text, .navbar-brand'
    );

    // Remove legacy injected white-box brand duplicates
    document.querySelectorAll('.site-name-container').forEach((duplicate) => {
      duplicate.remove();
    });

    if (existingBrand) {
      if (!existingBrand.textContent || existingBrand.textContent.trim() === '') {
        existingBrand.textContent = 'بيئة التعلم النقال';
      }
      return;
    }

    // Only create a brand if the navbar exists and has no brand at all
    const navbar = document.querySelector('.navbar .container');
    if (!navbar) return;

    const brandContainer = document.createElement('div');
    brandContainer.className = 'navbar-brand-container';

    const brandText = document.createElement('a');
    brandText.href = 'index.html';
    brandText.className = 'navbar-brand-text';
    brandText.textContent = 'بيئة التعلم النقال';

    brandContainer.appendChild(brandText);
    navbar.insertBefore(brandContainer, navbar.firstChild);
  }
})();
