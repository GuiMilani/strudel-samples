// generate-strudel-ready.js
import fs from "fs";
import path from "path";

// pega o nome do repositório da pasta atual
const repoName = path.basename(process.cwd());
const branch = "main"; // ajusta se teu branch principal for outro
const baseUrl = `https://raw.githubusercontent.com/GuiMilani/${repoName}/${branch}/`;

const outputFile = path.join(process.cwd(), "strudel.json");
const backupFile = path.join(process.cwd(), "strudel_backup.json");

// cria backup se existir
if (fs.existsSync(outputFile)) {
  fs.copyFileSync(outputFile, backupFile);
  console.log("📦 Backup criado:", backupFile);
}

const entries = fs.readdirSync(process.cwd(), { withFileTypes: true });
const json = { _base: baseUrl };

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = entry.name;

  if (folder.startsWith(".") || folder === "node_modules") continue;

  const files = fs
    .readdirSync(path.join(process.cwd(), folder))
    .filter(f => f.match(/\.(wav|mp3|ogg)$/i))
    .sort(); // ordena pra não mudar a numeração ao adicionar novos arquivos

  if (files.length === 0) continue;

  const obj = {};
  files.forEach((file, i) => {
    obj[i + 1] = `${folder}/${file}`; // sem barra inicial
  });

  json[folder] = obj;
}

fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf8");
console.log("✅ strudel.json gerado com sucesso!");
console.log("👉 Pastas convertidas:", Object.keys(json).filter(k => k !== "_base").join(", "));
console.log("✅ Agora tu pode rodar no REPL: s('kick:1 snare:1 hat:1')");
