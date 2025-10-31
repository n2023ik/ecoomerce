const mongoose = require('./db');
const User = require('./models/user');

(async () => {
  try {
    const username = 'Nikhil2004';
    const newPassword = 'Nikhil123@';
    const u = await User.findOne({ username });
    if (!u) {
      console.error('NOT_FOUND: admin user does not exist');
      process.exit(2);
    }
    u.role = 'admin';
    u.password = newPassword; // pre-save hook will hash
    await u.save();
    console.log('✅ Admin password reset and role enforced.');
  } catch (e) {
    console.error('ERR', e);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
})();
