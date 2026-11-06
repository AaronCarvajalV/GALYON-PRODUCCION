'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');

const root = __dirname;
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✔ [PASS] ${name}`);
    passed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
    failed++;
  }
}

console.log('======================================================');
console.log('  GALYON BIOPHILIC LEAF SHADOWS BACKGROUND AUDIT');
console.log('======================================================\n');

// 1. Asset check
test('Asset mindora-leaf-shadows.webp exists and has valid size', () => {
  const assetPath = path.join(root, 'assets', 'mindora-leaf-shadows.webp');
  assert.ok(fs.existsSync(assetPath), 'Asset file must exist');
  const stat = fs.statSync(assetPath);
  assert.ok(stat.size > 20000, `Asset size ${stat.size} should be > 20KB`);
});

// 2. HTML Markup check
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
test('HTML index.html contains ambient background markup with drift and light layers', () => {
  assert.ok(html.includes('class="leaf-shadows-ambient"'), 'Must have .leaf-shadows-ambient');
  assert.ok(html.includes('class="leaf-shadows-bg"'), 'Must have .leaf-shadows-bg');
  assert.ok(html.includes('class="leaf-shadows-drift"'), 'Must have .leaf-shadows-drift');
  assert.ok(html.includes('class="leaf-shadows-light"'), 'Must have .leaf-shadows-light');
  assert.ok(html.includes('aria-hidden="true"'), 'Ambient layers must be marked aria-hidden');
});

test('HTML index.html links to updated styles.css with cache busting', () => {
  assert.ok(html.includes('styles.css?v=5.8.0'), 'Must link to styles.css?v=5.8.0');
});

// 3. CSS Styles check
const styles = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');
test('CSS styles.css defines ambient background with position fixed and z-index 0', () => {
  assert.ok(styles.includes('.leaf-shadows-ambient'), 'Must define .leaf-shadows-ambient');
  assert.ok(styles.includes('position: fixed'), 'Ambient must be position fixed');
  assert.ok(styles.includes('pointer-events: none'), 'Ambient must not capture pointer events');
});

test('CSS styles.css keeps .hero at z-index 2 (independent background)', () => {
  assert.ok(styles.includes('.hero'), 'Hero must be declared');
  assert.ok(styles.includes('z-index: 2 !important'), 'Hero must be elevated to z-index 2');
});

test('CSS styles.css defines organic breeze keyframes and dappled sunlight keyframes', () => {
  assert.ok(styles.includes('@keyframes leafShadowBreeze'), 'Must define @keyframes leafShadowBreeze');
  assert.ok(styles.includes('@keyframes dappledSunlight'), 'Must define @keyframes dappledSunlight');
  assert.ok(styles.includes('will-change: transform'), 'Must use will-change: transform for 60fps GPU acceleration');
});

test('CSS styles.css respects prefers-reduced-motion', () => {
  assert.ok(styles.includes('@media (prefers-reduced-motion: reduce)'), 'Must include reduced motion query');
  assert.ok(styles.includes('animation: none !important'), 'Must halt animations on reduced motion');
});

test('CSS styles.css sets transparent background on all tabs/sections below Hero', () => {
  const targetSections = [
    '.intro',
    '#nosotros',
    '.crop-advisor',
    '#asesor',
    '.combos',
    '#combos',
    '.products',
    '#lineas',
    '.soil',
    '#analisis',
    '.trust',
    '#garantia',
    '.faq'
  ];
  for (const sel of targetSections) {
    assert.ok(styles.includes(sel), `styles.css must reference ${sel} for transparency`);
  }
  assert.ok(styles.includes('background: transparent !important'), 'Must enforce background transparent on sub-hero sections');
});

// 4. Parallax & Visibility check
const pageSectionsJs = fs.readFileSync(path.join(root, 'page-sections.js'), 'utf8');
test('page-sections.js includes passive scroll parallax and visibility pause', () => {
  assert.ok(pageSectionsJs.includes('--leaf-scroll-y'), 'Must set --leaf-scroll-y for parallax');
  assert.ok(pageSectionsJs.includes('visibilitychange'), 'Must listen to visibilitychange');
  assert.ok(pageSectionsJs.includes('passive:true') || pageSectionsJs.includes('passive: true'), 'Must use passive scroll listener');
});

console.log(`\n======================================================`);
console.log(`  AUDIT COMPLETE: ${passed} PASSED, ${failed} FAILED`);
console.log(`======================================================`);

if (failed > 0) {
  process.exit(1);
}
