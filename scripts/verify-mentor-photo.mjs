import { chromium } from 'playwright';

const ARTIFACT_DIR = 'C:/Users/sijok/.gemini/antigravity/brain/71a56117-30cd-4e2e-9c05-0972d3cd5b92';
const BASE_URL = 'http://127.0.0.1:4173';

async function verifyMentorPhoto() {
  console.log('🚀 Checking mentor photo on About page...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  await page.goto(`${BASE_URL}/`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);

  // Skip intro if present
  const skipBtn = page.locator('button:has-text("Skip")').first();
  if (await skipBtn.isVisible({ timeout: 1500 }).catch(() => false)) {
    await skipBtn.click().catch(() => {});
    await page.waitForTimeout(500);
  }

  // Navigate to About page
  const aboutNavBtn = page.locator('button:has-text("About")').first();
  await aboutNavBtn.waitFor({ state: 'visible', timeout: 5000 });
  await aboutNavBtn.click();
  await page.waitForTimeout(1000);

  // Check mentor image element
  const mentorImg = page.locator('img[alt="Praveen Raj R"]').first();
  await mentorImg.waitFor({ state: 'visible', timeout: 5000 });

  const imgInfo = await mentorImg.evaluate((img) => ({
    src: img.currentSrc || img.src,
    naturalWidth: img.naturalWidth,
    naturalHeight: img.naturalHeight,
    complete: img.complete,
    clientWidth: img.clientWidth,
    clientHeight: img.clientHeight
  }));

  console.log('Mentor Image Info:', JSON.stringify(imgInfo, null, 2));

  // Take screenshot of the instructor showcase card
  const instructorCard = page.locator('text=PRAVEEN RAJ R').locator('xpath=ancestor::div[contains(@class, "rounded-3xl")]').first();
  if (await instructorCard.isVisible()) {
    await instructorCard.screenshot({ path: `${ARTIFACT_DIR}/mentor-photo-card.png` });
    console.log(`Saved screenshot to ${ARTIFACT_DIR}/mentor-photo-card.png`);
  }

  // Also take full About page screenshot
  await page.screenshot({ path: `${ARTIFACT_DIR}/mentor-about-page.png`, fullPage: false });
  console.log(`Saved screenshot to ${ARTIFACT_DIR}/mentor-about-page.png`);

  await browser.close();
}

verifyMentorPhoto().catch(console.error);
