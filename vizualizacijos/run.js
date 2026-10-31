const { chromium } = require('playwright'); const fs = require('fs');
const jobs = process.argv.slice(2).map(s => { const [scene,w,h] = s.split(':'); return {scene,w,h}; });
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader','--enable-unsafe-swiftshader','--ignore-gpu-blocklist'] });
  for (const j of jobs) {
    const p = await b.newPage({ viewport: { width: +j.w, height: +j.h } });
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
    const t0 = Date.now();
    await p.goto(`http://127.0.0.1:8765/scene.html?scene=${j.scene}&w=${j.w}&h=${j.h}`);
    await p.waitForFunction('window.done === true', null, { timeout: 300000 }).catch(e => errs.push('timeout'));
    const data = await p.evaluate(() => document.querySelector('canvas').toDataURL('image/png'));
    fs.writeFileSync(`out-${j.scene}.png`, Buffer.from(data.split(',')[1], 'base64'));
    console.log(j.scene, ((Date.now()-t0)/1000).toFixed(1)+'s', errs);
    await p.close();
  }
  await b.close();
})();
