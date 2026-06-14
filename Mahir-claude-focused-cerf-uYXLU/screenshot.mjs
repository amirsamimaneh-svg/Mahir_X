import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--no-sandbox', '--disable-setuid-sandbox']
});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });
const page = await ctx.newPage();

await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 30000 });
await page.screenshot({ path: '/tmp/mahir-home.png' });

await page.evaluate(() => window.scrollTo(0, 900));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/mahir-features.png' });

await page.evaluate(() => window.scrollTo(0, 2000));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/mahir-stats.png' });

await page.evaluate(() => window.scrollTo(0, 3000));
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/mahir-team.png' });

await browser.close();
console.log('Done');
