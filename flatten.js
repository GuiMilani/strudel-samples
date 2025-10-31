import fs from "fs";
import path from "path";

const root = process.cwd();
const repoName = path.basename(root);
const branch = "main"; // ajusta se teu branch principal for outro
const baseUrl = `https://raw.githubusercontent.com/GuiMilani/${repoName}/${branch}/`;

const outputFile = path.join(root, "strudel.json");
const backupFile = path.join(root, "strudel_backup.json");

// cria backup se existir
if (fs.existsSync(outputFile)) {
  fs.copyFileSync(outputFile, backupFile);
  console.log("📦 Backup criado:", backupFile);
}

const entries = fs.readdirSync(root, { withFileTypes: true });
const json = { _base: baseUrl };

for (const entry of entries) {
  if (!entry.isDirectory()) continue;
  const folder = entry.name;

  if (folder.startsWith(".") || folder === "node_modules") continue;

  const files = fs
    .readdirSync(path.join(root, folder))
    .filter(f => f.match(/\.(wav|mp3|ogg)$/i))
    .sort(); // mantém a ordem

  if (files.length === 0) continue;

  files.forEach((file, i) => {
    const key = i === 0 ? folder : `${folder}${i+1}`; // primeiro arquivo = nome da pasta, os outros = pasta2, pasta3...
    json[key] = `${folder}/${file}`; // caminho relativo
  });
}

fs.writeFileSync(outputFile, JSON.stringify(json, null, 2), "utf8");
console.log("✅ strudel.json gerado com sucesso!");
console.log("👉 Pastas convertidas:", Object.keys(json).filter(k => k !== "_base").join(", "));
console.log("✅ Agora no REPL tu pode chamar: s('kick'), s('kick2'), s('hat') etc.");
