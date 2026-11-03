#!/usr/bin/env node
'use strict';
// Verifica las asociaciones por cultivo/órgano sin alterar datos ni resultados.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('script.js','utf8');
const elements={};
const element=id=>elements[id]??={dataset:{},children:Array.from({length:4},()=>({classList:{toggle(){}}})),addEventListener(){},contains(){return true},querySelectorAll(){return[]}};
const code=source.slice(source.indexOf('// GALYON Asesor de Cultivos')).replace('(()=>{','function advisor(){').replace(/ render\(\);\n\}\)\(\);\s*$/,' return {data,partsForCrop,chooseSymptoms,farmCrops,grid,advisorCardImages};\n}\nadvisor();');
const sim=vm.runInNewContext(code,{document:{getElementById:element},window:{},encodeURIComponent});
let cards=0,replaced=0;const used=new Set();
for(const crop of sim.farmCrops){
 if(crop.key==='Otro cultivo')continue;
 Object.assign(sim.data,{area:'Finca o plantación',crop:crop.key});
 const parts=sim.partsForCrop();
 const check=(items,kind)=>{
  const snapshot=JSON.stringify(items),html=sim.grid(items,kind);
  for(const item of items){
   if(item.key==='otro')continue;
   const key=[crop.key,kind==='parts'?'':sim.data.part,kind,item.key].join('|');
   const image=sim.advisorCardImages[key]||item.image;
   assert(image,'Sin imagen: '+key);assert(fs.existsSync('assets/asesor/'+image+'.webp'),image);
   assert(html.includes('data-advisor-value="'+item.key+'"'));cards++;
   if(sim.advisorCardImages[key]){used.add(key);replaced++;assert(html.includes('aria-description="Ilustración generada de referencia"'));}
  }
  assert.equal(JSON.stringify(items),snapshot,'Datos mutados');
 };
 check(parts,'parts');
 for(const part of parts){sim.data.part=part.key;check(sim.chooseSymptoms(),'symptoms');}
}
assert.equal(cards,123);assert.equal(used.size,Object.keys(sim.advisorCardImages).length);
const ledger=JSON.parse(fs.readFileSync('docs/asesor-imagenes-revision.json','utf8'));
assert.equal(ledger.entries.length,43);assert.equal(ledger.completed_illustrations,43);
for(const entry of ledger.entries){assert.equal(entry.status,'integrated');assert(fs.existsSync(entry.asset));for(const ref of entry.refs){const key=[ref.crop,ref.part,ref.kind==='part'?'parts':'symptoms',ref.key].join('|');assert.equal(sim.advisorCardImages[key],entry.slug);}}
console.log(`${cards} tarjetas con imagen; ${replaced} asociaciones nuevas verificadas; 43 ilustraciones completas.`);
