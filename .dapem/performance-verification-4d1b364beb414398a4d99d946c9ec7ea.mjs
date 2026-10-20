
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const tool = process.env.RUNNER_TEMP + '/dapem-tools/node_modules/';
const { default: puppeteer } = await import(pathToFileURL(tool + 'puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const out = process.env.RUNNER_TEMP + '/dapem-evidence';
const report = { version: 1, policy: 'structural-housekeeping-v3', sha: process.env.GITHUB_SHA, samples: [], browser: [], failures: [] };
const url = 'http://127.0.0.1:4173/';
const chromePath = '/usr/bin/google-chrome';
try {
  const markerPath = '/dapem-performance-' + process.env.DAPEM_CARD + '.json';
  const expectedMarker = JSON.parse(await fs.readFile('public' + markerPath, 'utf8'));
  const servedMarker = await (await fetch(url.replace(/\/$/,'') + markerPath)).json();
  if (JSON.stringify(expectedMarker) !== JSON.stringify(servedMarker)) throw new Error('Built deployment proof is missing or differs from the candidate.');
  for (const device of ['mobile', 'desktop']) {
    const browser = await puppeteer.launch({ executablePath: chromePath, headless: true, args: ['--no-sandbox','--disable-dev-shm-usage'] });
    try {
      const page = await browser.newPage();
      await page.setViewport(device === 'mobile' ? { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true } : { width: 1440, height: 1000, deviceScaleFactor: 1 });
      const structure = () => ({
        text: document.body.innerText.replace(/\s+/g,' ').trim(),
        links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')).sort(),
        buttons: document.querySelectorAll('button').length,
        forms: document.querySelectorAll('form').length,
        fields: document.querySelectorAll('input,textarea,select').length,
        headings: [...document.querySelectorAll('h1,h2')].map(e => e.textContent.trim()),
      });
      const scrollAll = async () => {
        for (let y = 0; y < 20000; y += 600) {
          await page.evaluate(y => scrollTo(0,y), y);
          await new Promise(r => setTimeout(r, 150));
          if (await page.evaluate(() => scrollY + innerHeight >= document.documentElement.scrollHeight)) break;
        }
        await new Promise(r => setTimeout(r, 2000));
      };
      await page.goto('http://127.0.0.1:4174/', { waitUntil: 'networkidle2', timeout: 60000 });
      await scrollAll();
      const baseline = await page.evaluate(structure);
      await page.screenshot({ path: out + '/' + device + '-baseline.png', fullPage: true });
      const errors = [];
      const warnings = [];
      const resourceFailure = (request, message) => {
        const media = ['image','media'].includes(request.resourceType()) || /\/(?:favicon(?:-[^/]*)?\.(?:ico|png)|apple-touch-icon\.png)(?:[?#]|$)/i.test(request.url());
        (media ? warnings : errors).push(message);
      };
      page.on('pageerror', e => errors.push(String(e.message).slice(0,500)));
      page.on('response', r => { if (r.status() >= 400) resourceFailure(r.request(), 'HTTP ' + r.status() + ': ' + r.url()); });
      page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) resourceFailure(r, 'Request failed: ' + r.url()); });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.screenshot({ path: out + '/' + device + '-initial.png' });
      const initial = await page.evaluate(() => ({ text: document.body.innerText, width: document.documentElement.scrollWidth, viewport: innerWidth }));
      if (initial.width > initial.viewport + 2) errors.push('Horizontal overflow: ' + initial.width + ' > ' + initial.viewport);
      if (initial.text.trim().length < 80) errors.push('Primary page content is missing.');
      const criticalImageLoading = await page.evaluate(() => {
        const visible = [...document.images].filter(i => {
          const r = i.getBoundingClientRect();
          return r.width > 0 && r.height > 0 && r.top < innerHeight && r.bottom > 0;
        });
        const primary = visible.sort((a,b) => b.getBoundingClientRect().width * b.getBoundingClientRect().height - a.getBoundingClientRect().width * a.getBoundingClientRect().height)[0];
        return !primary || primary.loading !== 'lazy';
      });
      // Trigger lazy sections too; passing only an empty above-fold shell is not sufficient.
      await scrollAll();
      const candidate = await page.evaluate(structure);
      if (candidate.text.length < baseline.text.length * 0.9) errors.push('Visible content was removed relative to the baseline.');
      for (const heading of baseline.headings) if (!candidate.headings.includes(heading)) errors.push('Heading removed: ' + heading);
      for (const field of ['buttons','forms','fields']) if (candidate[field] < baseline[field]) errors.push('Interaction elements removed: ' + field);
      for (const link of baseline.links) if (!candidate.links.includes(link)) errors.push('Navigation destination removed: ' + link);
      const images = await page.evaluate(() => [...document.images].filter(i => i.getBoundingClientRect().width > 0).map(i => ({
        url: i.currentSrc || i.src, width: i.getBoundingClientRect().width, height: i.getBoundingClientRect().height,
        naturalWidth: i.naturalWidth, naturalHeight: i.naturalHeight, loaded: i.complete && i.naturalWidth > 0
      })));
      const imageDimensions = await page.evaluate(() => [...document.images].filter(i => i.getBoundingClientRect().width > 0).every(i => {
        if (Number(i.getAttribute('width')) > 0 && Number(i.getAttribute('height')) > 0) return true;
        const style = getComputedStyle(i);
        if (style.aspectRatio !== 'auto') return true;
        // Remove intrinsic size in a clone: CSS must still reserve both dimensions.
        const original = i.getBoundingClientRect();
        const clone = i.cloneNode(false);
        clone.removeAttribute('src'); clone.removeAttribute('srcset');
        clone.style.visibility = 'hidden'; i.after(clone);
        const reserved = clone.getBoundingClientRect();
        clone.remove();
        return reserved.width > 0 && reserved.height > 0 &&
          Math.abs(reserved.width - original.width) < 1 && Math.abs(reserved.height - original.height) < 1;
      }));
      for (const i of images) {
        if (!i.loaded) warnings.push('Media task only — broken image: ' + i.url);
      }
      await page.screenshot({ path: out + '/' + device + '-full.png', fullPage: true });
      // Basic native interaction checks; preserve existing application-specific tests as well.
      for (const details of await page.$$('details')) {
        const summary = await details.$('summary');
        if (summary) {
          const wasOpen = await details.evaluate(e => e.open);
          await summary.click(); await new Promise(r => setTimeout(r,600));
          if ((await details.evaluate(e => e.open)) === wasOpen) errors.push('FAQ interaction failed.');
        }
      }
      report.browser.push({ device, errors, warnings, images, housekeeping: { imageDimensions, criticalImageLoading }, baselineCompared: true, visibleText: initial.text.slice(0,12000) });
    } finally { await browser.close(); }
  }
} catch(e) { report.failures.push(String(e.message).slice(0,2000)); }
await fs.writeFile(out + '/summary.json', JSON.stringify(report));
