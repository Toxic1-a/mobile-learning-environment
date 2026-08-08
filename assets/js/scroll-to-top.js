/**
 * نظام زر العودة للأعلى (Scroll to Top Button)
 * يعمل على جميع صفحات الموقع
 */

document.addEventListener('DOMContentLoaded', function() {
  // إنشاء زر العودة للأعلى
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scrollTopBtn';
  scrollTopBtn.className = 'scroll-to-top-btn';
  scrollTopBtn.innerHTML = '<i class="bi bi-arrow-up-circle-fill"></i>';
  scrollTopBtn.setAttribute('aria-label', 'العودة للأعلى');
  scrollTopBtn.setAttribute('title', 'العودة للأعلى');
  
  // إضافة الزر إلى الصفحة
  document.body.appendChild(scrollTopBtn);
  
  // إظهار/إخفاء الزر عند التمرير
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  
  // وظيفة الرجوع للأعلى عند الضغط
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});

