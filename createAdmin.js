require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./server/models/User');

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URL || process.env.MONGODB_URI);
  const existing = await User.findOne({ username: 'Author' });
  if (existing) {
    console.log('✦ Admin user already exists');
    process.exit(0);
  }
  await User.create({
    username: 'Author',
    email: 'admin@WonderBlog.com',
    password: 'Orooluwaiyanumi',
    userType: 'admin',
  });
  console.log('✦ Admin user created: Author / Orooluwaiyanumi');
  process.exit(0);
}

createAdmin().catch(err => { console.error(err); process.exit(1); });
