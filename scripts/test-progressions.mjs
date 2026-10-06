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
  console.log('🎹 PLAYWRIGHT TEST: ALL-KEY CHORD PROGRESSIONS SESSION');
  console.log('====================================================\n');

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 950 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });

  const page = await context.newPage();
  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  await page.goto(`${BASE_URL}/#chord-progressions-session`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // 1. Check Section exists
  const sessionSection = page.locator('#chord-progressions-session');
  assert(await sessionSection.isVisible(), 'Chord Progression Session Section is visible');

  // 2. Check 12 Key Buttons
  const keyButtons = sessionSection.locator('button:has-text("C"), button:has-text("D"), button:has-text("G")');
  const keyCount = await sessionSection.locator('div.grid-cols-4 button, div.grid-cols-6 button, div.lg\\:grid-cols-12 button').count();
  assert(keyCount >= 12, `All 12 Chromatic Keys Available (Found: ${keyCount} keys)`);

  // 3. Default Key (C Major) - Check Classic Pop Cadence chords: C, F, G, C
  const firstProg = sessionSection.locator('div.rounded-3xl:has-text("The Classic Pop & Folk Cadence")').first();
  const cMajorChords = await firstProg.locator('button span.font-bold').allInnerTexts();
  console.log('  ℹ️ Chords in C Major:', cMajorChords);
  assert(
    cMajorChords.includes('C') && cMajorChords.includes('F') && cMajorChords.includes('G'),
    'Default Key (C Major) displays chords C - F - G - C'
  );

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-progressions-c-major.png') });

  // 4. TRANSPOSE TO G MAJOR
  console.log('\n🔄 Testing Key Transposition to G Major...');
  const gKeyBtn = sessionSection.locator('button:has-text("G")').first();
  await gKeyBtn.click();
  await page.waitForTimeout(500);

  const gMajorChords = await firstProg.locator('button span.font-bold').allInnerTexts();
  console.log('  ℹ️ Chords in G Major:', gMajorChords);
  assert(
    gMajorChords.includes('G') && gMajorChords.includes('C') && gMajorChords.includes('D'),
    'Transposition to G Major dynamically updates chords to G - C - D - G'
  );

  // Check scale degrees strip for G Major
  const gScaleText = await sessionSection.locator('text=G Major').first().isVisible();
  assert(gScaleText, 'Active Key indicator updates to G Major');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-progressions-g-major.png') });

  // 5. TRANSPOSE TO D MAJOR
  console.log('\n🔄 Testing Key Transposition to D Major...');
  const dKeyBtn = sessionSection.locator('button').filter({ hasText: /^D$/ }).first();
  await dKeyBtn.click();
  await page.waitForTimeout(500);

  const dMajorChords = await firstProg.locator('button span.font-bold').allInnerTexts();
  console.log('  ℹ️ Chords in D Major:', dMajorChords);
  assert(
    dMajorChords.includes('D') && dMajorChords.includes('G') && dMajorChords.includes('A'),
    'Transposition to D Major dynamically updates chords to D - G - A - D'
  );

  // 6. TRANSPOSE TO F MAJOR (Flat Key)
  console.log('\n🔄 Testing Key Transposition to F Major (Flat key)...');
  const fKeyBtn = sessionSection.locator('button').filter({ hasText: /^F$/ }).first();
  await fKeyBtn.click();
  await page.waitForTimeout(500);

  const fMajorChords = await firstProg.locator('button span.font-bold').allInnerTexts();
  console.log('  ℹ️ Chords in F Major:', fMajorChords);
  assert(
    fMajorChords.includes('F') && fMajorChords.includes('Bb') && fMajorChords.includes('C'),
    'Transposition to F Major correctly uses flat spelling: F - Bb - C - F'
  );

  // 7. LEVEL FILTERING (Basic -> Intermediate -> Advanced)
  console.log('\n📑 Testing Level Filters...');
  const basicTab = sessionSection.locator('button:has-text("Basic / Beginner")').first();
  await basicTab.click();
  await page.waitForTimeout(400);
  const basicCount = await sessionSection.locator('div.rounded-3xl span:has-text("Basic • Free")').count();
  assert(basicCount === 5, `Basic filter displays exactly 5 foundational progressions (Found: ${basicCount})`);

  const interTab = sessionSection.locator('button:has-text("Intermediate")').first();
  await interTab.click();
  await page.waitForTimeout(400);
  const interCount = await sessionSection.locator('div.rounded-3xl span:has-text("Intermediate • Free")').count();
  assert(interCount === 5, `Intermediate filter displays exactly 5 progressions (Found: ${interCount})`);

  // 8. ADVANCED PRO LEVEL (LOCKED SUBSCRIPTION STATE)
  console.log('\n🔒 Testing Advanced Pro Progressions & Subscription Gating...');
  const advTab = sessionSection.locator('button:has-text("Advanced Pro")').first();
  await advTab.click();
  await page.waitForTimeout(400);

  const advCardCount = await sessionSection.locator('div.grid.grid-cols-1.lg\\:grid-cols-2 > div').count();
  assert(advCardCount === 6, `Advanced filter displays exactly 6 pro masterclass progressions (Found: ${advCardCount})`);

  // Check locked status
  const lockBadges = await sessionSection.locator('text=Included with Melophile Pro').count();
  assert(lockBadges >= 1, 'Advanced progressions require Melophile Pro subscription when locked');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-progressions-adv-locked.png') });

  // 9. CLICK VIEW WITH PRO SUBSCRIPTION -> OPENS SUBSCRIPTION MODAL
  const unlockBtn = sessionSection.locator('button:has-text("View with Pro Subscription")').first();
  await unlockBtn.click();
  await page.waitForTimeout(600);

  const subModal = page.locator('text=Complete Your Subscription').first();
  assert(await subModal.isVisible(), 'Clicking locked advanced progression opens Pro Subscription modal');

  // Close modal via close button
  const closeSubModal = page.locator('div.fixed.inset-0 button:has-text("✕")').first();
  if (await closeSubModal.isVisible()) {
    await closeSubModal.click();
    await page.waitForTimeout(400);
  }

  // 10. TEST DEMO UNLOCK OF PRO
  console.log('\n👑 Testing Pro Unlock State...');
  const demoUnlockBtn = sessionSection.locator('button:has-text("Demo Unlock")').first();
  await demoUnlockBtn.click();
  await page.waitForTimeout(600);

  const proActiveBadge = await sessionSection.locator('text=Melophile Pro Active').isVisible();
  assert(proActiveBadge, 'Melophile Pro Active badge displayed upon subscription unlock');

  // Check that lock overlays are gone and playable
  const lockOverlaysAfter = await sessionSection.locator('text=Included with Melophile Pro').count();
  assert(lockOverlaysAfter === 0, 'All Advanced progressions are unlocked and fully accessible');

  // Test Playing an Advanced progression in current key (F Major)
  const advPlayBtn = sessionSection.locator('button:has-text("Play Sequence")').first();
  assert(await advPlayBtn.isVisible(), 'Advanced progression "Play Sequence" is fully enabled');
  await advPlayBtn.click();
  await page.waitForTimeout(600);

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-progressions-adv-unlocked.png') });

  // 11. CHECK CONSOLE ERRORS
  assert(pageErrors.length === 0, 'Zero Uncaught JavaScript Page Errors', pageErrors.length > 0 ? pageErrors.join('; ') : 'Clean console');

  await browser.close();

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log('\n====================================================');
  console.log(`📊 PROGRESSIONS TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED (TOTAL: ${results.length})`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
