import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import Product from '../models/Product.js';
import seedProducts from './productsSeed.js';

dotenv.config();

const importData = async () => {
  try {
    const isConnected = await connectDB();
    if (!isConnected) {
      console.log('[Seed] Skipped database seed since MongoDB server is offline.');
      process.exit(0);
    }

    await Product.deleteMany();
    await Product.insertMany(seedProducts);

    console.log('✅ [Seed] Goldmart Jewellery Product Data Seeded Successfully!');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seed] Error seeding data: ${error.message}`);
    process.exit(1);
  }
};

importData();
