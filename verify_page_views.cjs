#!/usr/bin/env node
'use strict';
// Servir la raíz antes de ejecutar. PLAYWRIGHT_MODULE_PATH permite usar una instalación existente.
const {chromium}=require(process.env.PLAYWRIGHT_MODULE_PATH||'playwright');
const assert=require('node:assert/strict');
const base=process.env.GALYON_TEST_URL||'http://127.0.0.1:8000/';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 try{
  for(const width of [1440,1024,390,320]){
   const page=await browser.newPage({viewport:{width,height:1000}}),errors=[],badAssets=[];
   page.on('pageerror',error=>errors.push(error.message));
   page.on('response',response=>{if(response.url().includes('/assets/')&&response.status()>=400)badAssets.push(response.url());});
   await page.goto(base,{waitUntil:'networkidle'});
   const checkView=async view=>{
    await page.waitForFunction(view=>document.querySelector('main').dataset.currentView===view,view);
    const shown=await page.locator('main [data-page-view]').evaluateAll(els=>els.filter(el=>getComputedStyle(el).display!=='none').map(el=>el.dataset.pageView));
    assert(shown.length>0&&shown.every(name=>name===view),'Contenido de otro apartado visible: '+view);
    assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'Desbordamiento: '+view+' / '+width);
    assert.equal(await page.locator('#page-section-select').inputValue(),view);
   };
   const visit=async view=>{
    if(width<=1100)await page.locator('#page-section-select').selectOption(view);
    else await page.locator('a[href="#'+view+'"]:visible').first().click();
    await checkView(view);
   };
   const choose=key=>page.locator('[data-advisor-value]').evaluateAll((els,key)=>{
    const el=els.find(el=>el.dataset.advisorValue===key);if(!el)throw Error('Opción ausente: '+key);el.click();
   },key);
   await checkView('inicio');assert(!(await page.locator('#asesor').isVisible()));
   assert.equal(await page.locator('.home-paths a').count(),4);
   if(width===390||width===1440)await page.screenshot({path:'/tmp/galyon-home-views-'+width+'.png',fullPage:true});
   for(const view of ['combos','lineas','tricho-sustrato','humicos','asesor','analisis','nosotros','garantia']){
    await visit(view);
    // Siempre se entra por arriba; los otros capítulos no están debajo.
    assert(await page.evaluate(()=>scrollY<5),'No abrió desde arriba: '+view);
    if(view==='analisis')assert.equal(await page.locator('.soilv2-card:visible').count(),5);
    if(view==='nosotros')assert.equal(await page.locator('.identity-gallery-steps:visible').count(),1);
   }
   await visit('combos');await page.locator('[data-combo="cacao"]').click();
   assert(await page.locator('#cart-drawer').evaluate(el=>el.classList.contains('is-open')));
   const before=Number(await page.locator('#cart-count').innerText());
   await page.locator('#cart-items [data-delta="1"]').first().click();
   assert.equal(Number(await page.locator('#cart-count').innerText()),before+1);
   await page.locator('#close-cart').click();await visit('lineas');
   assert.equal(Number(await page.locator('#cart-count').innerText()),before+1);
   await page.locator('.view-line[href="#detalle-tricho"]').click();
   assert(await page.locator('#detalle-tricho').evaluate(el=>el.matches(':target')&&!el.classList.contains('is-dismissed')));
   await page.locator('#detalle-tricho .galyon-modal-close').click();await checkView('lineas');assert.equal(new URL(page.url()).hash,'#lineas');
   await visit('asesor');await choose('Cacao');await choose('Frutos o mazorcas');
   assert.equal(await page.locator('[data-advisor-value="cacao_blanco"] img').getAttribute('src'),'assets/asesor/v52_cacao_moniliasis_foto_real.webp');
   await choose('cacao_blanco');assert((await page.locator('.advisor-cta-v523').getAttribute('href')).includes('wa.me/'));
   await page.locator('.advisor-line-link').first().click();
   assert.equal(new URL(page.url()).hash,'#detalle-bact');
   await page.locator('#detalle-bact .galyon-modal-close').click();await checkView('asesor');assert.equal(new URL(page.url()).hash,'#asesor');
   await visit('analisis');await page.goBack();await checkView('asesor');assert(await page.locator('.advisor-result-v523').isVisible());
   await page.goForward();await checkView('analisis');
   await page.locator('.header .brand').click();await checkView('inicio');assert.equal(new URL(page.url()).hash,'');
   await page.goto(base+'#analisis',{waitUntil:'networkidle'});await checkView('analisis');
   await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));await page.reload({waitUntil:'networkidle'});await checkView('analisis');assert(await page.evaluate(()=>scrollY<5));
   await page.goto(base+'?entry=modal#detalle-bact',{waitUntil:'networkidle'});await checkView('lineas');assert(await page.locator('#detalle-bact').evaluate(el=>el.matches(':target')));
   await page.locator('#detalle-bact .galyon-modal-close').click();await checkView('lineas');
   if(width<=1100){await page.locator('#menu-toggle').click();await page.locator('#navlinks a[href="#asesor"]').click();await checkView('asesor');assert(!(await page.locator('#navlinks').isVisible()));}
   assert.deepEqual(errors,[]);assert.deepEqual(badAssets,[]);
   console.log(width+': vistas independientes, historial, enlaces directos, recarga, logo, fichas, carrito y asesor OK');await page.close();
  }
  const fallback=await browser.newPage({javaScriptEnabled:false});await fallback.goto(base);assert(await fallback.locator('#analisis').isVisible());assert(await fallback.locator('#asesor').isVisible());await fallback.close();
  console.log('Sin JavaScript: contenido completo disponible.');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
