#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const juice = require("juice");

const PUBLIC_DIR = path.resolve(__dirname, "../public");
const OUT_DIR = path.resolve(__dirname, "../email-ready");

const slug = process.argv[2];
if (!slug) {
  console.error("Usage: node scripts/email-export.js <post-slug>");
  process.exit(1);
}

const srcPath = path.join(PUBLIC_DIR, "posts", slug, "email.html");
if (!fs.existsSync(srcPath)) {
  console.error(`Not found: ${srcPath}\nDid you run "hugo" first?`);
  process.exit(1);
}

const rawHtml = fs.readFileSync(srcPath, "utf8");
const html = juice(rawHtml);

if (!html.includes("{{ unsubscribe_url }}")) {
  console.warn("⚠️  No {{ unsubscribe_url }} tag found — Buttondown will reject this.");
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, `${slug}.html`);
fs.writeFileSync(outPath, html);
console.log(`✅ Wrote ${outPath}`);
