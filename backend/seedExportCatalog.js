import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from './models/Product.js';
import connectDB from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const catalogPath = path.join(__dirname, 'data', 'products.json');

async function seedCatalog() {
  try {
    await connectDB();
    console.log('[Catalog Seeder] Connected to MongoDB database: quantum_mobile');

    const rawData = fs.readFileSync(catalogPath, 'utf-8');
    const catalog = JSON.parse(rawData);

    console.log(`[Catalog Seeder] Read ${catalog.length} products with colour variants from export archives.`);

    // Remove old products to ensure complete synchronization
    await Product.deleteMany({});
    console.log('[Catalog Seeder] Cleared previous products collection.');

    // Insert all 181 products
    const inserted = await Product.insertMany(catalog);
    console.log(`[Catalog Seeder SUCCESS]: Successfully seeded ${inserted.length} real products with all colour variants!`);

    // Brand and Category stats
    const brandCounts = {};
    const categoryCounts = {};
    let totalFinishes = 0;

    inserted.forEach(p => {
      brandCounts[p.brand] = (brandCounts[p.brand] || 0) + 1;
      categoryCounts[p.category] = (categoryCounts[p.category] || 0) + 1;
      totalFinishes += (p.finishes ? p.finishes.length : 0);
    });

    console.log(`\nTotal Colour Finish Variants across all products: ${totalFinishes}`);
    console.log('\n--- Breakdown by Brand ---');
    console.table(brandCounts);

    console.log('\n--- Breakdown by Category ---');
    console.table(categoryCounts);

    process.exit(0);
  } catch (error) {
    console.error('[Catalog Seeder ERROR]:', error);
    process.exit(1);
  }
}

seedCatalog();
