import dotenv from 'dotenv';
import { connectToDatabase } from '../config/db.js';
import { User } from '../models/User.js';

dotenv.config();

async function main() {
  await connectToDatabase();
  const email = process.env.ADMIN_EMAIL || 'admin@example.com';
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin123';
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({ email, username, password, role: 'admin' });
    console.log('Admin user created:', email);
  } else {
    user.role = 'admin';
    if (process.env.RESET_ADMIN_PASSWORD === 'true') user.password = password;
    await user.save();
    console.log('Admin user ensured:', email);
  }
  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });

