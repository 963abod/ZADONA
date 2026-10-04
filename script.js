document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  const isMobile = window.innerWidth <= 768;

  // إحداثيات الدوائر الـ 6 المحددة بالصور (x بالعرض, y بالارتفاع)
  const stops = [
    // المحطة 1: الهيرو (الزاوية اليسارية العلوية)
    { x: isMobile ? '5vw' : '8vw',   y: isMobile ? '14vh' : '15vh', rot: 0 },
    
    // المحطة 2: المدار الفلكي (الفراغ اليميني)
    { x: isMobile ? '70vw' : '65vw', y: isMobile ? '28vh' : '26vh', rot: 360 },
    
    // المحطة 3: الجودة (يسار 03 IDEAS نطوّر الممكن)
    { x: isMobile ? '6vw' : '10vw',  y: isMobile ? '64vh' : '55vh', rot: 720 },
    
    // المحطة 4: الإحصائيات (يمين أسفل علامة المالانهاية ∞)
    { x: isMobile ? '70vw' : '68vw', y: isMobile ? '68vh' : '60vh', rot: 1080 },
    
    // المحطة 5: الفراغ اليميني أعلى عنوان "من داخل ZADONA"
    { x: isMobile ? '62vw' : '60vw', y: isMobile ? '24vh' : '22vh', rot: 1440 },
    
    // المحطة 6 الأخيرة: الفراغ فوق 03 / منتجاتنا (تثبت فيه)
    { x: isMobile ? '30vw' : '35vw', y: isMobile ? '56vh' : '45vh', rot: 1800 }
  ];

  // دالة انتقال خاطفة وسلسة تستقر فوراً داخل الدائرة
  function moveTo(stopIndex) {
    const target = stops[stopIndex];
    gsap.to(bottle, {
      x: target.x,
      y: target.y,
      rotation: target.rot,
      duration: 0.75,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  // ضبط مكان البداية بالمحطة 1 فوراً
  moveTo(0);

  // البحث التلقائي عن أقسام الدوائر لربط الحساسات بدقة
  const secAbout = document.querySelector('#about') || document.querySelector('.orbit-word');
  const secIdeas = document.querySelector('.q-three') || document.querySelector('.quality-badges');
  const secStats = Array.from(document.querySelectorAll('section, div')).find(el => el.textContent.includes('LOCAL EXCELLENCE') || el.textContent.includes('100%'));
  const secNews  = Array.from(document.querySelectorAll('section, div')).find(el => el.textContent.includes('من داخل ZADONA') || el.textContent.includes('آخر المستجدات'));
  const secProd  = document.querySelector('#products') || document.querySelector('.products-section');

  // حساس الدائرة 2: المدار
  if (secAbout) {
    ScrollTrigger.create({
      trigger: secAbout,
      start: 'top 65%',
      onEnter: () => moveTo(1),
      onLeaveBack: () => moveTo(0)
    });
  }

  // حساس الدائرة 3: نطوّر الممكن
  if (secIdeas) {
    ScrollTrigger.create({
      trigger: secIdeas,
      start: 'top 70%',
      onEnter: () => moveTo(2),
      onLeaveBack: () => moveTo(1)
    });
  }

  // حساس الدائرة 4: الإحصائيات (100% و ∞)
  if (secStats) {
    ScrollTrigger.create({
      trigger: secStats,
      start: 'top 60%',
      onEnter: () => moveTo(3),
      onLeaveBack: () => moveTo(2)
    });
  }

  // حساس الدائرة 5: من داخل ZADONA
  if (secNews) {
    ScrollTrigger.create({
      trigger: secNews,
      start: 'top 65%',
      onEnter: () => moveTo(4),
      onLeaveBack: () => moveTo(3)
    });
  }

  // حساس الدائرة 6 والأخيرة: فوق منتجاتنا
  if (secProd) {
    ScrollTrigger.create({
      trigger: secProd,
      start: 'top 75%',
      onEnter: () => moveTo(5),
      onLeaveBack: () => moveTo(4)
    });
  }
});