const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
  const target=document.querySelector(a.getAttribute('href'));
  if(target){e.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}
}));

(function(){
  const section=document.getElementById('product-sequence');
  const canvas=document.getElementById('product-sequence-canvas');
  const loading=document.getElementById('sequence-loading');
  if(!section||!canvas)return;

  const ctx=canvas.getContext('2d',{alpha:false,desynchronized:true});
  const total=150;
  const images=new Array(total);
  let currentFrame=0;
  let drawnFrame=-1;
  let dpr=1;
  let resizeTimer=0;
  let trigger=null;

  const framePath=i=>`./public/frames/frame_${String(i+1).padStart(4,'0')}.jpg`;

  function resizeCanvas(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    const rect=canvas.getBoundingClientRect();
    const w=Math.max(1,Math.round(rect.width));
    const h=Math.max(1,Math.round(rect.height));
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(images[drawnFrame])drawFrame(drawnFrame);
  }

  function drawFrame(index){
    const img=images[index];
    if(!img||!img.complete||!img.naturalWidth)return false;
    const w=canvas.clientWidth||window.innerWidth;
    const h=canvas.clientHeight||window.innerHeight;
    ctx.fillStyle='#1a422f';
    ctx.fillRect(0,0,w,h);

    const scale=Math.min(w/img.naturalWidth,h/img.naturalHeight);
    const dw=img.naturalWidth*scale;
    const dh=img.naturalHeight*scale;
    ctx.drawImage(img,(w-dw)*.5,(h-dh)*.5,dw,dh);
    drawnFrame=index;
    return true;
  }

  function loadFrame(index){
    if(index<0||index>=total||images[index])return;
    const img=new Image();
    img.decoding='async';
    img.src=framePath(index);
    img.onload=()=>{
      images[index]=img;
      if(index===currentFrame||drawnFrame<0){
        drawFrame(index);
        if(loading)loading.classList.add('is-hidden');
      }
    };
    img.onerror=()=>{images[index]=null;};
    images[index]=img;
  }

  function preloadWindow(center){
    const c=Math.max(0,Math.min(total-1,Math.round(center)));
    const radius=12;
    for(let offset=-radius;offset<=radius;offset++)loadFrame(c+offset);
    loadFrame(0);
    loadFrame(total-1);
  }

  function nearestLoaded(target){
    if(images[target]&&images[target].complete&&images[target].naturalWidth)return target;
    for(let distance=1;distance<total;distance++){
      const left=target-distance;
      const right=target+distance;
      if(left>=0&&images[left]&&images[left].complete&&images[left].naturalWidth)return left;
      if(right<total&&images[right]&&images[right].complete&&images[right].naturalWidth)return right;
    }
    return -1;
  }

  function renderProgress(progress){
    const clamped=Math.max(0,Math.min(1,progress));
    currentFrame=Math.round(clamped*(total-1));
    preloadWindow(currentFrame);
    const ready=nearestLoaded(currentFrame);
    if(ready>=0)drawFrame(ready);
  }

  function setupPin(){
    if(!window.gsap||!window.ScrollTrigger){
      console.error('GSAP ScrollTrigger failed to load.');
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    if(trigger)trigger.kill();

    trigger=ScrollTrigger.create({
      id:'zadona-product-sequence',
      trigger:section,
      pin:true,
      pinSpacing:true,
      anticipatePin:1,
      scrub:1,
      start:'top top',
      end:'+=2000',
      invalidateOnRefresh:true,
      onUpdate:self=>renderProgress(self.progress),
      onRefresh:self=>renderProgress(self.progress),
      onLeave:()=>{
        section.classList.add('is-complete');
      },
      onEnterBack:()=>{
        section.classList.remove('is-complete');
      }
    });

    ScrollTrigger.refresh();
  }

  function refresh(){
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(()=>{
      resizeCanvas();
      if(window.ScrollTrigger)ScrollTrigger.refresh();
    },120);
  }

  resizeCanvas();
  loadFrame(0);
  preloadWindow(0);

  if(document.readyState==='complete')setupPin();
  else window.addEventListener('load',setupPin,{once:true});

  window.addEventListener('resize',refresh,{passive:true});
  window.addEventListener('orientationchange',refresh,{passive:true});
})();
