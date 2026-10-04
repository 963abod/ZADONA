const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.isIntersecting&&e.target.classList.add('show')),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}));

(function(){
  const section=document.getElementById('product-sequence'),track=section&&section.parentElement,canvas=document.getElementById('product-sequence-canvas'),loading=document.getElementById('sequence-loading');
  if(!section||!track||!canvas)return;
  const ctx=canvas.getContext('2d',{alpha:false}),total=150,images=new Array(total);
  let current=-1,raf=0,started=false;
  const path=i=>`./public/frames/frame_${String(i+1).padStart(4,'0')}.jpg`;

  function resize(){
    const dpr=Math.min(window.devicePixelRatio||1,1.5),w=Math.max(1,canvas.clientWidth||innerWidth),h=Math.max(1,canvas.clientHeight||innerHeight);
    canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    if(current>=0)draw(current);
  }
  function draw(i){
    const img=images[i];if(!img||!img.complete||!img.naturalWidth)return;
    const w=canvas.clientWidth,h=canvas.clientHeight;ctx.fillStyle='#1a422f';ctx.fillRect(0,0,w,h);
    const s=Math.min(w/img.naturalWidth,h/img.naturalHeight),dw=img.naturalWidth*s,dh=img.naturalHeight*s;
    ctx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);
  }
  function load(i){
    if(i<0||i>=total||images[i])return;
    const img=new Image();img.decoding='async';
    img.onload=()=>{if(!started){started=true;if(loading)loading.classList.add('is-hidden')}if(i===current)draw(i)};
    img.src=path(i);images[i]=img;
  }
  function preloadAround(center){for(let d=0;d<=22;d++){load(center+d);if(d<=8)load(center-d)}}
  function render(i){current=Math.max(0,Math.min(total-1,Math.round(i)));preloadAround(current);if(images[current]&&images[current].complete)draw(current)}
  function update(){
    raf=0;const r=track.getBoundingClientRect(),travel=Math.max(1,track.offsetHeight-innerHeight),raw=Math.max(0,Math.min(1,-r.top/travel));
    const p=raw<.84?(raw/.84)*.58:.58+((raw-.84)/.16)*.42;
    render(p*(total-1));
  }
  function onScroll(){if(!raf)raf=requestAnimationFrame(update)}
  resize();load(0);preloadAround(0);update();
  addEventListener('resize',()=>{resize();update()},{passive:true});
  addEventListener('scroll',onScroll,{passive:true});
})();