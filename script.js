document.addEventListener('DOMContentLoaded', () => {
  if (!window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const bottle = document.getElementById('floating-bottle');
  if (!bottle) return;

  const isMobile = window.innerWidth <= 768;

  // 1. من نص الهيرو إلى الفراغ بجانب كروت الصور الصناعية
  gsap.timeline({
    scrollTrigger: {
      trigger: '.hero-visual-bento',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '68vw' : '55vw',
    y: isMobile ? '20vh' : '15vh',
    rotation: 360,
    duration: 1.1,
    ease: 'power2.inOut'
  });

  // 2. الدخول لسكشن نبدأ من التفاصيل (#about) - تستقر بالفراغ المقابل للمدار
  gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '4vw' : '8vw',
    y: isMobile ? '30vh' : '22vh',
    rotation: 720,
    duration: 1.1,
    ease: 'power2.inOut'
  });

  // 3. سكشن الجودة (#quality) - المرحلة 01 (نختار من البداية)
  gsap.timeline({
    scrollTrigger: {
      trigger: '.q-one',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '70vw' : '62vw',
    y: isMobile ? '38vh' : '28vh',
    rotation: 1080,
    duration: 1.1,
    ease: 'power2.inOut'
  });

  // 4. سكشن الجودة - المرحلة 02 و 03 (نصنع بدقة ونطوّر الممكن)
  gsap.timeline({
    scrollTrigger: {
      trigger: '.q-two',
      start: 'top 75%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '5vw' : '10vw',
    y: isMobile ? '45vh' : '35vh',
    rotation: 1440,
    duration: 1.1,
    ease: 'power2.inOut'
  });

  // 5. الفراغ أعلى كروت الشهادات (ISO / HACCP)
  gsap.timeline({
    scrollTrigger: {
      trigger: '.quality-badges',
      start: 'top 85%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '65vw' : '50vw',
    y: isMobile ? '52vh' : '40vh',
    rotation: 1800,
    duration: 1.1,
    ease: 'power2.inOut'
  });

  // 6. سكشن المنتجات النهائي (#products)
  gsap.timeline({
    scrollTrigger: {
      trigger: '#products',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    }
  }).to(bottle, {
    x: isMobile ? '35vw' : '40vw',
    y: isMobile ? '42vh' : '30vh',
    scale: 1.25,
    rotation: 2160,
    duration: 1.2,
    ease: 'back.out(1.2)'
  });
});
