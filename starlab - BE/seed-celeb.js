import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Celebrity from './src/models/Celebrity.js';

dotenv.config();

const seedData = [
  {
    name: 'Addison Rae',
    slug: 'addison-rae',
    category: 'Lifestyle',
    bio: 'Addison Rae is a global celebrity and beauty entrepreneur.',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Kylie Jenner',
    slug: 'kylie-jenner',
    category: 'Beauty',
    bio: 'Kylie Jenner is a media personality, socialite, model, and businesswoman.',
    profilePicture: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Selena Gomez',
    slug: 'selena-gomez',
    category: 'Music',
    bio: 'Selena Gomez is an American singer, songwriter, actress, and producer.',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Alix Earle',
    slug: 'alix-earle',
    category: 'Lifestyle',
    bio: 'Alix Earle is a social media personality known for her lifestyle and beauty content.',
    profilePicture: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Ashley Graham',
    slug: 'ashley-graham',
    category: 'Fashion',
    bio: 'Ashley Graham is a model, designer, and author known for promoting body positivity.',
    profilePicture: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Brie Garcia',
    slug: 'brie-garcia',
    category: 'Entertainment',
    bio: 'Brie Garcia is a professional wrestler and television personality.',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Brooks Nader',
    slug: 'brooks-nader',
    category: 'Fashion',
    bio: 'Brooks Nader is a model known for her work with Sports Illustrated.',
    profilePicture: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Coco Austin',
    slug: 'coco-austin',
    category: 'Entertainment',
    bio: 'Coco Austin is a web personality, actress, and glamour model.',
    profilePicture: 'https://images.unsplash.com/photo-1502441707523-b401da06fb3d?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Eva Longoria',
    slug: 'eva-longoria',
    category: 'Entertainment',
    bio: 'Eva Longoria is an actress, producer, and director known for Desperate Housewives.',
    profilePicture: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Hailey Bieber',
    slug: 'hailey-bieber',
    category: 'Beauty',
    bio: 'Hailey Bieber is a model and creator of Rhode skin.',
    profilePicture: 'https://images.unsplash.com/photo-1530577197743-7ade188b4d83?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Ice Spice',
    slug: 'ice-spice',
    category: 'Music',
    bio: 'Ice Spice is an American rapper known for her unique sound.',
    profilePicture: 'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Lindsey Vonn',
    slug: 'lindsey-vonn',
    category: 'Sports',
    bio: 'Lindsey Vonn is a retired World Cup alpine ski racer.',
    profilePicture: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Madison Beer',
    slug: 'madison-beer',
    category: 'Music',
    bio: 'Madison Beer is a singer and songwriter.',
    profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Neil Patrick Harris',
    slug: 'neil-patrick-harris',
    category: 'Entertainment',
    bio: 'Neil Patrick Harris is an actor, singer, and producer.',
    profilePicture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Nikki Garcia',
    slug: 'nikki-garcia',
    category: 'Entertainment',
    bio: 'Nikki Garcia is a professional wrestler and television personality.',
    profilePicture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Post Malone',
    slug: 'post-malone',
    category: 'Music',
    bio: 'Post Malone is a singer, rapper, and songwriter.',
    profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Snoop Dogg',
    slug: 'snoop-dogg',
    category: 'Music',
    bio: 'Snoop Dogg is an iconic rapper, songwriter, and media personality.',
    profilePicture: 'https://images.unsplash.com/photo-1533227268428-f9ed0900fb3b?w=400&h=400&fit=crop',
    isVerified: true,
  },
  {
    name: 'Travis Scott',
    slug: 'travis-scott',
    category: 'Music',
    bio: 'Travis Scott is a rapper, singer, songwriter, and record producer.',
    profilePicture: 'https://images.unsplash.com/photo-1510776478151-7a38b17ad012?w=400&h=400&fit=crop',
    isVerified: true,
  }
];

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Seeding celebrities...');
        
        await Celebrity.deleteMany({}); // Optional: start fresh
        const result = await Celebrity.insertMany(seedData);
        console.log(`Seeded ${result.length} celebrities.`);
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

seed();
