// generate-strudel.js
import fs from "fs";
import path from "path";

const root = process.cwd();
const outputFile = path.join(root, "strudel.json");

// se teu repositório é público no GitHub, coloca o link bruto aqui:
const baseUrl = "https://raw.githubusercontent.com/GuiMilani/strudel-samples/refs/heads/main/";

const entries = fs.readdirSync(root, { withFileTypes: true });
const json = { _base: baseUrl };

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = entry.name;

  // ignora diretórios ocultos ou o próprio .git
  if (folder.startsWith(".")) continue;

  const files = fs
    .readdirSync(path.join(root, folder))
    .filter((f) => f.match(/\.(wav|mp3|ogg)$/i));

  if (files.length === 0) continue;

  const obj = {};
  files.forEach((file, i) => {
    obj[i + 1] = `/${folder}/${file}`;
  });

  json[folder] = obj;
}

fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf8");

console.log("✅ Gerado strudel.json com sucesso!");
console.log("👉 Pastas convertidas:", Object.keys(json).filter(k => k !== "_base").join(", "));
