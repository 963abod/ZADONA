document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) {
    console.error('GSAP or ScrollTrigger not loaded');
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  // 1. الحركة الأولى: من الهيرو إلى سكشن الفكرة (#about)
  // تتشقلب دورة كاملة (360deg) وتستقر بمكان فارغ بالجهة الثانية
  gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 80%', // تبدأ الحركة التلقائية أول ما يقرب السكشن يظهر
      end: 'top 20%',
      scrub: false,     // حركة تلقائية كاملة غير مرتبطة ببطء السحب
      toggleActions: 'play none none reverse'
    }
  })
  .to(bottle, {
    x: window.innerWidth > 768 ? '55vw' : '45vw', // تنتقل لليمين
    y: '35vh',                                   // تنزل للأسفل
    rotation: 360,                               // تشقلبة كاملة بالنزول
    scale: 1.05,
    duration: 1.4,
    ease: 'power3.inOut'
  });

  // 2. الحركة الثانية: من سكشن (#about) إلى سكشن الجودة (#quality)
  // تتشقلب بالاتجاه المعاكس وتستقر بمساحة فارغة بجانب الكروت
  gsap.timeline({
    scrollTrigger: {
      trigger: '#quality',
      start: 'top 75%',
      end: 'top 25%',
      scrub: false,
      toggleActions: 'play none none reverse'
    }
  })
  .to(bottle, {
    x: '0vw',       // ترجع باتجاه اليسار بمساحة فاضية
    y: '50vh',      // تنزل لمستوى كروت المعايير
    rotation: 720,  // تشقلبة ثانية ناعمة
    scale: 0.95,
    duration: 1.4,
    ease: 'power3.inOut'
  });
});
