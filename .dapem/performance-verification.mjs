
import fs from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
const tool = process.env.RUNNER_TEMP + '/dapem-tools/node_modules/';
const { default: lighthouse } = await import(pathToFileURL(tool + 'lighthouse/core/index.js'));
const { launch } = await import(pathToFileURL(tool + 'chrome-launcher/dist/index.js'));
const { default: puppeteer } = await import(pathToFileURL(tool + 'puppeteer-core/lib/esm/puppeteer/puppeteer-core.js'));
const out = process.env.RUNNER_TEMP + '/dapem-evidence';
const report = { version: 1, sha: process.env.GITHUB_SHA, samples: [], browser: [], failures: [] };
const url = 'http://127.0.0.1:4173/';
const chromePath = '/usr/bin/google-chrome';
const selected = new Set(['lcp-breakdown-insight','lcp-discovery-insight','cls-culprits-insight','layout-shift-elements','image-delivery-insight','uses-optimized-images','uses-responsive-images','modern-image-formats','bootup-time','mainthread-work-breakdown','long-tasks','render-blocking-resources','render-blocking-insight']);
try {
  const markerPath = '/dapem-performance-' + process.env.DAPEM_CARD + '.json';
  const expectedMarker = JSON.parse(await fs.readFile('public' + markerPath, 'utf8'));
  const servedMarker = await (await fetch(url.replace(/\/$/,'') + markerPath)).json();
  if (JSON.stringify(expectedMarker) !== JSON.stringify(servedMarker)) throw new Error('Built deployment proof is missing or differs from the candidate.');
  for (const device of ['mobile', 'desktop']) {
    for (let run = 0; run < 3; run++) {
      const chrome = await launch({ chromePath, chromeFlags: ['--headless','--no-sandbox','--disable-dev-shm-usage'] });
      try {
        const result = await lighthouse(url, { port: chrome.port, output: 'json', onlyCategories: ['performance'], ...(device === 'desktop' ? { preset: 'desktop' } : {}) });
        const lhr = result.lhr;
        await fs.writeFile(out + '/' + device + '-' + run + '.json', JSON.stringify(lhr));
        report.samples.push({ device, lcp: lhr.audits['largest-contentful-paint']?.numericValue,
          tbt: lhr.audits['total-blocking-time']?.numericValue, cls: lhr.audits['cumulative-layout-shift']?.numericValue,
          error: lhr.runtimeError, findings: Object.fromEntries(Object.entries(lhr.audits).filter(([id]) => selected.has(id))) });
      } finally { await chrome.kill(); }
    }
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
      page.on('pageerror', e => errors.push(String(e.message).slice(0,500)));
      page.on('response', r => { if (r.status() >= 400) errors.push('HTTP ' + r.status() + ': ' + r.url()); });
      page.on('requestfailed', r => { if (!r.failure()?.errorText.includes('ERR_ABORTED')) errors.push('Request failed: ' + r.url()); });
      await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
      await page.screenshot({ path: out + '/' + device + '-initial.png' });
      const initial = await page.evaluate(() => ({ text: document.body.innerText, width: document.documentElement.scrollWidth, viewport: innerWidth }));
      if (initial.width > initial.viewport + 2) errors.push('Horizontal overflow: ' + initial.width + ' > ' + initial.viewport);
      if (initial.text.trim().length < 80) errors.push('Primary page content is missing.');
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
      for (const i of images) {
        if (!i.loaded) errors.push('Broken image: ' + i.url);
        if (i.naturalWidth > i.width * 2 + 2 || i.naturalHeight > i.height * 2 + 2) errors.push('Image exceeds 2x displayed dimensions: ' + i.url);
        if (/\.(png|jpe?g)(?:[?#]|$)/i.test(i.url)) errors.push('Legacy raster reference: ' + i.url);
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
      report.browser.push({ device, errors, images, baselineCompared: true, visibleText: initial.text.slice(0,12000) });
    } finally { await browser.close(); }
  }
} catch(e) { report.failures.push(String(e.message).slice(0,2000)); }
await fs.writeFile(out + '/summary.json', JSON.stringify(report));
