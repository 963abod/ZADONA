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

  function loadFrame(index, callback){
    if(index < 0 || index >= total) return;
    if(images[index]) {
      if(callback && images[index].complete) callback(images[index]);
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

  // تحميل ذكي: يحمل الفريمات المحيطة بمكان إصبعك فوراً حتى لا تتجمد الحركة
  function preloadAround(target){
    const radius = 10;
    for(let i = -radius; i <= radius; i++){
      loadFrame(target + i);
    }
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
    currentFrame = Math.round(clamped * (total - 1));

    // اطلب الفريمات القريبة فوراً
    preloadAround(currentFrame);

    const ready = nearestLoaded(currentFrame);
    if(ready >= 0) drawFrame(ready);

    // تحكم سلس بالنصوص
    const introCard = document.getElementById('overlay-intro');
    const leftCard = document.getElementById('overlay-step-1');
    const rightCard = document.getElementById('overlay-step-2');

    if(introCard){
      introCard.style.opacity = clamped < 0.2 ? (1 - clamped / 0.2).toString() : '0';
      introCard.style.pointerEvents = clamped < 0.2 ? 'auto' : 'none';
    }

    if(leftCard){
      if(clamped >= 0.25 && clamped <= 0.65){
        const p = (clamped - 0.25) / 0.4;
        leftCard.style.opacity = (p < 0.5 ? p * 2 : (1 - p) * 2).toString();
      } else {
        leftCard.style.opacity = '0';
      }
    }

    if(rightCard){
      if(clamped > 0.65){
        const p = (clamped - 0.65) / 0.35;
        rightCard.style.opacity = Math.min(1, p * 2).toString();
      } else {
        rightCard.style.opacity = '0';
      }
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
      scrub: 0.3,
      start: 'top top',
      end: '+=400vh',
      invalidateOnRefresh: true,
      onUpdate: self => renderProgress(self.progress),
      onRefresh: self => renderProgress(self.progress)
    });

    ScrollTrigger.refresh();
  }

  function refresh(){
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      if(window.ScrollTrigger) ScrollTrigger.refresh();
    }, 80);
  }

  resizeCanvas();
  loadFrame(0, () => drawFrame(0));
  preloadAround(0);

  if(document.readyState === 'complete'){
    setupPin();
  } else {
    window.addEventListener('load', setupPin, {once: true});
  }

  window.addEventListener('resize', refresh, {passive: true});
  window.addEventListener('orientationchange', refresh, {passive: true});
})();