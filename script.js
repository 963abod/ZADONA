const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}));

(function(){
  const section=document.getElementById('product-sequence');
  const track=section&&section.parentElement;
  const canvas=document.getElementById('product-sequence-canvas');
  const loading=document.getElementById('sequence-loading');
  if(!section||!track||!canvas)return;

  const ctx=canvas.getContext('2d',{alpha:false});
  const total=150, images=new Array(total);
  let current=-1, raf=0, started=false, resizeTimer=0;
  const path=i=>`./public/frames/frame_${String(i+1).padStart(4,'0')}.jpg`;

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    const w=Math.max(1,canvas.clientWidth||innerWidth);
    const h=Math.max(1,canvas.clientHeight||innerHeight);
    canvas.width=Math.round(w*dpr);
    canvas.height=Math.round(h*dpr);
    ctx.setTransform(dpr,0,0,dpr,0,0);
    if(current>=0)draw(current);
  }

  function draw(i){
    const img=images[i];
    if(!img||!img.complete||!img.naturalWidth)return;
    const w=canvas.clientWidth,h=canvas.clientHeight;
    ctx.fillStyle='#1a422f';
    ctx.fillRect(0,0,w,h);
    const s=Math.min(w/img.naturalWidth,h/img.naturalHeight);
    const dw=img.naturalWidth*s,dh=img.naturalHeight*s;
    ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);
  }

  function load(i){
    if(i<0||i>=total||images[i])return;
    const img=new Image();
    img.decoding='async';
    img.onload=()=>{
      if(!started){
        started=true;
        if(loading)loading.classList.add('is-hidden');
      }
      if(i===current)draw(i);
    };
    img.src=path(i);
    images[i]=img;
  }

  function preloadAround(center){
    const c=Math.round(center);
    for(let d=0;d<=18;d++){
      load(c+d);
      if(d<=7)load(c-d);
    }
  }

  function render(i){
    current=Math.max(0,Math.min(total-1,Math.round(i)));
    preloadAround(current);
    if(images[current]&&images[current].complete)draw(current);
  }

  function setupScroll(){
    if(!window.gsap||!window.ScrollTrigger){
      track.style.height='250vh';
      section.style.position='sticky';
      section.style.top='0';
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.getAll().forEach(t=>{
      if(t.vars&&t.vars.id==='zadona-product-sequence')t.kill();
    });

    gsap.to({},{
      id:'zadona-product-sequence',
      scrollTrigger:{
        trigger:track,
        start:'top top',
        end:'+=2500',
        pin:section,
        pinSpacing:true,
        scrub:1,
        invalidateOnRefresh:true,
        anticipatePin:1,
        onUpdate:self=>render(self.progress*(total-1))
      }
    });

    ScrollTrigger.refresh();
  }

  function refresh(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(()=>{
      resize();
      if(window.ScrollTrigger)ScrollTrigger.refresh();
    });
  }

  resize();
  load(0);
  preloadAround(0);
  render(0);

  if(window.gsap&&window.ScrollTrigger){
    if(document.readyState==='complete')setupScroll();
    else addEventListener('load',setupScroll,{once:true});
  }else{
    setupScroll();
  }

  addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer=setTimeout(refresh,120);
  },{passive:true});

  addEventListener('orientationchange',refresh,{passive:true});
})();
