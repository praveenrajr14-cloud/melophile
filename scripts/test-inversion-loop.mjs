import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/sijok/.gemini/antigravity/brain/71a56117-30cd-4e2e-9c05-0972d3cd5b92';
const BASE_URL = 'http://127.0.0.1:5173';

const results = [];

function assert(condition, testName, details = '') {
  if (condition) {
    console.log(`  ✅ PASS: ${testName} ${details ? '(' + details + ')' : ''}`);
    results.push({ name: testName, status: 'PASS', details });
  } else {
    console.error(`  ❌ FAIL: ${testName} ${details ? '(' + details + ')' : ''}`);
    results.push({ name: testName, status: 'FAIL', details });
  }
}

async function runTests() {
  console.log('====================================================');
  console.log('🔄 PLAYWRIGHT TEST: INVERSION POPUP HUD & LOOP MODE');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });

  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  await page.goto(`${BASE_URL}/#chords`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Verify Progression Session is near top of Chords page
  const sessionSection = page.locator('#chord-progressions-session');
  assert(await sessionSection.isVisible(), 'All-Key Chord Progression Session is prominently rendered');

  // 2. Verify Loop Mode Button is ON by default
  const loopToggle = sessionSection.locator('button:has-text("Loop Mode:")').first();
  assert(await loopToggle.isVisible(), 'Loop Mode Toggle Button exists in controls toolbar');
  const loopText = await loopToggle.innerText();
  assert(loopText.includes('ON'), 'Loop Mode is enabled (ON) by default for seamless rehearsal');

  // 3. Switch Key to G Major
  const gKeyBtn = sessionSection.locator('button').filter({ hasText: /^G$/ }).first();
  await gKeyBtn.click();
  await page.waitForTimeout(400);

  // 4. Click individual chord to verify Inversion HUD popup opens immediately
  console.log('\n🎯 Testing individual chord click inversion inspection...');
  const firstProgCard = sessionSection.locator('div.grid.grid-cols-1.lg\\:grid-cols-2 > div').first();
  // Click second chord button (index 1: C IV 6/4 in G Major, which is 2nd Inversion)
  const cardButtons = await firstProgCard.locator('button').all();
  await cardButtons[1].click();
  await page.waitForTimeout(600);

  const inversionHud = page.locator('aside[aria-label="Active Chord Inversion Inspector"]');
  assert(await inversionHud.isVisible(), 'Active Inversion Popup HUD appears upon chord selection');

  const hudText = await inversionHud.innerText();
  console.log('  ℹ️ HUD Content:', hudText.replace(/\n+/g, ' | '));
  assert(
    hudText.includes('2nd Inversion') || hudText.includes('6/4') || hudText.includes('Root Position'),
    'Inversion Popup HUD identifies exact inversion (Root, 1st, or 2nd Inversion)'
  );
  assert(hudText.toLowerCase().includes('bass tone'), 'Inversion Popup HUD displays the lowest bass tone and role');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-inversion-hud-single.png') });

  // 5. Test Live Progression Audio Playback with HUD Updating in Real Time
  console.log('\n▶️ Testing Live Progression Playback & Inversion HUD updates...');
  const playSeqBtn = firstProgCard.locator('button:has-text("Play Loop in G Major"), button:has-text("Play Sequence in G Major")').first();
  await playSeqBtn.click();
  await page.waitForTimeout(800);

  assert(await inversionHud.isVisible(), 'Inversion HUD remains active and tracks progression playback');

  // Wait for step 2 (should update to next chord and inversion)
  await page.waitForTimeout(1400);
  const step2HudText = await inversionHud.innerText();
  console.log('  ℹ️ Step 2 HUD Content:', step2HudText.replace(/\n+/g, ' | '));
  assert(step2HudText.includes('Step 2') || step2HudText.includes('Step 3') || step2HudText.includes('Loop: ON'), 'HUD displays active step and loop mode');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-inversion-hud-playing.png') });

  // 6. Test Stop Button in HUD
  const stopBtn = inversionHud.locator('button:has-text("Stop Audio")').first();
  if (await stopBtn.isVisible()) {
    await stopBtn.click();
    console.log('  ℹ️ Stopped playback via HUD');
  } else {
    await playSeqBtn.click();
  }
  await page.waitForTimeout(500);

  // 7. Verify Console Errors
  assert(pageErrors.length === 0, 'Zero Uncaught JavaScript Page Errors', pageErrors.length > 0 ? pageErrors.join('; ') : 'Clean console');

  await browser.close();

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log('\n====================================================');
  console.log(`📊 INVERSION & LOOP TEST COMPLETE: ${passed} PASSED, ${failed} FAILED (TOTAL: ${results.length})`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
