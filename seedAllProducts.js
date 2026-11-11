// seedAllProducts.js – generate product entries from images in public/APPLE
// Adjust DB insertion logic to match your project (Prisma, Sequelize, etc.).

import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Folder containing product images (relative to project root)
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const IMAGE_DIR = path.join(__dirname, 'public', 'APPLE');

// Colour keywords – extend as needed
const COLOURS = ['black', 'blue', 'white', 'pink', 'natural', 'silver', 'gold', 'red', 'green', 'purple'];

// Load price map (product name -> price in LKR)
let priceMap = {};
try {
  const priceModule = await import('./priceMap.json', { assert: { type: 'json' } });
  priceMap = priceModule.default;
} catch (e) {
  // No price map yet – defaults to 0
}

function parseFileName(fileName) {
  const name = fileName.replace(/\.[^.]+$/, '').trim();
  const lower = name.toLowerCase();
  const colour = COLOURS.find(c => lower.includes(c)) || 'Standard';
  let modelPart = name
    .replace(new RegExp(COLOURS.join('|'), 'gi'), '')
    .replace(/\s*\d+[xX]\d+\s*/g, '')
    .replace(/\s*\d+\s*/g, '')
    .replace(/\s*\(.*?\)\s*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  modelPart = modelPart
    .replace(/apple[-\s]?i?phone\s*/i, '')
    .replace(/iphone\s*/i, '')
    .replace(/^\d+\s*/g, '')
    .trim();
  const model = modelPart
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ');
  return { model: model || 'iPhone', colour };
}

async function insertProduct(product) {
  // Apply price if available
  if (priceMap[product.name]) {
    product.priceLKR = priceMap[product.name];
  }
  // Insert product into the database using Prisma
  try {
    await prisma.product.create({ data: product });
    console.log('Inserted', product.name);
  } catch (err) {
    console.error('Failed to insert', product.name, err);
  }
}

async function main() {
  const files = fs.readdirSync(IMAGE_DIR);
  let idCounter = 1;
  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) continue;
    const { model, colour } = parseFileName(file);
    const product = {
      id: idCounter++,
      name: `${model}${colour !== 'Standard' ? ' ' + colour : ''}`,
      model,
      colour,
      imageUrl: `/APPLE/${file}`,
      priceLKR: 0,
      description: `Apple ${model} – ${colour.toLowerCase()} colour variant.`
    };
    await insertProduct(product);
  }
}

main().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
