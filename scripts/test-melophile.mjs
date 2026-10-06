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
  console.log('🚀 STARTING PLAYWRIGHT TEST SUITE FOR MELOPHILE');
  console.log(`🌐 Testing Target: ${BASE_URL}`);
  console.log('====================================================\n');

  const browser = await chromium.launch({
    headless: true,
  });

  const pageErrors = [];

  // =========================================================================
  // TEST SUITE 1: Desktop Experience, Intro Animation & Branding
  // =========================================================================
  console.log('📋 SUITE 1: Desktop Experience, Intro Animation & Branding');
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  const page = await context.newPage();
  page.on('pageerror', err => pageErrors.push(err.message));

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });

  // 1.1 Intro Splash Check
  const hasIntroOrSkip = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('MELOPHILE') || text.includes('Skip') || text.includes('MUSIC ACADEMY');
  });
  assert(hasIntroOrSkip, 'Initial Logo Splash & Branding Loaded');

  // Skip the intro sequence if Skip button exists
  const skipBtn = page.locator('button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
    await skipBtn.click();
    console.log('  ℹ️ Skipped Intro splash');
  }

  // Wait for main content to render
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-desktop-home.png') });

  // 1.2 Navbar Brand and Items Check
  const brandTitle = await page.locator('text=MELOPHILE').first().isVisible();
  assert(brandTitle, 'Navbar Melophile Brand Visible');

  const navItems = ['Home', 'About Us', 'Courses', 'Chord Library', 'Contact Us'];
  for (const item of navItems) {
    const visible = await page.locator(`button:has-text("${item}")`).first().isVisible();
    assert(visible, `Navbar link "${item}" exists`);
  }

  // =========================================================================
  // TEST SUITE 2: Student Stories Names Verification
  // =========================================================================
  console.log('\n📋 SUITE 2: Student Stories Names Verification');
  const storiesSection = page.locator('text=What Our Students Experience');
  await storiesSection.scrollIntoViewIfNeeded().catch(() => {});

  const anuragaExists = await page.locator('text=Anuraga').first().isVisible();
  assert(anuragaExists, 'Student Story "Anuraga" updated and visible');

  const tobyExists = await page.locator('text=Toby Cristo').first().isVisible();
  assert(tobyExists, 'Student Story "Toby Cristo" updated and visible');

  const brycenExists = await page.locator('text=Brycen').first().isVisible();
  assert(brycenExists, 'Student Story "Brycen" updated and visible');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-student-stories.png') });

  // =========================================================================
  // TEST SUITE 3: Free Trial Booking Modal Flow
  // =========================================================================
  console.log('\n📋 SUITE 3: Free Trial Booking Modal Flow');
  const bookTrialBtn = page.locator('button:has-text("BOOK FREE TRIAL")').first();
  await bookTrialBtn.click();
  await page.waitForTimeout(600);

  const modalHeading = await page.locator('text=Mentorship with Praveen Raj R').first().isVisible();
  assert(modalHeading, 'Booking Modal opens with proper heading');

  const nameInput = await page.locator('input[placeholder*="Rahul Nair"]').first().isVisible();
  assert(nameInput, 'Full Name input field present');

  const phoneInput = await page.locator('input[type="tel"]').first().isVisible();
  assert(phoneInput, 'Phone / WhatsApp input field present');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-booking-modal.png') });

  // Close modal via Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(600);
  const modalClosed = !(await page.locator('text=Mentorship with Praveen Raj R').isVisible());
  assert(modalClosed, 'Booking Modal closes via Escape key');

  // =========================================================================
  // TEST SUITE 4: Navigation to Chord Library & Theory Engine
  // =========================================================================
  console.log('\n📋 SUITE 4: Chord Library & Circle of Fifths');
  const chordTab = page.locator('button:has-text("Chord Library")').first();
  await chordTab.click();
  await page.waitForTimeout(800);

  const chordPageHeading = await page.locator('text=Chord Library & Progressions').isVisible();
  assert(chordPageHeading, 'Chord Library Page renders successfully');

  // Check Circle of Fifths
  const circleSection = await page.locator('text=The Circle of Fifths').isVisible();
  assert(circleSection, 'Interactive Circle of Fifths component visible');

  // Check In-Page Piano Visualizer with SVG keys
  const svgPiano = await page.locator('svg[viewBox="0 0 480 126"]').first().isVisible();
  assert(svgPiano, 'Exact 2-Octave SVG Piano Visualizer rendered on page');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-chords-page.png') });

  // =========================================================================
  // TEST SUITE 5: Full 24 Triads Directory & Search/Filter
  // =========================================================================
  console.log('\n📋 SUITE 5: 24 Triads Directory & Filtering');
  const triadsSection = page.locator('#full-triads-list');
  await triadsSection.scrollIntoViewIfNeeded().catch(() => {});

  const directoryHeader = await triadsSection.locator('text=Full Major & Minor Triads Directory').isVisible();
  assert(directoryHeader, '24 Triads Directory Header displayed');

  // Filter by Minor
  const minorFilterBtn = triadsSection.locator('button:has-text("Minor")').first();
  await minorFilterBtn.click();
  await page.waitForTimeout(400);

  const minorCountText = await triadsSection.locator('text=Showing 12 of 24 Triads').isVisible();
  assert(minorCountText, 'Quality filter "Minor" filters to exactly 12 triads');

  // Reset filter to All
  const allFilterBtn = triadsSection.locator('button:has-text("All")').first();
  await allFilterBtn.click();
  await page.waitForTimeout(400);

  // Search for G Major
  const searchInput = triadsSection.locator('input[placeholder*="Search by root"]').first();
  await searchInput.fill('G Major');
  await page.waitForTimeout(400);

  const gMajorInList = await triadsSection.locator('text=G Major').first().isVisible();
  assert(gMajorInList, 'Search filter finds "G Major" instantly');

  // =========================================================================
  // TEST SUITE 6: Active Voicing & 3-Way Triad Inversions Modal
  // =========================================================================
  console.log('\n📋 SUITE 6: Triad Inspector Modal & 3-Way Inversions');
  // Click on G Major Inspect button inside directory to open Inspector Modal
  const inspectBtn = triadsSection.locator('tbody tr').first().locator('button:has-text("Inspect")');
  await inspectBtn.click();
  await page.waitForTimeout(800);

  const modalContainer = page.locator('div[role="dialog"]');
  const inspectorHeading = await modalContainer.locator('text=Active Voicing & Inversion Inspector').isVisible();
  assert(inspectorHeading, 'Triad Inspector Modal opens on chord selection');

  // 6.1 Root Position
  const rootFormula = await modalContainer.evaluate(el => el.innerText.includes('1 - 3 - 5'));
  assert(rootFormula, 'Root Position displays formula "1 - 3 - 5"');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-triad-root.png') });

  // 6.2 First Inversion (1st Inversion)
  const firstInvBtn = modalContainer.locator('button:has-text("1st Inversion")').first();
  await firstInvBtn.click();
  await page.waitForTimeout(500);

  const firstInvFormula = await modalContainer.evaluate(el => {
    const text = el.innerText;
    return text.includes('3 - 5 - 1') && text.includes('6');
  });
  assert(firstInvFormula, '1st Inversion updates formula to "3 - 5 - 1" and Figured Bass to "6"');

  const firstInvBass = await modalContainer.evaluate(el => {
    const text = el.innerText;
    return text.includes('B') && text.includes('Bass') && (text.includes('Major 3rd') || text.includes('3rd in the bass'));
  });
  assert(firstInvBass, '1st Inversion puts Third (B4) in the bass');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-triad-1st-inv.png') });

  // 6.3 Second Inversion (2nd Inversion)
  const secondInvBtn = modalContainer.locator('button:has-text("2nd Inversion")').first();
  await secondInvBtn.click();
  await page.waitForTimeout(500);

  const secondInvFormula = await modalContainer.evaluate(el => {
    const text = el.innerText;
    return text.includes('5 - 1 - 3') && text.includes('6/4');
  });
  assert(secondInvFormula, '2nd Inversion updates formula to "5 - 1 - 3" and Figured Bass to "6/4"');

  const secondInvBass = await modalContainer.evaluate(el => {
    const text = el.innerText;
    return text.includes('D') && text.includes('Bass') && (text.includes('Fifth') || text.includes('5th in the bass'));
  });
  assert(secondInvBass, '2nd Inversion puts Fifth (D) in the bass');

  await page.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-triad-2nd-inv.png') });

  // 6.4 Audition button test
  const playVoicingBtn = modalContainer.locator('button:has-text("Play Voicing")').first();
  assert(await playVoicingBtn.isVisible(), '"Play Voicing" button visible and interactive');
  await playVoicingBtn.click();

  // Close modal via "Done" button
  const doneBtn = modalContainer.locator('button:has-text("Done")').first();
  await doneBtn.click();
  await page.waitForTimeout(400);

  const modalIsClosed = !(await modalContainer.isVisible());
  assert(modalIsClosed, 'Triad Inspector Modal closes smoothly');

  await context.close();

  // =========================================================================
  // TEST SUITE 7: Mobile Responsive Emulation
  // =========================================================================
  console.log('\n📋 SUITE 7: Mobile Viewport & Responsiveness (iPhone 15)');
  const mobileContext = await browser.newContext({
    viewport: { width: 393, height: 852 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148',
    isMobile: true,
    hasTouch: true,
  });
  await mobileContext.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });
  const mobilePage = await mobileContext.newPage();
  mobilePage.on('pageerror', err => pageErrors.push(err.message));

  await mobilePage.goto(`${BASE_URL}/#chords`, { waitUntil: 'domcontentloaded' });
  await mobilePage.waitForTimeout(1000);

  // Floating WhatsApp button check
  const whatsappLink = mobilePage.locator('aside[aria-label*="WhatsApp"] a').first();
  const whatsappVisible = await whatsappLink.isVisible().catch(() => false);
  assert(whatsappVisible, 'Floating WhatsApp action accessible on mobile');

  // Mobile layout rendered without horizontal page explosion
  const scrollWidth = await mobilePage.evaluate(() => document.documentElement.scrollWidth);
  assert(scrollWidth <= 420, `Mobile page maintains proper viewport boundary (scrollWidth: ${scrollWidth}px)`);

  await mobilePage.screenshot({ path: path.join(ARTIFACT_DIR, 'playwright-mobile-chords.png') });
  await mobileContext.close();

  // =========================================================================
  // TEST SUITE 8: Console Errors Inspection
  // =========================================================================
  console.log('\n📋 SUITE 8: JavaScript Runtime & Error Check');
  assert(pageErrors.length === 0, 'Zero Uncaught JavaScript Page Errors', pageErrors.length > 0 ? pageErrors.join('; ') : 'Clean console');

  await browser.close();

  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log('\n====================================================');
  console.log(`📊 TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED (TOTAL: ${results.length})`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
