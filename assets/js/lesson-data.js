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
        title: 'مفهوم البرمجة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-code-slash me-2"></i>ما هي البرمجة؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                <strong>البرمجة</strong> هي كتابة تعليمات واضحة للكمبيوتر ليقوم بمهام محددة، مثل تشغيل لعبة أو حل مسألة حسابية.
              </p>
              <p class="mb-0">
                المبرمج يفكر في الخطوات أولاً، ثم يحوّلها إلى أوامر يفهمها الجهاز.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'البرمجة هي كتابة تعليمات للكمبيوتر.', answer: true },
            '2': { question: 'الكمبيوتر يفهم لغة البشر دون أي ترجمة.', answer: false },
            '3': { question: 'التخطيط للخطوات مهم قبل كتابة البرنامج.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'البرمجة تُستخدم في:',
              options: {
                'أ': 'إنشاء التطبيقات والألعاب',
                'ب': 'الطبخ فقط',
                'ج': 'غسل الملابس'
              },
              answer: 'أ'
            },
            '2': {
              question: 'أول خطوة مفيدة قبل البرمجة:',
              options: {
                'أ': 'تجاهل المشكلة',
                'ب': 'تحديد الخطوات المطلوبة',
                'ج': 'إغلاق الجهاز'
              },
              answer: 'ب'
            }
          }
        }
      },
      '2': {
        title: 'مفهوم الأكواد',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-file-code me-2"></i>ما هي الأكواد؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                <strong>الكود</strong> هو مجموعة الأوامر المكتوبة بلغة برمجة معينة.
              </p>
              <p class="mb-0">
                مثلما نكتب جملة بالعربية ليفهمها الإنسان، نكتب كوداً ليفهمه الكمبيوتر بعد ترجمته.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الكود هو أوامر مكتوبة بلغة برمجة.', answer: true },
            '2': { question: 'لا نحتاج إلى ترتيب واضح داخل الكود.', answer: false },
            '3': { question: 'خطأ صغير في الكود قد يوقف البرنامج.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'الكود يشبه:',
              options: {
                'أ': 'وصفة خطوات للجهاز',
                'ب': 'صورة فقط',
                'ج': 'صوتاً عشوائياً'
              },
              answer: 'أ'
            }
          }
        }
      },
      '3': {
        title: 'أنواع البرمجة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-diagram-3 me-2"></i>أنواع البرمجة للمبتدئين
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                توجد برمجة مرئية بالكتل (مثل Scratch) مناسبة للمبتدئين، وبرمجة نصية تكتب فيها الأوامر بالحروف.
              </p>
              <p class="mb-0">
                كلا النوعين يعتمد على نفس الفكرة: تسلسل التعليمات والمنطق.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'Scratch مثال على البرمجة بالمكعبات/الكتل.', answer: true },
            '2': { question: 'البرمجة النصية لا تحتاج منطقاً.', answer: false },
            '3': { question: 'أنواع البرمجة المختلفة تشترك في التفكير المنطقي.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'أنسب بداية للمبتدئين غالباً:',
              options: {
                'أ': 'برمجة الكتل المرئية',
                'ب': 'إصلاح أجهزة بدون تعلم',
                'ج': 'حفظ كلمات عشوائية'
              },
              answer: 'أ'
            }
          }
        }
      },
      '4': {
        title: 'أساسيات البرمجة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-list-ol me-2"></i>أساسيات مهمة
            </h4>
            <div class="alert alert-light border">
              <ul class="mb-0">
                <li><strong>التسلسل:</strong> تنفيذ الأوامر واحداً بعد الآخر.</li>
                <li><strong>الشرط:</strong> تنفيذ أمر إذا تحقق شرط معين.</li>
                <li><strong>التكرار:</strong> إعادة أمر عدة مرات.</li>
              </ul>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'التسلسل يعني تنفيذ الأوامر بالترتيب.', answer: true },
            '2': { question: 'التكرار يساعد على تقليل كتابة نفس الأمر مراراً.', answer: true },
            '3': { question: 'الشرط لا علاقة له باتخاذ القرار في البرنامج.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'إذا أردنا إعادة رسم مربع 10 مرات نستخدم:',
              options: {
                'أ': 'التكرار',
                'ب': 'حذف الكود',
                'ج': 'إيقاف الجهاز'
              },
              answer: 'أ'
            }
          }
        }
      },
      '5': {
        title: 'مشاريع برمجية بسيطة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-puzzle me-2"></i>من الفكرة إلى مشروع
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                يمكن البدء بمشروع صغير مثل: تحية تظهر على الشاشة، أو عدّاد نقاط للعبة، أو قصة تفاعلية بسيطة.
              </p>
              <p class="mb-0">
                المشروع الناجح يبدأ بفكرة واضحة ثم خطوات قصيرة قابلة للتجربة والتحسين.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'المشاريع الصغيرة مناسبة لتعلم البرمجة.', answer: true },
            '2': { question: 'يجب أن يكون أول مشروع معقداً جداً.', answer: false },
            '3': { question: 'تجربة البرنامج وتحسينه جزء من التعلم.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'أفضل مشروع أول للمبتدئ:',
              options: {
                'أ': 'تطبيق بسيط وواضح الهدف',
                'ب': 'نظام بنوك كامل',
                'ج': 'برنامج بدون فكرة'
              },
              answer: 'أ'
            }
          }
        }
      },
      '6': {
        title: 'حل المشكلات بالبرمجة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-lightning-charge me-2"></i>التفكير لحل المشكلة
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                نحدد المشكلة، نقسمها إلى أجزاء صغيرة، نجرب حلاً، ثم نراجع النتيجة ونصلح الأخطاء.
              </p>
              <p class="mb-0">
                هذه الطريقة تُسمى أحياناً التفكير الحاسوبي أو حل المشكلات خطوة بخطوة.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'تقسيم المشكلة إلى أجزاء صغيرة يسهّل حلها.', answer: true },
            '2': { question: 'الأخطاء في البرنامج تعني أننا لا نستطيع التعلم.', answer: false },
            '3': { question: 'مراجعة النتيجة بعد التجربة خطوة مهمة.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'عند فشل البرنامج أول تصرف مفيد:',
              options: {
                'أ': 'مراجعة الخطوات والبحث عن الخطأ',
                'ب': 'حذف كل شيء فوراً',
                'ج': 'ترك المشكلة دون تفكير'
              },
              answer: 'أ'
            }
          }
        }
      },
      '7': {
        title: 'مهارات التفكير المنطقي',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-brain me-2"></i>لماذا التفكير المنطقي مهم؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                التفكير المنطقي يساعدنا على ترتيب الأفكار، واكتشاف العلاقات بين الأسباب والنتائج، واتخاذ قرارات صحيحة.
              </p>
              <p class="mb-0">
                وهو مهارة تفيد في البرمجة وفي الحياة اليومية أيضاً.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'التفكير المنطقي مفيد داخل البرمجة وخارجها.', answer: true },
            '2': { question: 'الترتيب الواضح للأفكار يقلل الأخطاء.', answer: true },
            '3': { question: 'البرمجة لا تحتاج أي منطق.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'التفكير المنطقي يساعد على:',
              options: {
                'أ': 'ترتيب الحلول واكتشاف الأخطاء',
                'ب': 'تجاهل الخطوات',
                'ج': 'العمل عشوائياً'
              },
              answer: 'أ'
            }
          }
        }
      }
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
              <p class="mb-2">
                <strong>الأمان الرقمي</strong> هو مجموعة سلوكيات وأدوات تحمي معلوماتنا وأجهزتنا أثناء استخدام الإنترنت.
              </p>
              <p class="mb-0">
                الهدف أن نستخدم التقنية بثقة مع تقليل المخاطر.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الأمان الرقمي مهم لحماية البيانات.', answer: true },
            '2': { question: 'استخدام الإنترنت لا يحتاج أي حذر.', answer: false },
            '3': { question: 'الأمان الرقمي يشمل السلوك والأدوات معاً.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'الأمان الرقمي يحمي:',
              options: {
                'أ': 'المعلومات الشخصية والأجهزة',
                'ب': 'الطعام فقط',
                'ج': 'الملابس'
              },
              answer: 'أ'
            }
          }
        }
      },
      '2': {
        title: 'حماية البيانات',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-lock me-2"></i>كيف نحمي بياناتنا؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                نحفظ النسخ المهمة، لا نشارك ملفاتنا الخاصة علناً، ونستخدم إعدادات الخصوصية في التطبيقات.
              </p>
              <p class="mb-0">
                البيانات مثل الاسم ورقم الهاتف والصور تحتاج حماية خاصة.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الصور والبيانات الشخصية تحتاج حماية.', answer: true },
            '2': { question: 'مشاركة كل شيء علناً دائماً فكرة آمنة.', answer: false },
            '3': { question: 'إعدادات الخصوصية تساعد في حماية البيانات.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'من طرق حماية البيانات:',
              options: {
                'أ': 'ضبط الخصوصية وعدم مشاركة المعلومات الحساسة',
                'ب': 'نشر كلمة المرور',
                'ج': 'فتح كل الروابط المجهولة'
              },
              answer: 'أ'
            }
          }
        }
      },
      '3': {
        title: 'قواعد الأمان الرقمي',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-clipboard-check me-2"></i>قواعد ذهبية
            </h4>
            <div class="alert alert-light border">
              <ul class="mb-0">
                <li>لا تفتح روابط أو ملفات من مصادر مجهولة.</li>
                <li>استشر معلماً أو ولي أمر عند الشك.</li>
                <li>حدّث التطبيقات والنظام عند توفر التحديثات.</li>
              </ul>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الروابط المجهولة قد تكون خطرة.', answer: true },
            '2': { question: 'طلب المساعدة عند الشك تصرف صحيح.', answer: true },
            '3': { question: 'تحديث التطبيقات لا علاقة له بالأمان.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'إذا وصلتك رسالة غريبة تحتوي رابطاً:',
              options: {
                'أ': 'لا تفتحه واستشر شخصاً موثوقاً',
                'ب': 'اضغط فوراً',
                'ج': 'شارك الرابط مع الجميع'
              },
              answer: 'أ'
            }
          }
        }
      },
      '4': {
        title: 'حماية المعلومات الشخصية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-person-lock me-2"></i>معلوماتك ليست للنشر
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                لا تشارك عنوان المنزل أو أرقام البطاقات أو كلمات المرور مع أشخاص لا تعرفهم.
              </p>
              <p class="mb-0">
                فكر قبل النشر: هل هذه المعلومة مناسبة للجميع؟
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'عنوان المنزل من المعلومات الشخصية الحساسة.', answer: true },
            '2': { question: 'يمكن مشاركة كلمة المرور مع أي شخص على الإنترنت.', answer: false },
            '3': { question: 'التفكير قبل النشر يحمي الخصوصية.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'من المعلومات التي لا يجب مشاركتها علناً:',
              options: {
                'أ': 'كلمة المرور وبيانات البطاقة',
                'ب': 'اسم مادة دراسية عامة',
                'ج': 'لونك المفضل فقط'
              },
              answer: 'أ'
            }
          }
        }
      },
      '5': {
        title: 'التهديدات الرقمية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-exclamation-triangle me-2"></i>تعرف على المخاطر
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                من التهديدات الشائعة: الرسائل الاحتيالية، والبرمجيات الضارة، ومحاولات انتحال الهوية.
              </p>
              <p class="mb-0">
                التعرف على هذه التهديدات يساعدنا على تجنبها مبكراً.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الرسائل الاحتيالية من التهديدات الرقمية.', answer: true },
            '2': { question: 'كل الملفات المرفقة آمنة دائماً.', answer: false },
            '3': { question: 'معرفة التهديدات تساعد على الوقاية منها.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'مثال على تهديد رقمي:',
              options: {
                'أ': 'رسالة تطلب كلمة المرور بحجة جائزة وهمية',
                'ب': 'قراءة قصة تعليمية',
                'ج': 'حل واجب مدرسي'
              },
              answer: 'أ'
            }
          }
        }
      },
      '6': {
        title: 'كلمات المرور القوية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-key me-2"></i>كيف تصنع كلمة مرور قوية؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                كلمة المرور القوية طويلة، وتجمع حروفاً وأرقاماً ورموزاً، ولا تكون سهلة التخمين مثل تاريخ الميلاد.
              </p>
              <p class="mb-0">
                ويفضّل استخدام كلمة مختلفة لكل حساب مهم.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'كلمة المرور القوية يجب أن تكون طويلة وصعبة التخمين.', answer: true },
            '2': { question: 'استخدام 123456 كلمة مرور قوية.', answer: false },
            '3': { question: 'يفضّل عدم تكرار نفس كلمة المرور في كل الحسابات.', answer: true }
          },
          pretest_mcq: {
            '1': {
              question: 'أفضل مثال لكلمة مرور قوية:',
              options: {
                'أ': 'مزيج طويل من حروف وأرقام ورموز',
                'ب': 'اسمك فقط',
                'ج': '1234'
              },
              answer: 'أ'
            }
          }
        }
      },
      '7': {
        title: 'أفضل الممارسات الأمنية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-check2-all me-2"></i>عادات رقمية آمنة
            </h4>
            <div class="alert alert-light border">
              <ul class="mb-0">
                <li>سجّل الخروج من الحسابات على الأجهزة المشتركة.</li>
                <li>فعّل الحماية بخطوتين إن توفرت.</li>
                <li>كن لطيفاً ومسؤولاً في التعامل الرقمي مع الآخرين.</li>
              </ul>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'تسجيل الخروج من الأجهزة المشتركة عادة أمنية جيدة.', answer: true },
            '2': { question: 'المسؤولية الرقمية جزء من الأمان.', answer: true },
            '3': { question: 'ترك الحساب مفتوحاً على جهاز عام أمر آمن.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'من أفضل الممارسات الأمنية:',
              options: {
                'أ': 'تفعيل الحماية الإضافية وتسجيل الخروج عند الانتهاء',
                'ب': 'مشاركة الحساب مع الجميع',
                'ج': 'تجاهل رسائل التنبيه الأمنية دائماً'
              },
              answer: 'أ'
            }
          }
        }
      }
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
        title: 'مفهوم الإبداع',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-lightbulb me-2"></i>ما هو الإبداع؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                <strong>الإبداع</strong> هو القدرة على إنتاج أفكار جديدة ومفيدة أو تقديم حلول بطرق غير تقليدية.
              </p>
              <p class="mb-0">
                كل تلميذ يمكنه تنمية إبداعه بالملاحظة والتجربة والسؤال.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الإبداع يعني إنتاج أفكار جديدة ومفيدة.', answer: true },
            '2': { question: 'الإبداع مهارة يمكن تنميتها.', answer: true },
            '3': { question: 'الإبداع مقصور على الرسم فقط.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'الإبداع يظهر عندما:',
              options: {
                'أ': 'نبتكر حلاً جديداً لمشكلة',
                'ب': 'نكرر نفس الخطأ دون تفكير',
                'ج': 'نتوقف عن المحاولة'
              },
              answer: 'أ'
            }
          }
        }
      },
      '2': {
        title: 'التفكير الإبداعي',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-stars me-2"></i>كيف نفكر بطريقة إبداعية؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                نطرح أسئلة، نجمع أفكاراً كثيرة أولاً، ثم نختار أفضلها ونحسّنها.
              </p>
              <p class="mb-0">
                لا نسخر من الأفكار في مرحلة العصف الذهني؛ التقييم يأتي لاحقاً.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'العصف الذهني يساعد على جمع أفكار كثيرة.', answer: true },
            '2': { question: 'التفكير الإبداعي يبدأ بطرح الأسئلة.', answer: true },
            '3': { question: 'يجب رفض كل فكرة جديدة فوراً.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'خطوة مفيدة في التفكير الإبداعي:',
              options: {
                'أ': 'جمع أفكار متعددة ثم تحسينها',
                'ب': 'اختيار أول فكرة دون مراجعة',
                'ج': 'إيقاف النقاش فوراً'
              },
              answer: 'أ'
            }
          }
        }
      },
      '3': {
        title: 'إنشاء مشاريع مبتكرة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-rocket-takeoff me-2"></i>من الفكرة إلى مشروع
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                المشروع المبتكر يحل حاجة حقيقية: مثل تطبيق تذكير للمذاكرة، أو قصة رقمية تعليمية، أو لعبة تشرح معلومة علمية.
              </p>
              <p class="mb-0">
                ابدأ صغيراً، ثم طوّر المشروع بعد تجربة المستخدمين.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'المشروع المبتكر يحاول حل حاجة حقيقية.', answer: true },
            '2': { question: 'البدء بمشروع صغير ثم تطويره فكرة جيدة.', answer: true },
            '3': { question: 'لا فائدة من تجربة المشروع مع الآخرين.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'مثال على مشروع مبتكر للتلاميذ:',
              options: {
                'أ': 'قصة رقمية تعلّم مهارة مفيدة',
                'ب': 'نسخ واجب دون فهم',
                'ج': 'إغلاق الجهاز طوال اليوم'
              },
              answer: 'أ'
            }
          }
        }
      },
      '4': {
        title: 'حل المشكلات بطرق إبداعية',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-tools me-2"></i>حلول خارج الصندوق
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                عندما تواجه مشكلة، جرّب أكثر من حل، واستفد من أدوات مختلفة، وتعاون مع زملائك.
              </p>
              <p class="mb-0">
                الفشل المؤقت جزء طبيعي من الوصول إلى حل أفضل.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'تجربة أكثر من حل يزيد فرص النجاح.', answer: true },
            '2': { question: 'التعاون قد يفتح أفكاراً جديدة.', answer: true },
            '3': { question: 'الفشل المؤقت يعني التوقف النهائي.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'عند مواجهة مشكلة صعبة:',
              options: {
                'أ': 'نجرب حلولًا متعددة ونراجع النتائج',
                'ب': 'نستسلم مباشرة',
                'ج': 'نلوم الأداة فقط دون تفكير'
              },
              answer: 'أ'
            }
          }
        }
      },
      '5': {
        title: 'تطوير أفكار جديدة',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-journal-richtext me-2"></i>كيف نطور الفكرة؟
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                سجّل الفكرة، ابحث عن أمثلة مشابهة، أضف تحسينات، ثم اختبرها على نطاق صغير.
              </p>
              <p class="mb-0">
                دفتر الأفكار أو ملاحظات الهاتف تساعد على عدم نسيان الإلهام.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'تسجيل الأفكار يساعد على تطويرها لاحقاً.', answer: true },
            '2': { question: 'اختبار الفكرة على نطاق صغير مفيد.', answer: true },
            '3': { question: 'البحث عن أمثلة مشابهة يضعف الإبداع دائماً.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'طريقة جيدة لتطوير فكرة:',
              options: {
                'أ': 'تسجيلها وتحسينها ثم اختبارها',
                'ب': 'نسيانها فوراً',
                'ج': 'رفض أي تعديل عليها'
              },
              answer: 'أ'
            }
          }
        }
      },
      '6': {
        title: 'الابتكار في التكنولوجيا',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-cpu me-2"></i>التكنولوجيا مساحة للابتكار
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                يمكننا استخدام التطبيقات والبرمجة والتصميم لابتكار حلول تعليمية واجتماعية مفيدة.
              </p>
              <p class="mb-0">
                الابتكار لا يعني اختراع شيء ضخم دائماً؛ تحسين بسيط ونافع يُعد ابتكاراً.
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'يمكن استخدام التكنولوجيا لابتكار حلول مفيدة.', answer: true },
            '2': { question: 'التحسين الصغير النافع يُعد شكلاً من الابتكار.', answer: true },
            '3': { question: 'الابتكار مستحيل للتلاميذ.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'مثال على ابتكار تقني بسيط:',
              options: {
                'أ': 'تطبيق تذكير يومي للمذاكرة',
                'ب': 'كسر جهاز عمداً',
                'ج': 'إهمال التعلم'
              },
              answer: 'أ'
            }
          }
        }
      },
      '7': {
        title: 'تنمية روح الإبداع',
        content: `
          <div class="mb-5">
            <h4 class="fw-bold mb-3" style="color: var(--primary);">
              <i class="bi bi-emoji-smile me-2"></i>حافظ على فضولك
            </h4>
            <div class="alert alert-light border">
              <p class="mb-2">
                روح الإبداع تنمو بالممارسة، وتقبّل الخطأ، وحب التعلم، وتشجيع الزملاء.
              </p>
              <p class="mb-0">
                اسأل دائماً: كيف يمكنني تحسين هذا؟ وما الذي لم يجربه أحد من قبل؟
              </p>
            </div>
          </div>
        `,
        questions: {
          pretest_tf: {
            '1': { question: 'الممارسة تساعد على تنمية الإبداع.', answer: true },
            '2': { question: 'تشجيع الزملاء يدعم بيئة إبداعية.', answer: true },
            '3': { question: 'الخوف الدائم من الخطأ ينمّي الإبداع.', answer: false }
          },
          pretest_mcq: {
            '1': {
              question: 'أفضل عادة لتنمية روح الإبداع:',
              options: {
                'أ': 'التجربة والتعلم من الأخطاء',
                'ب': 'تجنب أي تحدٍ جديد',
                'ج': 'السخرية من أفكار الآخرين'
              },
              answer: 'أ'
            }
          }
        }
      }
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
