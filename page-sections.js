'use strict';
// Apartados independientes con enlaces compartibles y navegación nativa del historial.
(()=>{
 const header=document.querySelector('.header'),main=document.getElementById('main-content');
 const select=document.getElementById('page-section-select'),jump=document.querySelector('.page-section-jump');
 const context=document.querySelector('.view-context'),contextTitle=document.getElementById('view-context-title');
 const panels=[...document.querySelectorAll('main [data-page-view]')];
 if(!header||!main||!select||!jump||!context||!contextTitle||!panels.length)return;
 const names={inicio:'Inicio',nosotros:'Nosotros',combos:'Combos',lineas:'Productos',asesor:'Asesor de Cultivos',analisis:'Análisis de suelo',garantia:'Acompañamiento','tricho-sustrato':'TRICHO en sustrato',humicos:'Ácidos húmicos'};
 const modalIds=new Set(['detalle-tricho','detalle-bact','detalle-insecta']);
 const baseTitle=document.title;
 let current=null;
 function closeMenu(){
  document.getElementById('navlinks')?.classList.remove('is-open');
  document.getElementById('menu-toggle')?.setAttribute('aria-expanded','false');
 }
 function measure(){document.documentElement.style.setProperty('--galyon-header-height',Math.ceil(header.getBoundingClientRect().height)+'px');}
 function show(view,{scroll=true,focus=true}={}){
  if(!Object.hasOwn(names,view))return;
  current=view;
  for(const panel of panels)panel.hidden=panel.dataset.pageView!==view;
  document.querySelector('.catalog-chapter').hidden=!['lineas','tricho-sustrato','humicos'].includes(view);
  main.dataset.currentView=view;
  context.hidden=view==='inicio';contextTitle.textContent=names[view];
  const group=['tricho-sustrato','humicos'].includes(view)?'lineas':view;
  for(const link of header.querySelectorAll('.navlinks a')){
   if(link.hash==='#'+group)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  }
  select.value=view;document.title=view==='inicio'?baseTitle:names[view]+' | GALYON';
  closeMenu();measure();
  if(focus){
   const heading=panels.find(panel=>!panel.hidden)?.querySelector('h1,h2,h3');
   if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}
  }
  if(scroll)window.scrollTo({top:0,left:0,behavior:'instant'});
 }
 function navigate(view,{replace=false}={}){
  if(!Object.hasOwn(names,view))return;
  const url=location.pathname+location.search+(view==='inicio'?'':'#'+view);
  if(url!==location.pathname+location.search+location.hash)history[replace?'replaceState':'pushState'](null,'',url);
  show(view);
 }
 function readLocation({initial=false}={}){
  const id=location.hash.slice(1);
  if(modalIds.has(id)){
   if(!current)show('lineas',{scroll:false,focus:false});
   document.getElementById(id)?.classList.remove('is-dismissed');
   return;
  }
  show(Object.hasOwn(names,id)?id:'inicio',{focus:!initial});
 }
 document.addEventListener('click',event=>{
  if(event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest('a[href]');
  if(!link||link.target||link.hasAttribute('download'))return;
  const url=new URL(link.href,location.href),id=url.hash.slice(1);
  if(url.origin!==location.origin||url.pathname!==location.pathname||url.search!==location.search||!Object.hasOwn(names,id))return;
  event.preventDefault();navigate(id);
 });
 select.addEventListener('change',()=>navigate(select.value));
 window.addEventListener('hashchange',()=>readLocation());
 window.addEventListener('galyon:home',()=>show('inicio',{focus:false}));
 window.addEventListener('resize',measure,{passive:true});
 if('ResizeObserver' in window)new ResizeObserver(measure).observe(header);
 window.galyonPage={current:()=>current,navigate};
 document.documentElement.classList.add('galyon-views');
 jump.hidden=false;readLocation({initial:true});
})();
