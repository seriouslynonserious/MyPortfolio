import {test, expect} from '@playwright/test';

test('portfolio has crawlable content and no runtime errors', async ({page}) => {
  const errors=[];page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toContainText('REAL USERS.');
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByRole('heading',{name:'Onelap Telematics',exact:true})).toHaveCount(1);
  await expect(page.getByRole('link',{name:'View resume ↗',exact:true})).toHaveAttribute('href', /drive.google.com/);
  expect(errors).toEqual([]);
});

test('Enter selects a filtered command and does not reopen the palette', async ({page}) => {
  await page.goto('/');
  await page.getByRole('button',{name:'Open command palette'}).click();
  await page.getByRole('textbox',{name:'Search commands'}).fill('Ask Shivam AI');
  await expect(page.locator('.command-list button')).toHaveCount(1);
  await page.getByRole('textbox',{name:'Search commands'}).press('Enter');
  await expect(page.locator('dialog')).not.toBeVisible();
  await expect(page.locator('#assistant h2')).toBeInViewport();
});

test('request simulation cycles cache hits and misses without backend calls', async ({page}) => {
  const api=[];page.on('request',r=>{if(new URL(r.url()).pathname.startsWith('/api/'))api.push(r.url());});
  await page.goto('/');
  const request=page.getByRole('button',{name:'Send API request ↗',exact:true});
  await request.click();await expect(page.locator('.logs')).toContainText('CACHE HIT');
  await request.click();await request.click();await expect(page.locator('.logs')).toContainText('CACHE MISS');
  expect(api).toEqual([]);
});

test('Redis overload needs all three defenses for recovery', async ({page}) => {
  await page.goto('/');
  await page.getByRole('tab',{name:/Cache failure/}).click();
  await page.getByRole('button',{name:'Break Redis ↗',exact:true}).click();
  await page.getByRole('button',{name:'1000K',exact:true}).click();
  await expect(page.getByText('DATABASE OVERLOAD — apply defenses')).toBeVisible();
  for(const name of ['Rate limiting','Request coalescing','Cache recovery'])await page.getByRole('button',{name:new RegExp(name)}).click();
  await expect(page.locator('meter')).toHaveAttribute('value','28');
  await expect(page.locator('.logs')).toContainText('SYSTEM STABLE');
});

test('latency incident rewards tracing the database', async ({page}) => {
  await page.goto('/');await page.getByRole('tab',{name:/Latency incident/}).click();
  await page.getByRole('button',{name:'Frontend',exact:true}).click();
  await expect(page.getByText('This is a small part of the latency. Keep tracing downstream.')).toBeVisible();
  await page.getByRole('button',{name:'Database',exact:true}).click();
  await page.getByRole('button',{name:'Optimize query → add index'}).click();
  await expect(page.getByRole('button',{name:'System restored ✓'})).toBeVisible();
});

test('assistant parses SSE events from the relative backend endpoint', async ({page}) => {
  await page.route('**/api/ai/chat/stream',r=>r.fulfill({status:200,contentType:'text/event-stream',body:'event: token\ndata: {"text":"Angular "}\n\nevent: token\ndata: {"text":"and Spring Boot."}\n\nevent: done\ndata: {"done":true}\n\n'}));
  await page.goto('/');await page.getByRole('button',{name:'Tell me about Onelap. ↗',exact:true}).click();
  await expect(page.locator('.answer')).toHaveText('Angular and Spring Boot.');
});

test('unavailable assistant remains a usable portfolio', async ({page}) => {
  await page.route('**/api/ai/chat/stream',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Unavailable"}'}));
  await page.goto('/');await page.getByRole('button',{name:'Tell me about Onelap. ↗',exact:true}).click();
  await expect(page.locator('.answer')).toContainText('unavailable right now');
  await expect(page.getByRole('link',{name:'View resume ↗',exact:true})).toHaveAttribute('href', /drive.google.com/);
});

test('contact never reports delivery when the backend rejects it', async ({page}) => {
  await page.route('**/api/contact',r=>r.fulfill({status:503,contentType:'application/json',body:'{"error":"Not configured"}'}));
  await page.goto('/');await page.getByRole('textbox',{name:'Name',exact:true}).fill('Test Recruiter');
  await page.getByRole('textbox',{name:'Email',exact:true}).fill('test@example.com');
  await page.getByRole('textbox',{name:"What's on your mind?",exact:true}).fill('A controlled test message about an engineering role.');
  await page.getByRole('button',{name:'Send message ↗',exact:true}).click();
  await expect(page.getByRole('status')).toContainText('could not be delivered');
});

test('mobile has no horizontal overflow', async ({page}) => {
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  await expect(page.getByRole('heading',{level:1})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
  await page.screenshot({path:'test-results/mobile.png',fullPage:true});
});

test('WebGL failure preserves HTML access', async ({page}) => {
  await page.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return String(type).startsWith('webgl')?null:original.call(this,type,...args);};});
  await page.goto('/');await expect(page.getByText('Use the accessible technology controls below to explore.')).toBeVisible();
  await page.locator('.node-buttons').getByRole('button',{name:'Angular',exact:true}).click();
  await expect(page.locator('.node-panel h3')).toHaveText('Angular');
});


test('mobile keeps 3D available on demand without startup cost', async ({page}) => {
  await page.setViewportSize({width:390,height:844});await page.goto('/');
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('button',{name:'Load interactive 3D ↗',exact:true}).click();
  await expect(page.locator('canvas')).toBeVisible();
  await expect(page.getByText('PLAY MODE ACTIVE',{exact:true})).toBeVisible();
});
