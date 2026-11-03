// Entradas nuevas sin ancla y recargas desde arriba; conservar enlaces e historial.
(()=>{
 const navigation=performance.getEntriesByType('navigation')[0];
 const reload=navigation?.type==='reload';
 const previousRestoration=history.scrollRestoration;
 if(reload)history.scrollRestoration='manual';
 function goHome(){
  if(!navigation)return;
  if(!reload&&(navigation.type!=='navigate'||location.hash))return;
  window.scrollTo({top:0,left:0,behavior:'instant'});
 }
 window.addEventListener('load',()=>{
  goHome();
  requestAnimationFrame(()=>{
   goHome();
   if(reload)history.scrollRestoration=previousRestoration;
  });
 },{once:true});
})();
