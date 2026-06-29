// Prépare le dossier www/ embarqué par Capacitor : copie l'app web (index.html),
// le manifeste PWA et l'icône. À lancer avant `npx cap sync`.
import { mkdirSync, copyFileSync, existsSync } from "node:fs";

mkdirSync("www", { recursive: true });

const files = ["index.html", "manifest.json", "icon.svg"];
let copied = 0;
for (const f of files) {
  if (existsSync(f)) { copyFileSync(f, `www/${f}`); copied++; }
}
console.log(`✓ www/ prêt — ${copied} fichier(s) copié(s) (${files.filter(existsSync).join(", ")})`);
console.log("  Lancez ensuite : npx cap sync");
