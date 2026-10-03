const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth'})}}));
/* ZADONA scroll-driven product image sequence */
(function(){
  const section=document.getElementById('product-sequence'),canvas=document.getElementById('product-sequence-canvas'),loading=document.getElementById('sequence-loading');
  if(!section||!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false}),total=150,images=new Array(total);
  let current=-1,raf=0;
  const path=i=>'/frames/frame_'+String(i+1).padStart(4,'0')+'.jpg';
  function resize(){const dpr=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||innerWidth,h=canvas.clientHeight||innerHeight;canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);if(current>=0)draw(current)}
  function draw(i){const img=images[i];if(!img||!img.complete||!img.naturalWidth)return;const w=canvas.clientWidth,h=canvas.clientHeight;ctx.fillStyle='#1a422f';ctx.fillRect(0,0,w,h);const s=Math.min(w/img.naturalWidth,h/img.naturalHeight),dw=img.naturalWidth*s,dh=img.naturalHeight*s;ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh)}
  function render(i){i=Math.max(0,Math.min(total-1,Math.round(i)));if(i===current)return;current=i;draw(i)}
  function onScroll(){if(raf)return;raf=requestAnimationFrame(()=>{raf=0;const r=section.getBoundingClientRect(),max=Math.max(1,section.offsetHeight-innerHeight);render(((innerHeight-r.top)/max)*(total-1))})}
  function preload(){for(let i=0;i<total;i++){const img=new Image();img.decoding='async';img.src=path(i);img.onload=()=>{if(i===0){render(0);loading.classList.add('is-hidden')}};images[i]=img}}
  resize();addEventListener('resize',resize,{passive:true});addEventListener('scroll',onScroll,{passive:true});preload();
})();