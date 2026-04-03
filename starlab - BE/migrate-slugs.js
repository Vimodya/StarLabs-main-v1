import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Celebrity from './src/models/Celebrity.js';

dotenv.config();

const migrateSlugs = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Migrating slugs...');

    const celebrities = await Celebrity.find({ slug: { $exists: false } });
    console.log(`Found ${celebrities.length} celebrities without slugs.`);

    for (const celeb of celebrities) {
      celeb.slug = celeb.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      await celeb.save();
      console.log(`Created slug for ${celeb.name}: ${celeb.slug}`);
    }

    console.log('Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
};

migrateSlugs();
