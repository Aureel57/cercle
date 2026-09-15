/**
 * Test de démarrage : monte app.js dans un DOM simulé (jsdom) et vérifie que
 * chaque page se rend sans erreur. Ne remplace pas un œil humain, mais attrape
 * les régressions franches (référence à un composant supprimé, faute de syntaxe,
 * variable globale disparue) avant qu'elles n'arrivent en production.
 *
 *   Usage : node scripts/smoke-test.mjs   (après node build.mjs)
 */
import { readFileSync } from 'node:fs';
import { JSDOM } from 'jsdom';

const read = (p) => readFileSync(new URL('../' + p, import.meta.url), 'utf8');

const dom = new JSDOM('<!DOCTYPE html><html><body><div id="root"></div></body></html>', {
  url: 'https://aureel57.github.io/cercle/#/home',
  runScripts: 'outside-only',
  pretendToBeVisual: true,
});
const { window } = dom;

/* Stubs des dépendances chargées par <script> dans index.html */
window.IntersectionObserver = class { observe(){} unobserve(){} disconnect(){} };
window.matchMedia = window.matchMedia || (() => ({ matches:false, addListener(){}, removeListener(){}, addEventListener(){}, removeEventListener(){} }));
window.scrollTo = () => {};
const tl = () => ({ to(){return this}, from(){return this}, fromTo(){return this}, set(){return this}, add(){return this}, kill(){} });
window.gsap = {
  to:()=>tl(), from:()=>tl(), fromTo:()=>tl(), set:()=>{}, timeline:tl, registerPlugin:()=>{},
  context:(fn)=>{ try{ fn && fn(); }catch(e){} return { revert(){}, add(){}, kill(){} }; },
  killTweensOf:()=>{}, utils:{ toArray:()=>[] }, delayedCall:()=>tl(),
};
window.__fbOK = false; // pas de Firebase dans le test → l'app doit tenir en mode démo

const errors = [];
window.addEventListener('error', (e) => errors.push(e.error || e.message));

window.eval(read('node_modules/react/umd/react.production.min.js'));
window.eval(read('node_modules/react-dom/umd/react-dom.production.min.js'));
window.eval(read('app.js'));

await new Promise(r => setTimeout(r, 300));

const root = window.document.getElementById('root');
if (!root || root.children.length === 0) {
  console.error('ÉCHEC : rien ne s’est rendu dans #root');
  process.exit(1);
}

/* Navigue sur chaque route et vérifie que la page se rend */
const routes = ['home','favs','messages','profile','create','activite','notifs','avis','grade','plus','params','revenus','legal','auth','carte'];
for (const r of routes) {
  window.location.hash = '#/' + r;
  window.dispatchEvent(new window.Event('popstate'));
  await new Promise(res => setTimeout(res, 120));
  const txt = root.textContent || '';
  if (txt.length < 40) { console.error(`ÉCHEC sur #/${r} : page quasi vide`); process.exit(1); }
  console.log(`#/${r.padEnd(9)} ok — ${txt.length} caractères rendus`);
}

if (errors.length) {
  console.error('\nERREURS pendant le rendu :');
  errors.forEach(e => console.error(' -', e && e.message || e));
  process.exit(1);
}
console.log('\nToutes les pages se rendent sans erreur.');
