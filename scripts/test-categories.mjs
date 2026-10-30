import { chromium } from 'playwright';
import { preview } from 'vite';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/sijok/.gemini/antigravity/brain/71a56117-30cd-4e2e-9c05-0972d3cd5b92';

async function run() {
  console.log('🚀 Starting programmatic Vite preview server...');
  const previewServer = await preview({
    preview: { port: 4188, host: '127.0.0.1' },
  });
  const address = previewServer.httpServer.address();
  const port = typeof address === 'object' && address ? address.port : 4188;
  const BASE_URL = `http://127.0.0.1:${port}`;
  console.log(`🌐 Preview server ready at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 960 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });
  const page = await context.newPage();

  const pageErrors = [];
  page.on('pageerror', err => pageErrors.push(err.message));

  try {
    // 1. Visit AI Chord Transposer tab
    console.log('Testing AI Chord Transposer category...');
    await page.goto(`${BASE_URL}/#chord-transposer`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000);

    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-1-ai-chord-transposer.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-1-ai-chord-transposer.png');

    // 2. Visit Passing Chords Studio tab
    console.log('Testing Passing Chords Studio category...');
    const passingTab = page.locator('button:has-text("Passing Chords")').first();
    await passingTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-2-passing-chords-studio.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-2-passing-chords-studio.png');

    // 3. Visit Chord Progressions tab
    console.log('Testing Chord Progressions category...');
    const progTab = page.locator('button:has-text("Chord Progressions")').first();
    await progTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-3-chord-progressions.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-3-chord-progressions.png');

    // 4. Visit Chord Library tab
    console.log('Testing Chord Library & Voicings category...');
    const libTab = page.locator('#harmony-suite-nav button:has-text("Chord Library")').first();
    await libTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-4-chord-library-piano.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-4-chord-library-piano.png');

    // Test sub-category: 24 Triads
    console.log('Testing Chord Library -> 24 Triads sub-category...');
    const triadsBtn = page.locator('button:has-text("24 Triads")').first();
    await triadsBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-4-sub-24-triads.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-4-sub-24-triads.png');

    // Test sub-category: Topics 01-06
    console.log('Testing Chord Library -> Topics 01-06 sub-category...');
    const topicsBtn = page.locator('button:has-text("Topics 01–06")').first();
    await topicsBtn.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-4-sub-topics.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-4-sub-topics.png');

    // 5. Visit Staff Notation tab
    console.log('Testing Staff Notation category...');
    const staffTab = page.locator('button:has-text("Staff Notation")').first();
    await staffTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-5-staff-notation.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-5-staff-notation.png');

    // 6. Visit Circle of Fifths tab
    console.log('Testing Circle of Fifths category...');
    const circleTab = page.locator('button:has-text("Circle of Fifths")').first();
    await circleTab.click();
    await page.waitForTimeout(800);
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'cat-6-circle-of-fifths.png'),
      fullPage: false,
    });
    console.log('✅ Captured cat-6-circle-of-fifths.png');

    console.log('All categories verified successfully! Page errors:', pageErrors);
  } finally {
    await browser.close();
    await new Promise((resolve) => {
      previewServer.httpServer.close(() => {
        console.log('Server closed successfully.');
        resolve();
      });
    });
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
