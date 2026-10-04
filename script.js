(function(){
  const section = document.getElementById('product-sequence');
  const canvas = document.getElementById('product-sequence-canvas');
  const loading = document.getElementById('sequence-loading');
  if(!section || !canvas) return;

  const ctx = canvas.getContext('2d', {alpha: false, desynchronized: true});
  const total = 150;
  const images = new Array(total);
  let currentFrame = 0;
  let drawnFrame = -1;
  let dpr = 1;
  let resizeTimer = 0;
  let trigger = null;
  let isTicking = false;

  const framePath = i => `./public/frames/frame_${String(i+1).padStart(4,'0')}.jpg`;

  function resizeCanvas(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(rect.width));
    const h = Math.max(1, Math.round(rect.height));
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const ready = nearestLoaded(currentFrame);
    if(ready >= 0) drawFrame(ready);
  }

  function drawFrame(index){
    const img = images[index];
    if(!img || !img.complete || !img.naturalWidth) return false;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    ctx.fillStyle = '#1a422f';
    ctx.fillRect(0, 0, w, h);

    const scale = Math.min(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;

    ctx.drawImage(img, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
    drawnFrame = index;
    return true;
  }

  // تحميل ذكي بدون تكرار وخنق للذاكرة
  function loadFrame(index, callback){
    if(index < 0 || index >= total) return;
    if(images[index]) {
      if(callback) callback(images[index]);
      return;
    }

    const img = new Image();
    img.decoding = 'async';
    img.src = framePath(index);
    img.onload = () => {
      images[index] = img;
      if(callback) callback(img);
      if(index === 0 && loading) loading.classList.add('is-hidden');
    };
    images[index] = img;
  }

  // تحميل أولي ذكي بالخلفية
  function initPreload(){
    // حمل أول فريم فوراً
    loadFrame(0, () => drawFrame(0));
    // حمل باقي الفريمات بالخلفية بالتدريج بدون حرق موارد المتصفح
    let i = 1;
    function loadNext(){
      if(i < total){
        loadFrame(i);
        i++;
        setTimeout(loadNext, 15);
      }
    }
    loadNext();
  }

  function nearestLoaded(target){
    if(images[target] && images[target].complete && images[target].naturalWidth) return target;
    for(let d = 1; d < total; d++){
      const l = target - d;
      const r = target + d;
      if(l >= 0 && images[l] && images[l].complete && images[l].naturalWidth) return l;
      if(r < total && images[r] && images[r].complete && images[r].naturalWidth) return r;
    }
    return -1;
  }

  function renderProgress(progress){
    const clamped = Math.max(0, Math.min(1, progress));
    
    // سكرول بطيء ومدروس: الفريمات بتنتهي عند 85%
    const frameProgress = Math.min(1, clamped / 0.85);
    currentFrame = Math.round(frameProgress * (total - 1));

    // رسم عبر requestAnimationFrame حتى لا يعلّق السكرول نهائياً
    if(!isTicking){
      requestAnimationFrame(() => {
        const ready = nearestLoaded(currentFrame);
        if(ready >= 0) drawFrame(ready);

        // تسليم ناعم بآخر 15% وتلاشي
        if(clamped > 0.85){
          const fade = 1 - ((clamped - 0.85) / 0.15);
          canvas.style.opacity = Math.max(0, fade).toString();
        } else {
          canvas.style.opacity = '1';
        }
        // تحكم بظهور واختفاء النصوص العائمة بحسب مرحلة السكرول
        const introCard = document.getElementById('overlay-intro');
        const leftCard = document.getElementById('overlay-step-1');
        const rightCard = document.getElementById('overlay-step-2');

        if (introCard && leftCard && rightCard) {
          // الكرت الأول الترحيبي: يختفي بعد 25% من السكرول
          if (clamped < 0.25) {
            introCard.style.opacity = (1 - (clamped / 0.25)).toString();
            introCard.style.transform = `translateY(${clamped * -20}px)`;
          } else {
            introCard.style.opacity = '0';
          }

          // الكرت الثاني: يظهر بنصف السكرول ويختفي بعدين
          if (clamped >= 0.25 && clamped < 0.65) {
            const p = (clamped - 0.25) / 0.4;
            leftCard.style.opacity = (p < 0.5 ? p * 2 : (1 - p) * 2).toString();
            leftCard.style.transform = `translateY(${(1 - p) * 15}px)`;
          } else {
            leftCard.style.opacity = '0';
          }

          // الكرت الثالث: يظهر بآخر لفة القنينة
          if (clamped >= 0.65 && clamped < 0.9) {
            const p = (clamped - 0.65) / 0.25;
            rightCard.style.opacity = (p < 0.5 ? p * 2 : (1 - p) * 2).toString();
            rightCard.style.transform = `translateY(${(1 - p) * 15}px)`;
          } else {
            rightCard.style.opacity = '0';
          }
        }

        isTicking = false;
      });
      isTicking = true;
    }
  }

  function setupPin(){
    if(!window.gsap || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    if(trigger) trigger.kill();

    trigger = ScrollTrigger.create({
      id: 'zadona-product-sequence',
      trigger: section,
      pin: true,
      pinSpacing: true,
      anticipatePin: 1,
      scrub: 0.5,
      start: 'top top',
      end: '+=450vh', // زودنا المسافة حتى تكون الحركة هادية ومو سريعة
      invalidateOnRefresh: true,
      onUpdate: self => renderProgress(self.progress),
      onRefresh: self => renderProgress(self.progress),
      onLeaveBack: () => {
        // تنظيف وحماية: لما ترجع للهيرو فوق، اتأكد الكانفاس ما يعلق بوش المستخدم
        canvas.style.opacity = '1';
      }
    });

    ScrollTrigger.refresh();
  }

  function refresh(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      if(window.ScrollTrigger) ScrollTrigger.refresh();
    }, 100);
  }

  resizeCanvas();
  initPreload();

  if(document.readyState === 'complete'){
    setupPin();
  } else {
    window.addEventListener('load', setupPin, {once: true});
  }

  window.addEventListener('resize', refresh, {passive: true});
  window.addEventListener('orientationchange', refresh, {passive: true});
})();