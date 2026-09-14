import {readdirSync, readFileSync} from 'node:fs';
for (const file of readdirSync('.lighthouseci').filter(f=>f.startsWith('lhr-')&&f.endsWith('.json'))) {
  const report=JSON.parse(readFileSync('.lighthouseci/'+file,'utf8'));
  console.log('Lighthouse local production build (simulated mobile, one run):');
  for(const category of Object.values(report.categories))console.log(`${category.title}: ${Math.round(category.score*100)}`);
  for(const audit of Object.values(report.audits).filter(a=>a.score!==null&&a.score<1&&a.details?.type!=='opportunity'))console.log(`Review: ${audit.title} — ${audit.displayValue||''}`);
}
