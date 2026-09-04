/* Language selector — every pack loads, every page switches, and the brand
   name is never looked up in the dictionary. Needs `npm start` running. */
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport:{width:1280,height:900} });
await ctx.route('**://fonts.g*/**', r=>r.abort());
const p = await ctx.newPage();
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
let pass=0, fail=0;
const ok=(c,m)=>{ c?(pass++,console.log('✓',m)):(fail++,console.log('✗',m)); };

await p.goto('http://127.0.0.1:8099/index.html',{waitUntil:'load'});
await p.waitForTimeout(600);
ok((await p.locator('.main-nav a').first().innerText()).trim()==='Home','starts in English');

/* The picker is rendered twice — in the header row and inside the menu panel —
   and which one is on screen depends on whether the nav still fits, which
   depends on the language. Use whichever is visible, opening the menu first
   when the row has collapsed. */
async function chooseLanguage(code) {
  const header = p.locator('.lang-in-header .lang-select');
  if (await header.isVisible()) { await header.selectOption(code); return; }
  await p.locator('.nav-toggle').click();
  await p.waitForTimeout(150);
  await p.locator('.lang-in-nav .lang-select').selectOption(code);
}

for (const [code, word] of [['it','Materie'],['de','Fächer'],['fr','Matières'],['es','Asignaturas'],['pt','Disciplinas']]) {
  await chooseLanguage(code);
  await p.waitForTimeout(1100);
  const nav = await p.locator('.main-nav').innerText();
  ok(nav.includes(word), `${code}: nav shows "${word}"`);
  ok(await p.evaluate(()=>document.documentElement.lang)===code, `${code}: <html lang> set`);
  const picker = await p.locator('.lang-in-header .lang-select').isVisible()
    ? p.locator('.lang-in-header .lang-select') : p.locator('.lang-in-nav .lang-select');
  ok((await picker.inputValue())===code, `${code}: selector reflects the choice`);
  ok((await p.locator('.brand-word').first().innerText()).replace(/\s/g,'')==='WorksheetHub', `${code}: brand name untranslated`);
}
/* the choice survives navigation and a fresh page */
await p.goto('http://127.0.0.1:8099/library.html',{waitUntil:'load'});
await p.waitForTimeout(1100);
ok((await p.locator('h1').innerText()).includes('Explorar'), 'choice survives navigation');

await chooseLanguage('en');
await p.waitForTimeout(1100);
ok((await p.locator('h1').innerText()).includes('Browse'), 'switching back to English works');
ok(errs.length===0, 'no uncaught page errors');
console.log(`\n${pass} passed, ${fail} failed.`);
await b.close();
process.exit(fail?1:0);
