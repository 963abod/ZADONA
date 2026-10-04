document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // قتل أي تريغر أو سكرول تفاعلي قديم نهائياً
  ScrollTrigger.getAll().forEach(t => t.kill());

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  const isMobile = window.innerWidth <= 768;

  // إحداثيات الدوائر الـ 6 المحددة بالصور بدقة
  const waypoints = [
    // 1. الهيرو (أعلى اليسار)
    { x: isMobile ? '5vw' : '8vw',   y: isMobile ? '13vh' : '15vh', rot: 0 },
    // 2. المدار (يمين المدار بالفراغ)
    { x: isMobile ? '68vw' : '65vw', y: isMobile ? '24vh' : '22vh', rot: 360 },
    // 3. الجودة (يسار 03 IDEAS نطوّر الممكن)
    { x: isMobile ? '6vw' : '10vw',  y: isMobile ? '60vh' : '55vh', rot: 720 },
    // 4. الإحصائيات (يمين أسفل علامة ∞)
    { x: isMobile ? '70vw' : '68vw', y: isMobile ? '66vh' : '60vh', rot: 1080 },
    // 5. من داخل ZADONA (أعلى اليمين بالفراغ)
    { x: isMobile ? '62vw' : '60vw', y: isMobile ? '22vh' : '20vh', rot: 1440 },
    // 6. فوق منتجاتنا (تثبت بالوسط قبل الفوتر)
    { x: isMobile ? '32vw' : '38vw', y: isMobile ? '52vh' : '45vh', rot: 1800 }
  ];

  let currentStop = 0;

  function jumpTo(index) {
    if (currentStop === index) return;
    currentStop = index;
    
    // حركة تلقائية خاطفة (لا تتبع حركة الإصبع بتاتاً)
    gsap.to(bottle, {
      x: waypoints[index].x,
      y: waypoints[index].y,
      rotation: waypoints[index].rot,
      duration: 0.65,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  // المكان المبدئي بالهيرو
  gsap.set(bottle, {
    x: waypoints[0].x,
    y: waypoints[0].y,
    rotation: 0
  });

  // ربط المحطات بأقسام الموقع - التحرك فقط عند وصول القسم لمنتصف الشاشة
  const sections = [
    { el: document.querySelector('.hero-visual-bento') || document.querySelector('#hero'), stop: 0 },
    { el: document.querySelector('#about') || document.querySelector('.orbit-word'), stop: 1 },
    { el: document.querySelector('.q-three') || document.querySelector('.quality-badges'), stop: 2 },
    { el: Array.from(document.querySelectorAll('section, div')).find(el => el.textContent.includes('LOCAL EXCELLENCE')), stop: 3 },
    { el: Array.from(document.querySelectorAll('section, div')).find(el => el.textContent.includes('آخر المستجدات')), stop: 4 },
    { el: document.querySelector('#products'), stop: 5 }
  ];

  sections.forEach((sec, idx) => {
    if (!sec.el) return;
    ScrollTrigger.create({
      trigger: sec.el,
      start: 'top 50%', // لا تتحرك العبوة وأنت تقرأ، فقط عندما يدخل السكشن لمنتصف الشاشة
      end: 'bottom 50%',
      onEnter: () => jumpTo(sec.stop),
      onEnterBack: () => jumpTo(sec.stop)
    });
  });

  ScrollTrigger.refresh();
});