import { chromium } from 'playwright';

const ARTIFACT_DIR = 'C:/Users/sijok/.gemini/antigravity/brain/71a56117-30cd-4e2e-9c05-0972d3cd5b92';
const BASE_URL = 'http://127.0.0.1:4173';

async function verifyCloudBackend() {
  console.log('🚀 Testing praveenrajr14@gmail.com Cloud Storage & Email Backend...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  await context.addInitScript(() => {
    sessionStorage.setItem('melophile_intro_shown', 'true');
  });
  const page = await context.newPage();

  // Mock FormSubmit network call so test runs fast & clean offline/online
  await page.route('https://formsubmit.co/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: 'true' }),
    });
  });

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(800);

  // 1. Test Booking Modal submission -> Cloud Storage
  const bookBtn = page.locator('button:has-text("BOOK FREE TRIAL")').first();
  await bookBtn.click();
  await page.waitForTimeout(500);

  await page.fill('input[placeholder*="Rahul Nair"]', 'Anuraga S.');
  await page.fill('input[placeholder*="email@example.com"]', 'anuraga@example.com');
  await page.fill('input[placeholder*="+91"]', '+91 9876543210');

  const submitBtn = page.locator('button:has-text("Schedule Free Trial Lesson")').first();
  await submitBtn.click();
  await page.waitForTimeout(800);

  const cloudSavedText = await page.locator('text=Saved to Cloud (praveenrajr14@gmail.com)').isVisible();
  console.log('✅ Trial Booking saved to Cloud (praveenrajr14@gmail.com):', cloudSavedText);

  await page.screenshot({ path: `${ARTIFACT_DIR}/cloud-booking-confirmation.png` });

  // Close Booking Modal
  const doneBtn = page.locator('button:has-text("Done & Return")').first();
  await doneBtn.click();
  await page.waitForTimeout(400);

  // 2. Open Cloud Storage Backend Console from Footer
  const cloudFooterBtn = page.locator('button:has-text("Cloud Storage (praveenrajr14@gmail.com)")').first();
  await cloudFooterBtn.scrollIntoViewIfNeeded();
  await cloudFooterBtn.click();
  await page.waitForTimeout(600);

  const consoleHeader = await page.locator('text=Melophile Cloud Storage Backend').isVisible();
  const recordVisible = await page.locator('text=Anuraga S.').first().isVisible();
  console.log('✅ Cloud Storage Console opens & displays stored booking record:', consoleHeader && recordVisible);

  await page.screenshot({ path: `${ARTIFACT_DIR}/cloud-backend-records.png` });

  // Switch to Google Drive & Sheets Connector tab
  const driveTabBtn = page.locator('button:has-text("Google Drive & Sheets Connector")').first();
  await driveTabBtn.click();
  await page.waitForTimeout(500);

  await page.screenshot({ path: `${ARTIFACT_DIR}/cloud-backend-drive-connector.png` });

  await browser.close();
}

verifyCloudBackend().catch((err) => {
  console.error(err);
  process.exit(1);
});
