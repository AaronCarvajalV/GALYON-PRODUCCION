'use strict';
// Carrusel del tercer cuadro. El número de imágenes puede ampliarse sin cambiar el temporizador.
(()=>{
 const gallery=document.querySelector('.identity-photo-solution');
 if(!gallery)return;
 const slides=[...gallery.querySelectorAll('.identity-product-slide')];
 const controls=gallery.querySelector('.identity-product-controls');
 const dots=[...gallery.querySelectorAll('[data-product-slide]')];
 const pause=gallery.querySelector('.identity-product-pause');
 if(slides.length<2||!controls||!pause)return;
 const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
 let current=0,timer=null,paused=motion.matches,visible=false,hovered=false;
 function show(index){
  current=(index+slides.length)%slides.length;
  slides.forEach((slide,i)=>{slide.classList.toggle('is-current',i===current);slide.setAttribute('aria-hidden',String(i!==current));});
  dots.forEach((dot,i)=>dot.setAttribute('aria-pressed',String(i===current)));
 }
 function schedule(){
  clearInterval(timer);timer=null;
  pause.setAttribute('aria-pressed',String(paused));
  pause.setAttribute('aria-label',paused?'Reanudar carrusel':'Pausar carrusel');
  if(pause.dataset.paused!==String(paused)){
   pause.dataset.paused=String(paused);
   pause.innerHTML=paused?'<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M4 2l10 6-10 6z"/></svg>':'<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true"><path fill="currentColor" d="M3 2h4v12H3zM9 2h4v12H9z"/></svg>';
  }
  if(visible&&!document.hidden&&!hovered&&!paused&&!gallery.contains(document.activeElement))timer=setInterval(()=>show(current+1),6000);
 }
 dots.forEach(dot=>dot.addEventListener('click',()=>{show(Number(dot.dataset.productSlide));schedule();}));
 pause.addEventListener('click',()=>{paused=!paused;schedule();});
 gallery.addEventListener('mouseenter',()=>{hovered=true;schedule();});
 gallery.addEventListener('mouseleave',()=>{hovered=false;schedule();});
 gallery.addEventListener('focusin',schedule);
 gallery.addEventListener('focusout',()=>setTimeout(schedule,0));
 document.addEventListener('visibilitychange',schedule);
 motion.addEventListener('change',()=>{paused=motion.matches;schedule();});
 if('IntersectionObserver' in window)new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();}).observe(gallery);
 else visible=true;
 controls.hidden=false;show(0);schedule();
})();
