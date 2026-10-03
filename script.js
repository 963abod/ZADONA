const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));

(function(){
  const section=document.getElementById('product-sequence'),
        canvas=document.getElementById('product-sequence-canvas'),
        loading=document.getElementById('sequence-loading');
  if(!section||!canvas)return;

  const ctx=canvas.getContext('2d',{alpha:false}),
        total=150,
        images=new Array(total);
  let current=-1,raf=0,started=false,preloadCursor=0;

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
    const radius=18;
    for(let d=0;d<=radius;d++){
      load(center-d);
      load(center+d);
    }
  }

  function preloadRest(){
    if(preloadCursor>=total)return;
    const batch=4;
    for(let n=0;n<batch&&preloadCursor<total;n++,preloadCursor++) load(preloadCursor);
    if('requestIdleCallback' in window) requestIdleCallback(preloadRest,{timeout:500});
    else setTimeout(preloadRest,120);
  }

  function render(i){
    i=Math.max(0,Math.min(total-1,Math.round(i)));
    preloadAround(i);
    current=i;
    if(images[i]&&images[i].complete)draw(i);
  }

  function update(){
    raf=0;
    const r=section.getBoundingClientRect();
    const travel=Math.max(1,section.offsetHeight-innerHeight);
    const p=Math.max(0,Math.min(1,-r.top/travel));

    section.classList.toggle('is-pinned',r.top<=0&&r.bottom>innerHeight);
    section.classList.toggle('is-ended',r.bottom<=innerHeight);

    render(p*(total-1));
  }

  function onScroll(){
    if(raf)return;
    raf=requestAnimationFrame(update);
  }

  resize();
  load(0);
  preloadRest();
  update();

  addEventListener('resize',()=>{
    resize();
    update();
  },{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
})();