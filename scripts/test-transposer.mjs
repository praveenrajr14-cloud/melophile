import { chromium } from 'playwright';
import { preview } from 'vite';

const ARTIFACT_DIR = 'C:/Users/sijok/.gemini/antigravity/brain/71a56117-30cd-4e2e-9c05-0972d3cd5b92';

async function testTransposer() {
  console.log('🚀 Starting programmatic Vite preview server...');
  const previewServer = await preview({
    preview: { port: 4178, host: '127.0.0.1' },
  });
  const address = previewServer.httpServer.address();
  const port = typeof address === 'object' && address ? address.port : 4178;
  const BASE_URL = `http://127.0.0.1:${port}`;
  console.log(`🌐 Preview server ready at ${BASE_URL}`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1366, height: 920 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/#chords`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  const transposerSection = page.locator('#chord-transposer');
  await transposerSection.scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);

  // 1. Verify Default Song Loaded (Amazing Grace in Key of C)
  const headingVisible = await transposerSection
    .locator('text=AI Song Chord Transposer')
    .first()
    .isVisible();
  console.log('✅ AI Chord Transposer section visible:', headingVisible);

  // 2. Transpose from C to G (+7 semitones)
  const keyGBtn = transposerSection.getByRole('button', { name: 'G', exact: true }).first();
  await keyGBtn.click();
  await page.waitForTimeout(400);

  const keyOfGBadge = await transposerSection.locator('text=Key of G').first().isVisible();
  console.log('✅ Instant Key Transposition (C → G):', keyOfGBadge);

  await transposerSection.screenshot({ path: `${ARTIFACT_DIR}/transposer-level1-basic-g.png` });

  // 3. Test Level 2: Intermediate AI Reharmonization
  const interBtn = transposerSection.locator('button:has-text("Level 2 • Intermediate")').first();
  await interBtn.click();
  await page.waitForTimeout(500);

  const hasInterChords = await transposerSection.evaluate((el) => {
    const txt = el.innerText;
    return txt.includes('Gmaj7') || txt.includes('Cmaj7') || txt.includes('Em7');
  });
  console.log('✅ Level 2 Intermediate AI Reharmonization (Maj7, m7, slash chords):', hasInterChords);

  await transposerSection.screenshot({ path: `${ARTIFACT_DIR}/transposer-level2-intermediate-g.png` });

  // 4. Test Level 3: Pro AI Masterclass Reharmonization
  const proBtn = transposerSection.locator('button:has-text("Level 3 • Pro AI Masterclass")').first();
  await proBtn.click();
  await page.waitForTimeout(500);

  const hasProChords = await transposerSection.evaluate((el) => {
    const txt = el.innerText;
    return txt.includes('Gmaj9') && (txt.includes('Cmaj9') || txt.includes('D13') || txt.includes('Em9'));
  });
  console.log('✅ Level 3 Pro AI Masterclass Reharmonization (Maj9, m9, 13, 7b9):', hasProChords);

  // 5. Click a chord directly inside the transposed song sheet to audition
  const chordPill = transposerSection.locator('button:has-text("Gmaj9")').first();
  if (await chordPill.isVisible()) {
    await chordPill.click();
    await page.waitForTimeout(300);
  }

  await transposerSection.screenshot({ path: `${ARTIFACT_DIR}/transposer-level3-pro-g.png` });

  await browser.close();
  previewServer.httpServer.close();
  process.exit(0);
}

testTransposer().catch((err) => {
  console.error(err);
  process.exit(1);
});
