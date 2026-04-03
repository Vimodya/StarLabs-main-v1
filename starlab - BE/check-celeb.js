import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Celebrity from './src/models/Celebrity.js';

dotenv.config();

const checkCelebrities = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Celebrity.countDocuments();
        console.log(`Total celebrities: ${count}`);
        
        const all = await Celebrity.find();
        console.log('List:');
        all.forEach(c => console.log(`- ${c.name} (slug: ${c.slug}, _id: ${c._id})`));
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

checkCelebrities();
