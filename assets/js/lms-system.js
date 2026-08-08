/**
 * LMS System - نظام إدارة التعلم المحلي
 * Local Learning Management System
 */

// النظام الأساسي للبيانات
const LMS_CONFIG = {
  storageKeys: {
    selectedGroup: 'lms_selectedGroup',
    groupCounters: 'lms_groupCounters',
    studentSessions: 'lms_studentSessions',
    adminSettings: 'lms_adminSettings'
  },
  groups: {
    group1: {
      id: 'group1',
      name: 'المجموعة الأولى',
      subtitle: 'أساسيات التكنولوجيا والتعلم الرقمي',
      color: '#478559',
      icon: 'bi-1-circle-fill',
      description: 'مجموعة مخصصة لتعلم أساسيات التكنولوجيا والحاسوب',
      delightexUrl: 'https://edu.delightex.com/BMY-LKB',
      instructions: 'عزيزي الطالب، هذه المجموعة مسؤولة عن دراسة المفاهيم الأساسية للدرس، قم بقراءة التعليمات بدقة قبل البدء.',
      objectives: [
        'فهم المكونات الأساسية للحاسوب',
        'التعرف على أنظمة التشغيل الشائعة',
        'استخدام أدوات البحث الرقمي بفعالية'
      ]
    },
    group2: {
      id: 'group2',
      name: 'المجموعة الثانية',
      subtitle: 'المهارات التحليلية وحل المشكلات',
      color: '#f95d9b',
      icon: 'bi-2-circle-fill',
      description: 'مجموعة تركز على تطوير مهارات التفكير النقدي والتحليلي',
      delightexUrl: 'https://edu.delightex.com/MMY-QDC',
      instructions: 'مرحباً بك في المجموعة الثانية! هنا ستركز على تطوير مهاراتك التحليلية وتطبيقها في حل المشكلات البرمجية.',
      objectives: [
        'تحليل المشكلات وتصميم الحلول',
        'كتابة أكواد برمجية بسيطة بلغة بايثون',
        'فهم أساسيات الخوارزميات'
      ]
    },
    group3: {
      id: 'group3',
      name: 'المجموعة الثالثة',
      subtitle: 'التكنولوجيا المتقدمة والإبداع',
      color: '#39a0ca',
      icon: 'bi-3-circle-fill',
      description: 'مجموعة مخصصة للطلاب المهتمين بالتكنولوجيا المتقدمة والبرمجة',
      delightexUrl: 'https://edu.delightex.com/KAT-GVK',
      instructions: 'في هذه المجموعة المتقدمة، ستتعمق في عالم الذكاء الاصطناعي وتطبيقاته الحديثة. استعد للتحدي!',
      objectives: [
        'التعرف على مفاهيم الذكاء الاصطناعي وتعلم الآلة',
        'فهم تطبيقات الذكاء الاصطناعي في الحياة اليومية',
        'بناء نماذج بسيطة للتعلم الآلي'
      ]
    },
    group4: {
      id: 'group4',
      name: 'المجموعة الرابعة',
      subtitle: 'التطبيق العملي والمشاريع المتقدمة',
      color: '#9df9ef',
      icon: 'bi-4-circle-fill',
      description: 'مجموعة متقدمة تركز على التطبيق العملي وإدارة المشاريع',
      delightexUrl: 'https://edu.delightex.com/PDC-JLP',
      instructions: 'المجموعة الرابعة هي محطة التطبيق العملي! ستعمل على مشاريع جماعية لتطبيق كل ما تعلمته. التعاون هو مفتاح النجاح.',
      objectives: [
        'تطبيق المعرفة النظرية في مشاريع عملية',
        'تطوير مهارات العمل الجماعي والتواصل',
        'تقديم حلول مبتكرة لمشكلات واقعية'
      ]
    }
  }
};

/**
 * LMS Manager Class - فئة إدارة النظام
 */
class LMSManager {
  constructor() {
    this.initializeStorage();
    this.setupEventListeners();
  }

  /**
   * تهيئة التخزين المحلي
   */
  initializeStorage() {
    // تهيئة عدادات المجموعات
    if (!localStorage.getItem(LMS_CONFIG.storageKeys.groupCounters)) {
      const initialCounters = {
        group1: 0,
        group2: 0,
        group3: 0,
        group4: 0,
        total: 0
      };
      localStorage.setItem(LMS_CONFIG.storageKeys.groupCounters, JSON.stringify(initialCounters));
    }

    // تهيئة جلسات الطلاب
    if (!localStorage.getItem(LMS_CONFIG.storageKeys.studentSessions)) {
      localStorage.setItem(LMS_CONFIG.storageKeys.studentSessions, JSON.stringify([]));
    }

    // تهيئة إعدادات الإدارة
    if (!localStorage.getItem(LMS_CONFIG.storageKeys.adminSettings)) {
      const initialSettings = {
        allowGroupSwitch: true,
        showWelcomeMessage: true,
        lastResetDate: null
      };
      localStorage.setItem(LMS_CONFIG.storageKeys.adminSettings, JSON.stringify(initialSettings));
    }
  }

  /**
   * التحقق من تسجيل دخول الطالب
   * @returns {boolean} - true إذا كان مسجل، false إذا لم يكن
   */
  isStudentLoggedIn() {
    const selectedGroup = localStorage.getItem(LMS_CONFIG.storageKeys.selectedGroup);
    return selectedGroup && LMS_CONFIG.groups[selectedGroup];
  }

  /**
   * الحصول على المجموعة المسجل بها الطالب
   * @returns {object|null} - بيانات المجموعة أو null
   */
  getCurrentGroup() {
    const selectedGroup = localStorage.getItem(LMS_CONFIG.storageKeys.selectedGroup);
    return selectedGroup ? LMS_CONFIG.groups[selectedGroup] : null;
  }

  /**
   * إعادة توجيه الطالب لصفحة تسجيل الدخول
   */
  redirectToLogin() {
    window.location.href = 'login.html';
  }

  /**
   * فحص المصادقة وحماية المحتوى
   * @param {string} pageType - نوع الصفحة ('lesson', 'content', 'quiz')
   */
  checkAuthentication(pageType = 'content') {
    if (!this.isStudentLoggedIn()) {
      alert('يجب تسجيل الدخول أولاً لاستخدام هذه الصفحة');
      this.redirectToLogin();
      return false;
    }
    return true;
  }

  /**
   * تسجيل دخول الطالب لمجموعة
   * @param {string} groupId - معرف المجموعة
   */
  loginToGroup(groupId) {
    if (!LMS_CONFIG.groups[groupId]) {
      console.error('Invalid group ID:', groupId);
      return false;
    }

    try {
      // حفظ المجموعة المختارة
      localStorage.setItem(LMS_CONFIG.storageKeys.selectedGroup, groupId);

      // تحديث العداد
      this.incrementGroupCounter(groupId);

      // تسجيل الجلسة
      this.recordStudentSession(groupId);

      // عرض رسالة النجاح
      this.showLoginSuccessMessage(groupId);

      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  }

  /**
   * زيادة عداد المجموعة
   * @param {string} groupId - معرف المجموعة
   */
  incrementGroupCounter(groupId) {
    const counters = this.getGroupCounters();
    counters[groupId] = (counters[groupId] || 0) + 1;
    counters.total = (counters.total || 0) + 1;
    
    localStorage.setItem(LMS_CONFIG.storageKeys.groupCounters, JSON.stringify(counters));
    
    // إرسال حدث تحديث العداد
    this.dispatchCounterUpdateEvent(groupId, counters[groupId]);
  }

  /**
   * الحصول على عدادات المجموعات
   * @returns {Object} عدادات المجموعات
   */
  getGroupCounters() {
    const counters = localStorage.getItem(LMS_CONFIG.storageKeys.groupCounters);
    return counters ? JSON.parse(counters) : { group1: 0, group2: 0, group3: 0, group4: 0, total: 0 };
  }

  /**
   * تسجيل جلسة الطالب
   * @param {string} groupId - معرف المجموعة
   */
  recordStudentSession(groupId) {
    const sessions = this.getStudentSessions();
    const newSession = {
      id: Date.now().toString(),
      groupId: groupId,
      groupName: LMS_CONFIG.groups[groupId].name,
      loginTime: new Date().toISOString(),
      userAgent: navigator.userAgent,
      sessionId: this.generateSessionId()
    };

    sessions.push(newSession);
    
    // الاحتفاظ بآخر 100 جلسة فقط
    if (sessions.length > 100) {
      sessions.splice(0, sessions.length - 100);
    }

    localStorage.setItem(LMS_CONFIG.storageKeys.studentSessions, JSON.stringify(sessions));
  }

  /**
   * الحصول على جلسات الطلاب
   * @returns {Array} جلسات الطلاب
   */
  getStudentSessions() {
    const sessions = localStorage.getItem(LMS_CONFIG.storageKeys.studentSessions);
    return sessions ? JSON.parse(sessions) : [];
  }

  /**
   * إنشاء معرف جلسة فريد
   * @returns {string} معرف الجلسة
   */
  generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * عرض رسالة نجاح تسجيل الدخول
   * @param {string} groupId - معرف المجموعة
   */
  showLoginSuccessMessage(groupId) {
    const group = LMS_CONFIG.groups[groupId];
    const counters = this.getGroupCounters();
    
    const message = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
        <i class="bi bi-check-circle-fill me-2"></i>
        <strong>تم تسجيل دخولك بنجاح!</strong><br>
        المجموعة: ${group.name}<br>
        عدد الطلاب في هذه المجموعة: ${counters[groupId]}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `;

    // إضافة الرسالة للصفحة
    const container = document.querySelector('.container');
    if (container) {
      container.insertAdjacentHTML('afterbegin', message);
    }

    // إزالة الرسالة تلقائياً بعد 5 ثوان
    setTimeout(() => {
      const alert = document.querySelector('.alert-success');
      if (alert) {
        alert.remove();
      }
    }, 5000);
  }

  /**
   * تبديل المجموعة
   */
  switchGroup() {
    if (confirm('هل تريد تغيير المجموعة؟ سيتم إعادة توجيهك إلى صفحة اختيار المجموعة.')) {
      localStorage.removeItem(LMS_CONFIG.storageKeys.selectedGroup);
      window.location.href = 'login.html';
    }
  }

  /**
   * الحصول على المجموعة المختارة حالياً
   * @returns {string|null} معرف المجموعة أو null
   */
  getCurrentGroup() {
    return localStorage.getItem(LMS_CONFIG.storageKeys.selectedGroup);
  }

  /**
   * تصفير جميع الإحصائيات (للمدير)
   */
  resetAllStatistics() {
    if (confirm('هل أنت متأكد من تصفير جميع الإحصائيات؟ لا يمكن التراجع عن هذا الإجراء.')) {
      const settings = this.getAdminSettings();
      settings.lastResetDate = new Date().toISOString();
      
      localStorage.setItem(LMS_CONFIG.storageKeys.adminSettings, JSON.stringify(settings));
      localStorage.setItem(LMS_CONFIG.storageKeys.groupCounters, JSON.stringify({
        group1: 0, group2: 0, group3: 0, group4: 0, total: 0
      }));
      localStorage.setItem(LMS_CONFIG.storageKeys.studentSessions, JSON.stringify([]));
      
      // إعادة تحميل الصفحة إذا كانت لوحة التحكم
      if (window.location.pathname.includes('dashboard.html')) {
        location.reload();
      }
      
      return true;
    }
    return false;
  }

  /**
   * الحصول على إعدادات الإدارة
   * @returns {Object} إعدادات الإدارة
   */
  getAdminSettings() {
    const settings = localStorage.getItem(LMS_CONFIG.storageKeys.adminSettings);
    return settings ? JSON.parse(settings) : {};
  }

  /**
   * تحديث لوحة التحكم
   */
  updateDashboard() {
    const counters = this.getGroupCounters();
    const sessions = this.getStudentSessions();
    
    // تحديث عدادات المجموعات
    Object.keys(LMS_CONFIG.groups).forEach(groupId => {
      const counterElement = document.getElementById(`${groupId}Counter`);
      if (counterElement) {
        counterElement.textContent = counters[groupId] || 0;
      }
    });

    // تحديث العداد الإجمالي
    const totalCounterElement = document.getElementById('totalCounter');
    if (totalCounterElement) {
      totalCounterElement.textContent = counters.total || 0;
    }

    // تحديث آخر جلسة
    const lastSessionElement = document.getElementById('lastSession');
    if (lastSessionElement && sessions.length > 0) {
      const lastSession = sessions[sessions.length - 1];
      const date = new Date(lastSession.loginTime);
      lastSessionElement.textContent = `${lastSession.groupName} - ${date.toLocaleString('ar-SA')}`;
    }

    // تحديث الإحصائيات المتقدمة
    this.updateAdvancedStats(sessions);
  }

  /**
   * تحديث الإحصائيات المتقدمة
   * @param {Array} sessions - جلسات الطلاب
   */
  updateAdvancedStats(sessions) {
    const today = new Date().toDateString();
    const todaySessions = sessions.filter(session => 
      new Date(session.loginTime).toDateString() === today
    );

    const todayCounterElement = document.getElementById('todayCounter');
    if (todayCounterElement) {
      todayCounterElement.textContent = todaySessions.length;
    }

    // إحصائيات حسب المجموعات اليوم
    Object.keys(LMS_CONFIG.groups).forEach(groupId => {
      const todayGroupSessions = todaySessions.filter(session => session.groupId === groupId);
      const todayGroupElement = document.getElementById(`${groupId}TodayCounter`);
      if (todayGroupElement) {
        todayGroupElement.textContent = todayGroupSessions.length;
      }
    });
  }

  /**
   * إرسال حدث تحديث العداد
   * @param {string} groupId - معرف المجموعة
   * @param {number} count - العدد الجديد
   */
  dispatchCounterUpdateEvent(groupId, count) {
    const event = new CustomEvent('counterUpdated', {
      detail: { groupId, count }
    });
    document.dispatchEvent(event);
  }

  /**
   * إعداد مستمعي الأحداث
   */
  setupEventListeners() {
    // مستمع حدث تحديث العداد
    document.addEventListener('counterUpdated', (event) => {
      const { groupId, count } = event.detail;
      console.log(`Counter updated for ${groupId}: ${count}`);
    });

    // مستمع تحميل الصفحة
    document.addEventListener('DOMContentLoaded', () => {
      this.handlePageLoad();
    });
  }

  /**
   * معالجة تحميل الصفحة
   */
  handlePageLoad() {
    const currentPage = window.location.pathname.split('/').pop();
    
    switch (currentPage) {
      case 'login.html':
        this.handleLoginPageLoad();
        break;
      case 'lesson.html':
        this.handleLessonPageLoad();
        break;
      case 'dashboard.html':
        this.handleDashboardPageLoad();
        break;
      default:
        this.handleDefaultPageLoad();
        break;
    }
  }

  /**
   * معالجة تحميل صفحة تسجيل الدخول
   */
  handleLoginPageLoad() {
    this.updateGroupButtons();
    this.checkExistingGroup();
  }

  /**
   * تحديث أزرار المجموعات
   */
  updateGroupButtons() {
    const counters = this.getGroupCounters();
    
    Object.keys(LMS_CONFIG.groups).forEach(groupId => {
      const button = document.querySelector(`[data-group-id="${groupId}"]`);
      if (button) {
        const counterElement = button.querySelector('.group-counter');
        if (counterElement) {
          counterElement.textContent = counters[groupId] || 0;
        }
      }
    });
  }

  /**
   * فحص المجموعة الموجودة
   */
  checkExistingGroup() {
    // تم تعطيل عرض رسالة "لديك مجموعة مختارة مسبقاً"
    // const selectedGroup = this.getCurrentGroup();
    // 
    // if (selectedGroup && LMS_CONFIG.groups[selectedGroup]) {
    //   this.showContinueOption(selectedGroup);
    // }
  }

  /**
   * عرض خيار المتابعة
   * @param {string} groupId - معرف المجموعة
   */
  showContinueOption(groupId) {
    const group = LMS_CONFIG.groups[groupId];
    const counters = this.getGroupCounters();
    
    const container = document.querySelector('.group-selection-container');
    if (!container) return;

    const continueAlert = document.createElement('div');
    continueAlert.className = 'alert alert-info border-0 mb-4';
    continueAlert.innerHTML = `
      <div class="d-flex align-items-center justify-content-between">
        <div class="d-flex align-items-center">
          <i class="bi bi-info-circle-fill fa-2x me-3"></i>
          <div>
            <h6 class="alert-heading mb-1">لديك مجموعة مختارة مسبقاً</h6>
            <p class="mb-0">${group.name} - ${counters[groupId]} طالب</p>
          </div>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn-primary btn-sm" onclick="lmsManager.continueWithGroup()">
            <i class="bi bi-play-fill me-1"></i>
            متابعة
          </button>
          <button class="btn btn-outline-primary btn-sm" onclick="lmsManager.clearAndReload()">
            <i class="bi bi-arrow-clockwise me-1"></i>
            تغيير
          </button>
        </div>
      </div>
    `;
    
    container.insertBefore(continueAlert, container.firstChild);
  }

  /**
   * متابعة مع المجموعة الحالية
   */
  continueWithGroup() {
    const currentGroup = this.getCurrentGroup();
    if (currentGroup) {
      window.location.href = 'lesson.html';
    }
  }

  /**
   * مسح المجموعة وإعادة تحميل الصفحة
   */
  clearAndReload() {
    localStorage.removeItem(LMS_CONFIG.storageKeys.selectedGroup);
    location.reload();
  }

  /**
   * معالجة تحميل صفحة الدرس
   */
  handleLessonPageLoad() {
    const selectedGroup = this.getCurrentGroup();
    
    if (selectedGroup && LMS_CONFIG.groups[selectedGroup]) {
      this.displayGroupContent(selectedGroup);
    } else {
      this.displayNoGroupContent();
    }
  }

  /**
   * عرض محتوى المجموعة
   * @param {string} groupId - معرف المجموعة
   */
  displayGroupContent(groupId) {
    // إخفاء جميع المحتويات
    document.querySelectorAll('.group-content').forEach(content => {
      content.classList.remove('active');
    });

    // عرض محتوى المجموعة المختارة
    const targetContent = document.getElementById(groupId);
    if (targetContent) {
      targetContent.classList.add('active');
    }

    // تحديث عرض اسم المجموعة
    this.updateGroupDisplay(groupId);
  }

  /**
   * عرض رسالة عدم وجود مجموعة
   */
  displayNoGroupContent() {
    document.querySelectorAll('.group-content').forEach(content => {
      content.classList.remove('active');
    });
    
    const noGroupContent = document.getElementById('noGroup');
    if (noGroupContent) {
      noGroupContent.classList.add('active');
    }
    
    this.updateGroupDisplay(null);
  }

  /**
   * تحديث عرض اسم المجموعة
   * @param {string|null} groupId - معرف المجموعة أو null
   */
  updateGroupDisplay(groupId) {
    const groupNameElement = document.getElementById('groupName');
    if (groupNameElement) {
      if (groupId && LMS_CONFIG.groups[groupId]) {
        groupNameElement.textContent = LMS_CONFIG.groups[groupId].name;
      } else {
        groupNameElement.textContent = 'لم يتم الاختيار';
      }
    }
  }

  /**
   * معالجة تحميل صفحة لوحة التحكم
   */
  handleDashboardPageLoad() {
    this.updateDashboard();
  }

  /**
   * معالجة تحميل الصفحات الأخرى
   */
  handleDefaultPageLoad() {
    // تحديث التنقل إذا كان المستخدم قد اختار مجموعة
    const selectedGroup = this.getCurrentGroup();
    if (selectedGroup && LMS_CONFIG.groups[selectedGroup]) {
      this.updateGroupDisplay(selectedGroup);
    }
  }

  /**
   * بدء الدرس
   * @param {string} groupId - معرف المجموعة
   */
  startLesson(groupId) {
    const group = LMS_CONFIG.groups[groupId];
    if (!group) {
      console.error('Invalid group ID:', groupId);
      return;
    }

    if (!group.delightexUrl) {
      alert('عذراً، المحتوى التعليمي لهذه المجموعة غير متاح حالياً');
      return;
    }

    // فتح محتوى Delightex في نافذة جديدة
    window.open(group.delightexUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  /**
   * الانتقال لمحتوى Delightex للمجموعة الحالية
   */
  goToDelightexContent() {
    if (!this.checkAuthentication('lesson')) {
      return;
    }

    const currentGroup = this.getCurrentGroup();
    if (!currentGroup || !currentGroup.delightexUrl) {
      alert('خطأ: لم يتم العثور على محتوى هذه المجموعة');
      return;
    }

    // فتح محتوى Delightex في نافذة جديدة
    window.open(currentGroup.delightexUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
  }

  /**
   * عرض معلومات المجموعة الحالية
   */
  displayCurrentGroupInfo() {
    const currentGroup = this.getCurrentGroup();
    if (!currentGroup) {
      return null;
    }

    return {
      name: currentGroup.name,
      subtitle: currentGroup.subtitle,
      instructions: currentGroup.instructions,
      objectives: currentGroup.objectives,
      delightexUrl: currentGroup.delightexUrl
    };
  }
}

// إنشاء مثيل النظام
const lmsManager = new LMSManager();

// دوال عامة للتوافق مع الكود القديم
function selectGroup(groupId) {
  return lmsManager.loginToGroup(groupId);
}

function switchGroup() {
  return lmsManager.switchGroup();
}

function startLesson(groupId) {
  return lmsManager.startLesson(groupId);
}

function continueWithGroup() {
  return lmsManager.continueWithGroup();
}

function clearGroup() {
  return lmsManager.clearAndReload();
}

function resetStatistics() {
  return lmsManager.resetAllStatistics();
}

function updateDashboard() {
  return lmsManager.updateDashboard();
}

function goToDelightexContent() {
  return lmsManager.goToDelightexContent();
}

function checkAuthentication(pageType) {
  return lmsManager.checkAuthentication(pageType);
}

// تصدير للنظم النمطية
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LMSManager, LMS_CONFIG, lmsManager };
}
