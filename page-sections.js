'use strict';
// Orientación en la página: enlaces nativos y sección activa, sin ocultar contenido.
(()=>{
 const header=document.querySelector('.header');
 const select=document.getElementById('page-section-select');
 const jump=document.querySelector('.page-section-jump');
 if(!header||!select||!jump)return;
 const ids=['nosotros','asesor','combos','lineas','tricho-sustrato','humicos','analisis','garantia'];
 const sections=ids.map(id=>document.getElementById(id)).filter(Boolean);
 const links=[...header.querySelectorAll('.navlinks a[href^="#"]')];
 let frame=null,headerHeight=0;
 function update(){
  frame=null;
  const height=Math.ceil(header.getBoundingClientRect().height);
  if(height!==headerHeight){headerHeight=height;document.documentElement.style.setProperty('--galyon-header-height',height+'px');}
  let current='inicio';
  for(const section of sections){if(section.getBoundingClientRect().top<=height+40)current=section.id;}
  const group=current==='humicos'||current==='tricho-sustrato'?'lineas':current;
  for(const link of links){if(link.hash==='#'+group)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');}
  if(select.value!==current)select.value=current;
 }
 function schedule(){if(frame===null)frame=requestAnimationFrame(update);}
 select.addEventListener('change',()=>{
  const target=document.getElementById(select.value);
  if(!target)return;
  document.getElementById('navlinks')?.classList.remove('is-open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded','false');
  if(select.value==='inicio'&&window.resetToHome){window.resetToHome();schedule();return;}
  if(location.hash==='#'+target.id)target.scrollIntoView({block:'start'});
  else location.hash=target.id;
 });
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 window.addEventListener('hashchange',schedule);
 if('ResizeObserver' in window)new ResizeObserver(schedule).observe(header);
 jump.hidden=false;update();
})();

// Movimiento ambiental de hojas: parallax suave al hacer scroll y pausa al desenfocar pestaña
(()=>{
 const bg=document.querySelector('.leaf-shadows-bg');
 const drift=document.querySelector('.leaf-shadows-drift');
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(!bg)return;
 let ticking=false;
 function updateParallax(){
  ticking=false;
  if(motion.matches)return;
  const scrollY=window.pageYOffset||document.documentElement.scrollTop||0;
  bg.style.setProperty('--leaf-scroll-y',`${-(scrollY * 0.022).toFixed(1)}px`);
 }
 function onScroll(){
  if(!ticking){
   requestAnimationFrame(updateParallax);
   ticking=true;
  }
 }
 window.addEventListener('scroll',onScroll,{passive:true});
 document.addEventListener('visibilitychange',()=>{
  if(drift){
   drift.style.animationPlayState=document.hidden?'paused':'running';
  }
 });
})();

