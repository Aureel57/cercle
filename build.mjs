/**
 * Compile app.jsx → app.js (référencé par index.html).
 *
 * Avant, index.html embarquait le JSX brut et le navigateur le compilait avec
 * Babel-standalone À CHAQUE VISITE : ~3 Mo de compilateur téléchargé et
 * plusieurs secondes de calcul sur le thread principal. La compilation se fait
 * maintenant ici, une seule fois, au moment du déploiement.
 *
 *   Source  : app.jsx        (c'est LE fichier à modifier)
 *   Sortie  : app.js         (minifié — ne jamais l'éditer à la main)
 *   Usage   : node build.mjs   puis commit des deux fichiers.
 *
 * On garde @babel/standalone 7.26.0 avec les presets env+react : exactement le
 * compilateur et les réglages que le navigateur utilisait — zéro changement de
 * comportement, seulement le lieu où la compilation s'exécute.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { transform } from '@babel/standalone';
import { minify } from 'terser';

const src = readFileSync(new URL('./app.jsx', import.meta.url), 'utf8');

const compiled = transform(src, {
  presets: ['env', 'react'],
  comments: false,
}).code;

const min = await minify(compiled, {
  compress: { passes: 2 },
  mangle: true,
  format: { comments: false },
});

if (min.error) throw min.error;

writeFileSync(new URL('./app.js', import.meta.url), min.code, 'utf8');

const kb = (s) => Math.round(s.length / 1024) + ' Ko';
console.log(`app.jsx ${kb(src)} → compilé ${kb(compiled)} → minifié ${kb(min.code)}`);
