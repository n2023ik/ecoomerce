const mongoose = require('./db');
const User = require('./models/user');
const bcrypt = require('bcryptjs');

(async () => {
  try {
    const username = 'Nikhil2004';
    const newPassword = 'Nikhil123@';
    const hash = await bcrypt.hash(newPassword, 10);
    const res = await User.updateOne({ username }, { $set: { password: hash, role: 'admin' } });
    console.log('updateOne result:', res);
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
