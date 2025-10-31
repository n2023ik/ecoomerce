const mongoose = require('./db');
const User = require('./models/user');

(async () => {
  try {
    const u = await User.findOne({ username: 'Nikhil2004' })
    if (!u) {
      console.log('NOT_FOUND')
      process.exit(2)
    }
    const ok = await u.comparePassword('Nikhil123@')
    console.log('FOUND', u.username, 'ROLE', u.role, 'PASS_OK', ok)
    process.exit(ok ? 0 : 3)
  } catch (e) {
    console.error('ERR', e)
    process.exit(1)
  } finally {
    await mongoose.disconnect()
  }
})()
