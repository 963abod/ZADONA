document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  // تصفير كامل لأي تريغرات قديمة
  ScrollTrigger.getAll().forEach(t => t.kill());

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  const isMobile = window.innerWidth <= 768;

  // إحداثيات المحطات بدقة داخل الفراغات
  const waypoints = [
    // 0: الهيرو (فوق بالزاوية)
    { x: isMobile ? '5vw' : '8vw',   y: isMobile ? '12vh' : '14vh', rot: 0 },
    // 1: المدار (يمين الفراغ بجانب كلمة زادونا)
    { x: isMobile ? '68vw' : '65vw', y: isMobile ? '24vh' : '22vh', rot: 360 },
    // 2: الجودة (يسار كرت 03 نطوّر الممكن)
    { x: isMobile ? '6vw' : '10vw',  y: isMobile ? '60vh' : '55vh', rot: 720 },
    // 3: الإحصائيات (يمين الفراغ تحت ∞)
    { x: isMobile ? '70vw' : '68vw', y: isMobile ? '66vh' : '60vh', rot: 1080 },
    // 4: من داخل ZADONA (أعلى اليمين)
    { x: isMobile ? '62vw' : '60vw', y: isMobile ? '20vh' : '18vh', rot: 1440 },
    // 5: فوق منتجاتنا (تثبت بالوسط قبل الفوتر)
    { x: isMobile ? '32vw' : '38vw', y: isMobile ? '52vh' : '45vh', rot: 1800 }
  ];

  let currentIdx = 0;
  let isMoving = false;

  function goToWaypoint(index) {
    if (currentIdx === index || isMoving) return;
    
    isMoving = true;
    currentIdx = index;

    gsap.to(bottle, {
      x: waypoints[index].x,
      y: waypoints[index].y,
      rotation: waypoints[index].rot,
      duration: 0.9,
      ease: 'power2.inOut',
      overwrite: 'auto',
      onComplete: () => {
        isMoving = false;
      }
    });
  }

  // الموضع المبدئي
  gsap.set(bottle, {
    x: waypoints[0].x,
    y: waypoints[0].y,
    rotation: 0
  });

  // ربط الحساسات بنهايات السكاشن فقط (bottom 70%) حتى ما تقاطع قراءتك
  const triggers = [
    { target: '#hero, .hero-section', to: 0, from: 0 },
    { target: '#about, .orbit-word', to: 1, from: 0 },
    { target: '.q-three, .quality-badges', to: 2, from: 1 },
    { target: '.stats-section, [data-stats]', to: 3, from: 2 },
    { target: '.news-section, [data-news]', to: 4, from: 3 },
    { target: '#products', to: 5, from: 4 }
  ];

  triggers.forEach((item) => {
    const el = document.querySelector(item.target);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 40%',      // لا تبدأ الحركة إلا بعد ما ينزل السكشن لنصف الشاشة ويثبت
      end: 'bottom 40%',
      onEnter: () => goToWaypoint(item.to),
      onLeaveBack: () => goToWaypoint(item.from)
    });
  });

  ScrollTrigger.refresh();
});