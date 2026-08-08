/**
 * 📚 Lesson Data - بيانات الدروس الديناميكية
 * نظام بيانات موحد لجميع الدروس والمجموعات
 * 
 * @version 1.0 - Dynamic Lesson System
 * @date December 2024
 */

// بيانات المجموعات والمحاور
const groupsData = {
  '1': {
    title: 'المحور الأول: التكنولوجيا وتطبيقاتها',
    justification: 'عزيزي التلميذ، يتناول المحور الأول مجموعة من الدروس التى تهدف الى التمكن من استخدام أدوات التكنولوجيا بفعالية لمواكبة التطورات، وتحسين جودة الحياة، وذلك من خلال تناول موضوعات تخص الذكاء الاصطناعي، والبحث الرقمي، وتصميم المواقع، مما ينمّي مهارات التفكير والإبداع والتعاون.',
    objectives: [
      'تعرف مفهوم التكنولوجيا',
      'تعرف مفهوم جهاز الكمبيوتر',
      'تعرف مفهوم الواقع الافتراضي (VR)',
      'تعرف مفهوم الواقع المعزّز (AR)',
      'تعرف مفهوم الذكاء الاصطناعي (AI)',
      'تناقش كيف تساعد التطبيقات التكنولوجية ذوي الهمم',
      'تقييم مدى فاعلية منتج تكنولوجى من حيث سهولة الاستخدام والفائدة'
    ],
    lessons: {
      '1': {
        title: 'التعرف على أهمية التكنولوجيا وتطبيقاتها في التعليم',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-cpu me-2"></i>ما هي التكنولوجيا؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>التكنولوجيا</strong> هي استخدام الأدوات والعلم والمعرفة لحل المشكلات أو تسهيل الأعمال التي نقوم بها كل يوم.
              </p>
              <p class="mb-0 mt-2">
                <strong>مثال:</strong> عندما نستخدم الحاسوب للكتابة أو الهاتف للتحدث مع صديق، فنحن نستخدم التكنولوجيا.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'التكنولوجيا هي استخدام الأدوات والعلم والمعرفة لحل المشكلات.', answer: true },
            '2': { question: 'الحاسوب لا يُستخدم في التعليم، بل فقط في اللعب.', answer: false },
            '3': { question: 'يحتاج الواقع الافتراضي إلى نظارات خاصة.', answer: true },
            '4': { question: 'يمكن استخدام الذكاء الاصطناعي في فتح الهاتف بالتعرف على الوجه.', answer: true },
            '5': { question: 'الواقع المعزز يجعلنا نعيش داخل عالم افتراضي بالكامل.', answer: false },
            '6': { question: 'التكنولوجيا المساعدة مفيدة فقط للأشخاص العاديين، وليست لذوي الهمم.', answer: false },
            '7': { question: 'من أمثلة التكنولوجيا: الهاتف، الحاسوب، الروبوت.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'الحاسوب يساعدنا في:',
              options: {
                'أ': 'اللعب فقط',
                'ب': 'التعلم والكتابة والحساب',
                'ج': 'الأكل والشرب'
              },
              answer: 'ب'
            },
            '2': {
              question: 'أي من التالي يُعتبر تطبيق ذكاء اصطناعي؟',
              options: {
                'أ': 'Siri',
                'ب': 'Paint',
                'ج': 'Calculator'
              },
              answer: 'أ'
            },
            '3': {
              question: 'الواقع الافتراضي (VR) يعني:',
              options: {
                'أ': 'إضافة معلومات على الواقع',
                'ب': 'عالم رقمي نراه بالنظارات',
                'ج': 'كتابة رسائل نصية'
              },
              answer: 'ب'
            },
            '4': {
              question: 'الواقع المعزز (AR) يمكن أن يُستخدم في:',
              options: {
                'أ': 'رؤية مجسّم ثلاثي الأبعاد على الطاولة',
                'ب': 'تنظيف الغرفة',
                'ج': 'الاستماع للموسيقى'
              },
              answer: 'أ'
            },
            '5': {
              question: 'من الأدوات المساعدة لذوي الهمم:',
              options: {
                'أ': 'Google Maps',
                'ب': 'Narrator',
                'ج': 'TikTok'
              },
              answer: 'ب'
            },
            '6': {
              question: 'التكنولوجيا المساعدة تساعد:',
              options: {
                'أ': 'اللاعبين فقط',
                'ب': 'ذوي الهمم في التعلم والتواصل',
                'ج': 'الحيوانات'
              },
              answer: 'ب'
            },
            '7': {
              question: 'لمعرفة إذا كان المنتج التكنولوجي مفيدًا، نسأل:',
              options: {
                'أ': 'هل شكله جميل فقط؟',
                'ب': 'هل هو سهل ومفيد؟',
                'ج': 'هل هو مجاني فقط؟'
              },
              answer: 'ب'
            }
          }
        }
      },
      '2': {
        title: 'مفهوم جهاز الكمبيوتر ومكوناته',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-pc-display me-2"></i>مكونات الكمبيوتر
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الكمبيوتر</strong> يتكون من عدة أجزاء تعمل معاً لمعالجة المعلومات.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الكمبيوتر يتكون من شاشة ولوحة مفاتيح فقط.', answer: false },
            '2': { question: 'الماوس يُستخدم للتحكم في الكمبيوتر.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'أي جزء من الكمبيوتر يُستخدم للكتابة؟',
              options: {
                'أ': 'الشاشة',
                'ب': 'لوحة المفاتيح',
                'ج': 'الماوس'
              },
              answer: 'ب'
            }
          }
        }
      },
      '3': {
        title: 'الواقع الافتراضي (VR)',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-vr me-2"></i>الواقع الافتراضي
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الواقع الافتراضي</strong> هو عالم رقمي نراه من خلال نظارات خاصة.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الواقع الافتراضي يحتاج نظارات خاصة.', answer: true },
            '2': { question: 'يمكن استخدام VR في الألعاب والتعليم.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'الواقع الافتراضي يُستخدم في:',
              options: {
                'أ': 'الألعاب فقط',
                'ب': 'التعليم والتدريب',
                'ج': 'الطبخ'
              },
              answer: 'ب'
            }
          }
        }
      },
      '4': {
        title: 'الواقع المعزز (AR)',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-phone me-2"></i>الواقع المعزز
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الواقع المعزز</strong> يضيف معلومات رقمية على العالم الحقيقي.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الواقع المعزز يضيف معلومات على الواقع.', answer: true },
            '2': { question: 'AR يُستخدم في تطبيقات الهاتف.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'الواقع المعزز يُستخدم في:',
              options: {
                'أ': 'إضافة مجسمات على الطاولة',
                'ب': 'تنظيف المنزل',
                'ج': 'الطبخ'
              },
              answer: 'أ'
            }
          }
        }
      },
      '5': {
        title: 'الذكاء الاصطناعي (AI)',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-robot me-2"></i>الذكاء الاصطناعي
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الذكاء الاصطناعي</strong> هو قدرة الآلات على التفكير والتعلم مثل البشر.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الذكاء الاصطناعي يمكن أن يتعلم.', answer: true },
            '2': { question: 'Siri هو مثال على الذكاء الاصطناعي.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'من أمثلة الذكاء الاصطناعي:',
              options: {
                'أ': 'Siri',
                'ب': 'Paint',
                'ج': 'Calculator'
              },
              answer: 'أ'
            }
          }
        }
      },
      '6': {
        title: 'التكنولوجيا المساعدة لذوي الهمم',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-heart me-2"></i>التكنولوجيا المساعدة
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>التكنولوجيا المساعدة</strong> تساعد ذوي الهمم في التعلم والتواصل.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'التكنولوجيا المساعدة مفيدة لذوي الهمم.', answer: true },
            '2': { question: 'Narrator يساعد المكفوفين.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'التكنولوجيا المساعدة تساعد:',
              options: {
                'أ': 'اللاعبين فقط',
                'ب': 'ذوي الهمم في التعلم',
                'ج': 'الحيوانات'
              },
              answer: 'ب'
            }
          }
        }
      },
      '7': {
        title: 'تقييم المنتجات التكنولوجية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-star me-2"></i>تقييم المنتجات
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>تقييم المنتجات</strong> يساعدنا في اختيار أفضل التطبيقات والأدوات.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'يجب أن يكون المنتج سهل الاستخدام.', answer: true },
            '2': { question: 'السعر هو العامل الوحيد في التقييم.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'لتقييم منتج تكنولوجي نسأل:',
              options: {
                'أ': 'هل هو جميل فقط؟',
                'ب': 'هل هو سهل ومفيد؟',
                'ج': 'هل هو مجاني فقط؟'
              },
              answer: 'ب'
            }
          }
        }
      }
    }
  },
  '2': {
    title: 'المحور الثاني: البرمجة والأكواد',
    justification: 'عزيزي التلميذ، يتناول المحور الثاني مجموعة من الدروس التي تهدف إلى التمكن من البرمجة والأكواد بفعالية، مما ينمي مهارات التفكير المنطقي والإبداع.',
    objectives: [
      'تعرف مفهوم البرمجة',
      'تعرف مفهوم الأكواد',
      'تعرف أنواع البرمجة',
      'تطبق أساسيات البرمجة',
      'تنشئ مشاريع برمجية بسيطة',
      'تحل المشكلات بالبرمجة',
      'تطور مهارات التفكير المنطقي'
    ],
    lessons: {
      '1': {
        title: 'مفهوم البرمجة والأكواد',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-code-slash me-2"></i>ما هي البرمجة؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>البرمجة</strong> هي كتابة تعليمات للكمبيوتر ليقوم بمهام معينة.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'البرمجة هي كتابة تعليمات للكمبيوتر.', answer: true },
            '2': { question: 'الأكواد غير مهمة في البرمجة.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'البرمجة تُستخدم في:',
              options: {
                'أ': 'إنشاء التطبيقات',
                'ب': 'الطبخ فقط',
                'ج': 'الرسم'
              },
              answer: 'أ'
            }
          }
        }
      }
      // باقي الدروس...
    }
  },
  '3': {
    title: 'المحور الثالث: الأمان الرقمي',
    justification: 'عزيزي التلميذ، يتناول المحور الثالث مجموعة من الدروس التي تهدف إلى التمكن من الأمان الرقمي وحماية البيانات.',
    objectives: [
      'تعرف مفهوم الأمان الرقمي',
      'تعرف كيفية حماية البيانات',
      'تطبق قواعد الأمان الرقمي',
      'تحمي معلوماتك الشخصية',
      'تتعرف على التهديدات الرقمية',
      'تستخدم كلمات مرور قوية',
      'تطبق أفضل الممارسات الأمنية'
    ],
    lessons: {
      '1': {
        title: 'مفهوم الأمان الرقمي',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-shield-check me-2"></i>ما هو الأمان الرقمي؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الأمان الرقمي</strong> هو حماية المعلومات والبيانات من التهديدات.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الأمان الرقمي مهم لحماية البيانات.', answer: true },
            '2': { question: 'كلمات المرور القوية غير مهمة.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'الأمان الرقمي يحمي:',
              options: {
                'أ': 'المعلومات الشخصية',
                'ب': 'الطعام فقط',
                'ج': 'الملابس'
              },
              answer: 'أ'
            }
          }
        }
      }
      // باقي الدروس...
    }
  },
  '4': {
    title: 'المحور الرابع: الإبداع والابتكار',
    justification: 'عزيزي التلميذ، يتناول المحور الرابع مجموعة من الدروس التي تهدف إلى تنمية الإبداع والابتكار في استخدام التكنولوجيا.',
    objectives: [
      'تنمي مهارات الإبداع',
      'تطبق التفكير الإبداعي',
      'تنشئ مشاريع مبتكرة',
      'تحل المشكلات بطرق إبداعية',
      'تطور أفكار جديدة',
      'تطبق الابتكار في التكنولوجيا',
      'تنمي روح الإبداع'
    ],
    lessons: {
      '1': {
        title: 'مفهوم الإبداع والابتكار',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-lightbulb me-2"></i>ما هو الإبداع؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-0">
                <strong>الإبداع</strong> هو القدرة على إنتاج أفكار جديدة ومفيدة.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الإبداع مهم في التكنولوجيا.', answer: true },
            '2': { question: 'الابتكار غير مفيد.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'الإبداع يُستخدم في:',
              options: {
                'أ': 'إنشاء تطبيقات جديدة',
                'ب': 'الطبخ فقط',
                'ج': 'الرسم'
              },
              answer: 'أ'
            }
          }
        }
      }
      // باقي الدروس...
    }
  }
};

// دالة تحميل بيانات الدرس
function loadLessonData(group, lesson) {
  const groupData = groupsData[group];
  const lessonData = groupData?.lessons?.[lesson];
  
  if (!groupData || !lessonData) {
    console.error('البيانات غير موجودة');
    const titleEl = document.getElementById('lesson-title');
    if (titleEl) {
      titleEl.textContent = 'الدرس غير متوفر حالياً';
    }
    const pretestSection = document.getElementById('pretest-section');
    if (pretestSection) {
      pretestSection.innerHTML = `
        <div class="alert alert-warning">
          <strong>تنبيه:</strong> لم يتم العثور على بيانات هذا الدرس.
          <a href="group${group}.html" class="alert-link">العودة إلى فهرس المجموعة</a>
        </div>
      `;
    }
    return;
  }
  
  // تحديث العنوان
  document.getElementById('page-title').textContent = `${lessonData.title} | بيئة التعلم النقال`;
  document.getElementById('axis-title').textContent = groupData.title;
  document.getElementById('lesson-title').textContent = lessonData.title;
  document.getElementById('axis-justification').textContent = groupData.justification;
  
  // تحديث الأهداف
  const objectivesList = document.getElementById('objectives-list');
  objectivesList.innerHTML = groupData.objectives.map(obj => 
    `<li class="mb-2"><i class="bi bi-check-circle-fill text-success me-2 icon-enhanced"></i>${obj}</li>`
  ).join('');
  
  // تحديث محتوى الدرس
  document.getElementById('lesson-content-body').innerHTML = lessonData.content;
  
  // تحديث الأسئلة
  loadQuestions(lessonData.questions);
  
  // تحديث الروابط
  const groupLink = document.getElementById('group-link');
  if (groupLink) {
    groupLink.href = `group${group}.html`;
    groupLink.textContent = `📚 المجموعة ${group}`;
  }
  const backToGroup = document.getElementById('back-to-group');
  if (backToGroup) {
    backToGroup.href = `group${group}.html`;
  }
  
  // تحديث الدرس التالي فقط إن وُجد في البيانات
  const nextLesson = String(parseInt(lesson, 10) + 1);
  const nextLessonLink = document.getElementById('next-lesson');
  if (groupData.lessons[nextLesson] && nextLessonLink) {
    nextLessonLink.href = `lesson.html?group=${group}&lesson=${nextLesson}`;
    nextLessonLink.style.display = '';
  } else if (nextLessonLink) {
    nextLessonLink.style.display = 'none';
  }
}

// دالة تحميل الأسئلة
function loadQuestions(questions) {
  const container = document.getElementById('questions-container');
  let html = '';
  
  // أسئلة الصواب والخطأ
  if (questions.pretest_tf) {
    html += `
      <div class="mb-5">
        <h4 class="fw-bold mb-4" style="color: var(--primary);">
          <i class="bi bi-check2-square me-2"></i>أولاً: عبارات الصواب والخطأ
        </h4>
    `;
    
    Object.keys(questions.pretest_tf).forEach((key, index) => {
      const question = questions.pretest_tf[key];
      html += `
        <div class="question-card question-card-interactive card mb-3 p-3" data-question="pretest_tf_${key}">
          <p class="fw-bold mb-3">${index + 1}. ${question.question}</p>
          <div class="d-flex gap-3">
            <div class="form-check">
              <input class="form-check-input" type="radio" name="pretest_tf_${key}" id="q${key}_true" value="true">
              <label class="form-check-label" for="q${key}_true">
                <i class="bi bi-check-circle text-success me-1 icon-enhanced"></i>صح
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" type="radio" name="pretest_tf_${key}" id="q${key}_false" value="false">
              <label class="form-check-label" for="q${key}_false">
                <i class="bi bi-x-circle text-danger me-1 icon-enhanced"></i>خطأ
              </label>
            </div>
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  // أسئلة الاختيار من متعدد
  if (questions.pretest_mcq) {
    html += `
      <div class="mb-4">
        <h4 class="fw-bold mb-4" style="color: var(--primary);">
          <i class="bi bi-list-check me-2"></i>ثانياً: أسئلة الاختيار من متعدد
        </h4>
    `;
    
    Object.keys(questions.pretest_mcq).forEach((key, index) => {
      const question = questions.pretest_mcq[key];
      html += `
        <div class="question-card card mb-3 p-3" data-question="pretest_mcq_${key}">
          <p class="fw-bold mb-3">${index + 1}. ${question.question}</p>
          <div class="d-flex flex-column gap-3">
      `;
      
      Object.keys(question.options).forEach(optionKey => {
        html += `
          <label class="form-check-label d-flex align-items-center bg-light px-3 py-2 rounded-3 shadow-sm" style="cursor: pointer;" for="mcq${key}_${optionKey}">
            <input class="form-check-input me-2" type="radio" name="pretest_mcq_${key}" id="mcq${key}_${optionKey}" value="${optionKey}">
            <span class="fw-bold me-2" style="color: var(--primary);">${optionKey}.</span>${question.options[optionKey]}
          </label>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    });
    
    html += '</div>';
  }
  
  container.innerHTML = html;
  
  // تحديث الإجابات الصحيحة
  window.lessonCorrectAnswers = questions;
}

// تصدير البيانات للاستخدام العام
window.groupsData = groupsData;
window.loadLessonData = loadLessonData;
