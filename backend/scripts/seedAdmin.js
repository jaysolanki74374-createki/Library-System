require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

(async function() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = 'admin@lib.com';
    const existing = await User.findOne({ email });
    if (existing) { console.log('Admin already exists'); process.exit(0); }
    const hash = await bcrypt.hash('admin123', 10);
    const admin = new User({ name: 'Admin', email, passwordHash: hash, role: 'admin' });
    await admin.save();
    console.log('Admin created: admin@lib.local / admin123');
    process.exit(0);
  } catch (err) { console.error(err); process.exit(1); }
})();
