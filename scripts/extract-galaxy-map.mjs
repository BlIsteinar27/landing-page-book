// scripts/extract-galaxy-map.mjs
import { readFile } from "node:fs/promises";
import sharp from "sharp";

const svg = await readFile("public/landing-book-victoria/mapa-galaxias.svg", "utf8");
const match = svg.match(/base64,([A-Za-z0-9+/=]+)/);
if (!match) throw new Error("No se encontró imagen base64 en el SVG");

const buffer = Buffer.from(match[1], "base64");
await sharp(buffer)
  .webp({ quality: 82 })
  .toFile("public/landing-book-victoria/mapa-galaxias.webp");

console.log("OK — mapa-galaxias.webp generado");
