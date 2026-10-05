document.addEventListener('DOMContentLoaded', () => {
  // التأكد من تحميل مكتبة GSAP و ScrollTrigger
  if (!window.gsap || !window.ScrollTrigger) {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  const isMobile = window.innerWidth <= 768;

  // إحداثيات المحطات بالفراغات (حسب أماكن الدوائر المحددة)
  const waypoints = [
    // 0. الهيرو (أعلى اليسار)
    { x: isMobile ? '5vw' : '8vw',   y: isMobile ? '13vh' : '15vh', rot: 0 },
    
    // 1. المدار والفكرة (يمين المدار بالفراغ)
    { x: isMobile ? '70vw' : '65vw', y: isMobile ? '24vh' : '22vh', rot: 360 },
    
    // 2. الجودة (يسار 03 IDEAS نطوّر الممكن)
    { x: isMobile ? '6vw' : '10vw',  y: isMobile ? '60vh' : '55vh', rot: 720 },
    
    // 3. الإحصائيات (يمين الفراغ أسفل ∞)
    { x: isMobile ? '70vw' : '68vw', y: isMobile ? '66vh' : '60vh', rot: 1080 },
    
    // 4. قسم المنتجات (يستقر فوق سكشن منتجاتنا ويثبت)
    { x: isMobile ? '35vw' : '40vw', y: isMobile ? '52vh' : '45vh', rot: 1440 }
  ];

  let currentStop = -1;

  // دالة انتقال خاطفة وسلسة تستقر مباشرة داخل الفراغ
  function goToWaypoint(index) {
    if (currentStop === index) return;
    currentStop = index;

    gsap.to(bottle, {
      x: waypoints[index].x,
      y: waypoints[index].y,
      rotation: waypoints[index].rot,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto'
    });
  }

  // ضبط نقطة البداية
  goToWaypoint(0);

  // إعداد المحطات وربطها بالسكاشن
  const stations = [
    { target: '#hero', index: 0 },
    { target: '#about', index: 1 },
    { target: '.q-three', index: 2 },
    { target: '#stats', index: 3 },
    { target: '#products', index: 4 }
  ];

  stations.forEach((st) => {
    const el = document.querySelector(st.target);
    if (!el) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 55%', // تبدأ الحركة فقط عند وصول القسم لمنتصف الشاشة
      end: 'bottom 55%',
      onEnter: () => goToWaypoint(st.index),
      onEnterBack: () => goToWaypoint(st.index)
    });
  });

  // إخفاء العبوة بنعومة عند الوصول لبانر التواصل الأخضر النهائي
  ScrollTrigger.create({
    trigger: '#contact',
    start: 'top 75%',
    onEnter: () => gsap.to(bottle, { opacity: 0, duration: 0.4 }),
    onLeaveBack: () => gsap.to(bottle, { opacity: 1, duration: 0.4 })
  });

  ScrollTrigger.refresh();
});