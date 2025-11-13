const mongoose = require('mongoose');

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/e-commerce';
const dbUrl = process.env.MONGODB_URI || DEFAULT_URI;

async function connectWithRetry() {
  try {
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`✅ Connected to MongoDB: ${dbUrl}`);
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⏳ Retrying in 5s...');
    setTimeout(connectWithRetry, 5000);
  }
}

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

connectWithRetry();

module.exports = mongoose;
