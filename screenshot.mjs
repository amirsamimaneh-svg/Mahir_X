import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const page = await (await b.newContext({ viewport: { width: 1280, height: 900 } })).newPage();
await page.goto('http://localhost:3000', { waitUntil: 'networkidle', timeout: 20000 });
await page.screenshot({ path: '/tmp/s1-hero.png' });

await page.evaluate(() => document.querySelector('#work')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/s2-work.png' });

await page.evaluate(() => document.querySelector('#ai-chat')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/s3-aichat.png' });

await page.evaluate(() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'instant' }));
await page.waitForTimeout(1000);
await page.screenshot({ path: '/tmp/s4-contact.png' });

// chat
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(400);
const btns = await page.$$('button');
for (const btn of btns) {
  const style = await btn.getAttribute('style');
  if (style && style.includes('fixed') && style.includes('bottom: 28px')) {
    await btn.click();
    break;
  }
}
await page.waitForTimeout(800);
await page.screenshot({ path: '/tmp/s4-chat.png' });

await b.close();
console.log('done');
