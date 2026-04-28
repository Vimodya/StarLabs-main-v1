const mongoose = require('mongoose');

const testDb = async () => {
  const uri1 = "mongodb+srv://chamodivimodya_db_user:zCK4rGeHrbNK6mmt@starlabs.kr53e1i.mongodb.net/starlabs?retryWrites=true&w=majority";
  const uri2 = "mongodb://chamodivimodya_db_user:zCK4rGeHrbNK6mmt@ac-bt7tb3s-shard-00-00.kr53e1i.mongodb.net:27017,ac-bt7tb3s-shard-00-01.kr53e1i.mongodb.net:27017,ac-bt7tb3s-shard-00-02.kr53e1i.mongodb.net:27017/starlabs?ssl=true&replicaSet=atlas-138nrv-shard-0&authSource=admin&retryWrites=true&w=majority";

  console.log('Testing SRV URI...');
  try {
    await mongoose.connect(uri1, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ SRV URI connected!');
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ SRV URI failed:', err.message);
  }

  console.log('Testing Direct URI...');
  try {
    await mongoose.connect(uri2, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Direct URI connected!');
    await mongoose.disconnect();
  } catch (err) {
    console.log('❌ Direct URI failed:', err.message);
  }
  process.exit(0);
};

testDb();
