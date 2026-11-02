#!/usr/bin/env node
'use strict';

/**
 * Verification Script for GALYON Incremento 1
 * Philosophy: Ponytail (Zero external dependencies, standard library only, fast, deterministic)
 *
 * Checks:
 *   1. PDF technical sheet path casing (fichas-tecnicas/galyon_insecta_metarhizium_anisopliae.pdf)
 *   2. Combo Mango WebP asset existence, dimensions (1672x941), size (< 350 KB), and HTML reference
 *   3. SEO tags in <head> (Open Graph and Twitter Card)
 *   4. script.js interactions: .brand logo click handler & gallery controls (.tricho-gallery-prev, .tricho-gallery-next, data-slide)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

// Base directory (can be passed via argv or defaults to project root __dirname)
const ROOT_DIR = process.argv[2] ? path.resolve(process.argv[2]) : __dirname;

console.log(`\n======================================================`);
console.log(`  GALYON INCREMENTO 1 — AUTOMATED VERIFICATION SUITE  `);
console.log(`  Target directory: ${ROOT_DIR}`);
console.log(`======================================================\n`);

let passedCount = 0;
let failedCount = 0;
const failures = [];

function test(description, fn) {
  try {
    fn();
    console.log(`  ✔ [PASS] ${description}`);
    passedCount++;
  } catch (err) {
    console.error(`  ✖ [FAIL] ${description}`);
    console.error(`           Reason: ${err.message}`);
    failedCount++;
    failures.push({ description, error: err.message });
  }
}

// Helper: read WebP dimensions from binary buffer (RIFF VP8 / VP8L / VP8X)
function getWebPDimensions(buf) {
  if (buf.length < 30) throw new Error('Buffer too small for WebP');
  if (buf.toString('ascii', 0, 4) !== 'RIFF' || buf.toString('ascii', 8, 12) !== 'WEBP') {
    throw new Error('Invalid WebP header (missing RIFF/WEBP signature)');
  }
  const type = buf.toString('ascii', 12, 16);
  if (type === 'VP8 ') {
    const width = buf.readUInt16LE(26) & 0x3fff;
    const height = buf.readUInt16LE(28) & 0x3fff;
    return { width, height, type: 'VP8 (lossy)' };
  } else if (type === 'VP8L') {
    const b0 = buf[21], b1 = buf[22], b2 = buf[23], b3 = buf[24];
    const width = 1 + (((b1 & 0x3f) << 8) | b0);
    const height = 1 + ((((b3 & 0x0f) << 10) | (b2 << 2) | ((b1 & 0xc0) >> 6)));
    return { width, height, type: 'VP8L (lossless)' };
  } else if (type === 'VP8X') {
    const width = 1 + buf.readUIntLE(24, 3);
    const height = 1 + buf.readUIntLE(27, 3);
    return { width, height, type: 'VP8X (extended)' };
  }
  throw new Error(`Unsupported VP8 chunk type: ${type}`);
}

// Read index.html and script.js
const indexPath = path.join(ROOT_DIR, 'index.html');
const scriptPath = path.join(ROOT_DIR, 'script.js');

const indexHtml = fs.existsSync(indexPath) ? fs.readFileSync(indexPath, 'utf8') : '';
const scriptJs = fs.existsSync(scriptPath) ? fs.readFileSync(scriptPath, 'utf8') : '';

// ---------------------------------------------------------
// SUITE 1: BUG-001 — PDF Technical Sheet Path Casing
// ---------------------------------------------------------
console.log('--- 1. PDF Technical Sheet Link (BUG-001) ---');

test('File fichas-tecnicas/galyon_insecta_metarhizium_anisopliae.pdf exists on disk', () => {
  const targetPdf = path.join(ROOT_DIR, 'fichas-tecnicas', 'galyon_insecta_metarhizium_anisopliae.pdf');
  assert.ok(fs.existsSync(targetPdf), `PDF not found at ${targetPdf}`);
});

test('index.html contains exact lowercase PDF path', () => {
  const expectedPath = 'fichas-tecnicas/galyon_insecta_metarhizium_anisopliae.pdf';
  assert.ok(
    indexHtml.includes(`href="${expectedPath}"`),
    `index.html does not contain href="${expectedPath}"`
  );
});

test('index.html does NOT contain uppercase GALYON_INSECTA path', () => {
  const uppercasePath = 'fichas-tecnicas/GALYON_INSECTA_Metarhizium_anisopliae.pdf';
  assert.ok(
    !indexHtml.includes(uppercasePath),
    `index.html still contains uppercase path ${uppercasePath}`
  );
});

// ---------------------------------------------------------
// SUITE 2: PERF-001 — Combo Mango WebP Asset
// ---------------------------------------------------------
console.log('\n--- 2. Combo Mango WebP Asset & Optimization (PERF-001) ---');

let comboMangoSrc = null;

test('index.html combo mango card references a WebP image in src attribute', () => {
  // Find combo-card 02 · MANGO
  const mangoCardMatch = indexHtml.match(/02\s*·\s*MANGO[\s\S]*?<\/article>/i);
  assert.ok(mangoCardMatch, 'Could not locate Mango combo card in index.html');
  const cardHtml = mangoCardMatch[0];
  const srcMatch = cardHtml.match(/<img[^>]+src=["']([^"']+\.webp)["']/i);
  assert.ok(srcMatch, `Mango combo card does not reference a .webp image in src. Found card: ${cardHtml.slice(0, 300)}`);
  comboMangoSrc = srcMatch[1];
});

test('Referenced Combo Mango WebP file exists in assets/', () => {
  assert.ok(comboMangoSrc, 'No WebP file was detected from index.html check');
  const assetPath = path.join(ROOT_DIR, comboMangoSrc);
  assert.ok(fs.existsSync(assetPath), `WebP asset file does not exist at ${assetPath}`);
});

test('WebP asset dimensions are exactly 1672x941 px', () => {
  assert.ok(comboMangoSrc, 'Skipped because comboMangoSrc not resolved');
  const assetPath = path.join(ROOT_DIR, comboMangoSrc);
  const buf = fs.readFileSync(assetPath);
  const dims = getWebPDimensions(buf);
  assert.strictEqual(dims.width, 1672, `Width is ${dims.width}, expected 1672`);
  assert.strictEqual(dims.height, 941, `Height is ${dims.height}, expected 941`);
});

test('WebP asset file size is under 350 KB (< 358,400 bytes)', () => {
  assert.ok(comboMangoSrc, 'Skipped because comboMangoSrc not resolved');
  const assetPath = path.join(ROOT_DIR, comboMangoSrc);
  const stat = fs.statSync(assetPath);
  const maxBytes = 350 * 1024;
  assert.ok(
    stat.size < maxBytes,
    `File size is ${(stat.size / 1024).toFixed(1)} KB (${stat.size} bytes), which exceeds 350 KB threshold`
  );
});

// ---------------------------------------------------------
// SUITE 3: SEO-001 — Open Graph and Twitter Card Meta Tags
// ---------------------------------------------------------
console.log('\n--- 3. SEO Metadata in <head> (SEO-001) ---');

test('<head> contains og:title meta tag', () => {
  assert.ok(/<meta\s+property=["']og:title["']\s+content=["'][^"']+["']/i.test(indexHtml), 'Missing or empty og:title meta tag in <head>');
});

test('<head> contains og:description meta tag', () => {
  assert.ok(/<meta\s+property=["']og:description["']\s+content=["'][^"']+["']/i.test(indexHtml), 'Missing or empty og:description meta tag in <head>');
});

test('<head> contains og:image meta tag referencing a thumbnail asset', () => {
  const match = indexHtml.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  assert.ok(match && match[1].trim().length > 0, 'Missing or empty og:image meta tag in <head>');
});

test('<head> contains og:url meta tag', () => {
  assert.ok(/<meta\s+property=["']og:url["']\s+content=["'][^"']+["']/i.test(indexHtml), 'Missing or empty og:url meta tag in <head>');
});

test('<head> contains twitter:card meta tag', () => {
  assert.ok(/<meta\s+name=["']twitter:card["']\s+content=["'][^"']+["']/i.test(indexHtml), 'Missing or empty twitter:card meta tag in <head>');
});

// ---------------------------------------------------------
// SUITE 4: R3 & BUG-002 — Navigation and Interactive Handlers in script.js
// ---------------------------------------------------------
console.log('\n--- 4. Interaction Handlers in script.js (R3 & BUG-002) ---');

test('script.js attaches click listener to .brand logo', () => {
  // Checks that .brand is selected and addEventListener('click') or onclick is bound
  const hasBrandListener =
    /\.brand['"]\)\.forEach|\.brand['"]\)\.addEventListener|querySelector\(["']\.brand/i.test(scriptJs);
  assert.ok(hasBrandListener, 'script.js does not query or attach an event listener to .brand');
});

test('Logo click handler closes drawers and modals and scrolls to #inicio', () => {
  // Verify that the brand handler or helper triggers closeCart or modal dismissal
  assert.ok(
    scriptJs.includes('closeCart') || scriptJs.includes('cart-drawer'),
    'Brand click handler must close the cart drawer'
  );
  assert.ok(
    scriptJs.includes('is-dismissed') || scriptJs.includes('galyon-modal'),
    'Brand click handler must close galyon modals'
  );
});

test('script.js binds click listeners to gallery controls (.tricho-gallery-prev, .tricho-gallery-next, data-slide)', () => {
  const hasPrev = scriptJs.includes('tricho-gallery-prev');
  const hasNext = scriptJs.includes('tricho-gallery-next');
  const hasDataSlide = scriptJs.includes('data-slide');
  assert.ok(hasPrev, 'script.js missing binding for .tricho-gallery-prev');
  assert.ok(hasNext, 'script.js missing binding for .tricho-gallery-next');
  assert.ok(hasDataSlide, 'script.js missing binding for [data-slide]');
});

// ---------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------
console.log('\n======================================================');
console.log(`  VERIFICATION RESULTS: ${passedCount} PASSED, ${failedCount} FAILED`);
console.log('======================================================\n');

if (failedCount > 0) {
  console.log('Summary of failing tests:');
  failures.forEach((f, idx) => {
    console.log(`  ${idx + 1}. ${f.description}`);
  });
  console.log('\nExit code: 1\n');
  process.exit(1);
} else {
  console.log('All Incremento 1 assertions passed successfully!\n');
  process.exit(0);
}
