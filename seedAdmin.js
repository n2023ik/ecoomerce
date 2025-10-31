const User = require('./models/user');
const mongoose = require('./db');

async function ensureAdmin() {
  try {
    console.log('🔐 Seeding admin user...')
    const username = 'Nikhil2004'
    const email = 'nikhil2004@example.com'
    const password = 'Nikhil123@'

    let user = await User.findOne({ username })
    if (user) {
      if (user.role !== 'admin') {
        user.role = 'admin'
        // If password change desired, set and let pre-save hook hash
        user.password = password
      }
    } else {
      user = new User({ username, email, password, role: 'admin' })
    }

    await user.save()
    console.log(`✅ Admin ready: ${username} / (password set)`)
  } catch (err) {
    console.error('Failed to seed admin:', err)
  } finally {
    await mongoose.disconnect()
    process.exit(0)
  }
}

ensureAdmin()
