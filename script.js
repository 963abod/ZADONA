const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));

(function(){
  const section=document.getElementById('product-sequence'),
        canvas=document.getElementById('product-sequence-canvas'),
        loading=document.getElementById('sequence-loading');
  if(!section||!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false}),
        total=150,
        images=new Array(total);
  let current=-1,raf=0,started=false;
  const path=i=>new URL('./frames/frame_'+String(i+1).padStart(4,'0')+'.jpg',document.baseURI).href;
  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.5),
          w=Math.max(1,canvas.clientWidth||innerWidth),
          h=Math.max(1,canvas.clientHeight||innerHeight);
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
    const s=Math.min(w/img.naturalWidth,h/img.naturalHeight),
          dw=img.naturalWidth*s,dh=img.naturalHeight*s;
    ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);
  }
  function load(i){
    if(i<0||i>=total||images[i])return;
    const img=new Image();
    img.decoding='async';
    img.onload=()=>{
      if(!started){
        started=true;
        render(0);
        if(loading)loading.classList.add('is-hidden');
      }
      if(i===current)draw(i);
    };
    img.onerror=()=>{
      if(i===0&&loading)loading.textContent='ZADONA / FRAME ERROR';
    };
    img.src=path(i);
    images[i]=img;
  }
  function preloadAround(center){
    for(let d=0;d<=8;d++){
      load(center-d);
      load(center+d);
    }
  }
  function render(i){
    i=Math.max(0,Math.min(total-1,Math.round(i)));
    preloadAround(i);
    current=i;
    if(images[i]&&images[i].complete)draw(i);
  }
  function onScroll(){
    if(raf)return;
    raf=requestAnimationFrame(()=>{
      raf=0;
      const r=section.getBoundingClientRect();
      const sequenceTop=section.offsetTop;
      const sequenceHeight=section.offsetHeight;
      const viewport=innerHeight;
      const p=Math.max(0,Math.min(1,(viewport-r.top)/(sequenceHeight)));
      render(p*(total-1));
    });
  }
  resize();
  load(0);
  addEventListener('resize',resize,{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
})();
