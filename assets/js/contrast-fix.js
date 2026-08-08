// contrast-fix.js
(function() {
  const targetsSelector = '.hero-card, .hero-content, .hero-title, .title-kids-primary, .card, .banner, .section-heading, .card-title';
  const targets = Array.from(document.querySelectorAll(targetsSelector));
  if (!targets.length) return;

  // utilities
  function hexToRgb(hex){ /* not needed if using computedStyle fallback */ }
  function getRGBFromStyle(style) {
    // style like "rgb(12,34,56)" or "rgba(...)"
    const m = style.match(/rgba?\(([^)]+)\)/);
    if(!m) return null;
    const parts = m[1].split(',').map(s=>parseFloat(s.trim()));
    return {r: parts[0], g: parts[1], b: parts[2], a: parts[3]===undefined?1:parts[3]};
  }
  function sRGBtoLin(c){ c = c / 255; return (c <= 0.04045) ? (c / 12.92) : Math.pow((c + 0.055) / 1.055, 2.4); }
  function luminance(rgb){ return 0.2126 * sRGBtoLin(rgb.r) + 0.7152 * sRGBtoLin(rgb.g) + 0.0722 * sRGBtoLin(rgb.b); }
  function contrastRatio(l1, l2){ const lighter = Math.max(l1,l2); const darker = Math.min(l1,l2); return (lighter + 0.05) / (darker + 0.05); }

  function computeEffectiveBg(el) {
    // walk up to find first non-transparent background
    let node = el;
    while(node && node !== document) {
      const cs = getComputedStyle(node);
      const bg = cs.backgroundColor;
      if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg;
      node = node.parentElement;
    }
    // fallback to body bg
    return getComputedStyle(document.body).backgroundColor || 'rgb(255,255,255)';
  }

  // Main loop
  targets.forEach(el => {
    try {
      const textEl = (el.classList && el.classList.contains('hero-title')) ? el : el.querySelector && (el.querySelector('.hero-title') || el.querySelector('.title-kids-primary') || el.querySelector('.section-heading') || el.querySelector('.card-title')) || el;
      const csText = getComputedStyle(textEl);
      const csBg = computeEffectiveBg(el);
      const rgbText = getRGBFromStyle(csText.color) || {r:22,g:22,b:22};
      const rgbBg = getRGBFromStyle(csBg) || {r:255,g:255,b:255};
      const lumText = luminance(rgbText);
      const lumBg = luminance(rgbBg);
      const ratio = contrastRatio(lumText, lumBg);

      // if below 4.5 for normal text (or 3 for large)
      const fontSize = parseFloat(csText.fontSize) || 16;
      const isLarge = fontSize >= 18 || (fontSize >= 14 && csText.fontWeight >= 700);
      const threshold = isLarge ? 3 : 4.5;

      if (ratio < threshold) {
        // mark container to force light theme
        el.setAttribute('data-force-light', 'true');
        // ensure overlay so background image doesn't hide text
        el.classList.add('ensure-text-overlay');
        // enforce readable color on the text as final fallback
        textEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--fix-text-dark') || '#161748';
        textEl.style.zIndex = 2;
      }
    } catch(e) {
      // fail gracefully
      console.warn('contrast-fix error', e);
    }
  });

  // Also run after window load and on resize (debounced)
  window.addEventListener('load', () => {
    // إعادة تشغيل التحقق من التباين بدون إعادة تحميل الصفحة
    setTimeout(() => {
      // إعادة تطبيق التحسينات على العناصر الجديدة
      const newTargets = Array.from(document.querySelectorAll(targetsSelector));
      newTargets.forEach(el => {
        if (!el.hasAttribute('data-contrast-checked')) {
          applyContrastFix(el);
          el.setAttribute('data-contrast-checked', 'true');
        }
      });
    }, 100);
  });
  
  let rTO;
  window.addEventListener('resize', () => { 
    clearTimeout(rTO); 
    rTO = setTimeout(() => {
      // إعادة تطبيق التحسينات بدون إعادة تحميل الصفحة
      const newTargets = Array.from(document.querySelectorAll(targetsSelector));
      newTargets.forEach(el => {
        applyContrastFix(el);
      });
    }, 350); 
  });

  // دالة منفصلة لتطبيق إصلاح التباين
  function applyContrastFix(el) {
    try {
      const textEl = (el.classList && el.classList.contains('hero-title')) ? el : el.querySelector && (el.querySelector('.hero-title') || el.querySelector('.title-kids-primary') || el.querySelector('.section-heading') || el.querySelector('.card-title')) || el;
      const csText = getComputedStyle(textEl);
      const csBg = computeEffectiveBg(el);
      const rgbText = getRGBFromStyle(csText.color) || {r:22,g:22,b:22};
      const rgbBg = getRGBFromStyle(csBg) || {r:255,g:255,b:255};
      const lumText = luminance(rgbText);
      const lumBg = luminance(rgbBg);
      const ratio = contrastRatio(lumText, lumBg);

      const fontSize = parseFloat(csText.fontSize) || 16;
      const isLarge = fontSize >= 18 || (fontSize >= 14 && csText.fontWeight >= 700);
      const threshold = isLarge ? 3 : 4.5;

      if (ratio < threshold) {
        el.setAttribute('data-force-light', 'true');
        el.classList.add('ensure-text-overlay');
        textEl.style.color = getComputedStyle(document.documentElement).getPropertyValue('--fix-text-dark') || '#161748';
        textEl.style.zIndex = 2;
      }
    } catch(e) {
      console.warn('contrast-fix error', e);
    }
  }
})();
