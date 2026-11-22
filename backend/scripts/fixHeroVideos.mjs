import mongoose from 'mongoose';

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/quantum_mobile');
  console.log('Connected to MongoDB quantum_mobile');

  const col = mongoose.connection.db.collection('ecosystems');

  const updates = [
    {
      slug: 'apple',
      heroVideo: encodeURI('/hero banner/iphone 18.mp4'),
      heroImage: '/APPLE/apple_iphone-18-pro-max_burgundy.webp'
    },
    {
      slug: 'samsung',
      heroVideo: encodeURI('/hero banner/s26.mp4'),
      heroImage: '/s26_ultra.jpg'
    },
    {
      slug: 'google',
      heroVideo: encodeURI('/hero banner/pixel11.mp4'),
      heroImage: '/pixel11_pro_xl.png'
    },
    {
      slug: 'oneplus',
      heroVideo: encodeURI('/hero banner/oneplus.mp4'),
      heroImage: '/oneplus13.jpg'
    },
    {
      slug: 'xiaomi',
      heroVideo: encodeURI('/hero banner/xiaomi11.mp4'),
      heroImage: '/xiaomi15ultra.jpg'
    }
  ];

  for (const item of updates) {
    const res = await col.updateOne(
      { slug: item.slug },
      {
        $set: {
          heroVideo: item.heroVideo,
          heroImage: item.heroImage
        }
      }
    );
    console.log(`Updated ${item.slug}: matched=${res.matchedCount}, modified=${res.modifiedCount}`);
  }

  // Print all verified documents
  const all = await col.find({}, { projection: { slug: 1, brand: 1, heroVideo: 1, heroImage: 1 } }).toArray();
  console.log('--- ALL ECOSYSTEMS IN MONGODB ---');
  console.log(JSON.stringify(all, null, 2));

  await mongoose.disconnect();
}

main().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});

