// Solo entradas nuevas sin ancla; conservar recargas, enlaces internos e historial.
(()=>{
 function goHome(){
  const navigation=performance.getEntriesByType('navigation')[0];
  if(!navigation||navigation.type!=='navigate'||location.hash)return;
  window.scrollTo({top:0,left:0,behavior:'instant'});
 }
 window.addEventListener('load',()=>{goHome();requestAnimationFrame(goHome);},{once:true});
})();
