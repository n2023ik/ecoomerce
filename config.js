/**
 * Environment Configuration Module
 * Loads and validates environment variables
 */

require('dotenv').config();

const requiredVars = [
  'NODE_ENV',
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
];

const optionalVars = [
  'DEBUG',
  'CORS_ENABLED',
  'REDIS_HOST',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
  'AWS_S3_BUCKET',
  'SMTP_HOST',
  'SENTRY_DSN',
];

// Validate required variables
const missingVars = requiredVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingVars.forEach(varName => {
    console.error(`   - ${varName}`);
  });
  console.error('\n📝 Copy .env.example to .env and update required values');
  process.exit(1);
}

// Warn about missing optional variables
const missingOptional = optionalVars.filter(varName => !process.env[varName]);
if (missingOptional.length > 0 && process.env.DEBUG === 'true') {
  console.warn('⚠️  Missing optional environment variables:');
  missingOptional.forEach(varName => {
    console.warn(`   - ${varName}`);
  });
}

// Configuration object
const config = {
  // Application
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 10) || 3000,
  debug: process.env.DEBUG === 'true',

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  frontendProdUrl: process.env.FRONTEND_PROD_URL,

  // Database
  mongodbUri: process.env.MONGODB_URI,
  dbName: process.env.DB_NAME || 'e-commerce',

  // Authentication
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiry: process.env.JWT_EXPIRY || '7d',
  
  // Cookies
  cookie: {
    name: process.env.COOKIE_NAME || 'auth_token',
    maxAge: parseInt(process.env.COOKIE_MAX_AGE, 10) || 604800000, // 7 days
    secure: process.env.COOKIE_SECURE === 'true',
    httpOnly: process.env.COOKIE_HTTP_ONLY !== 'false',
    sameSite: process.env.COOKIE_SAME_SITE || 'lax',
  },

  // Password hashing
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS, 10) || 10,

  // Email
  smtp: {
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || 587,
    user: process.env.SMTP_USER,
    password: process.env.SMTP_PASSWORD,
    from: process.env.SMTP_FROM || 'noreply@shopease.com',
    fromName: process.env.SMTP_FROM_NAME || 'ShopEase',
  },

  // Payment Gateway
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY,
    secretKey: process.env.STRIPE_SECRET_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  },

  // Cloud Storage
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET,
  },

  // Logging
  logLevel: process.env.LOG_LEVEL || 'info',
  sentryDsn: process.env.SENTRY_DSN,

  // Cache
  redis: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB, 10) || 0,
    cacheTtl: parseInt(process.env.REDIS_CACHE_TTL, 10) || 300,
  },

  // API
  rateLimit: {
    window: parseInt(process.env.RATE_LIMIT_WINDOW, 10) || 15, // minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 10) || 100,
  },
  requestTimeout: parseInt(process.env.REQUEST_TIMEOUT, 10) || 30000,
  apiVersion: process.env.API_VERSION || 'v1',

  // Admin & Seller
  adminCommission: parseInt(process.env.ADMIN_COMMISSION, 10) || 10,
  sellerCommission: parseInt(process.env.SELLER_COMMISSION, 10) || 20,
  minWithdrawal: parseInt(process.env.MIN_WITHDRAWAL, 10) || 1000,

  // CORS
  corsEnabled: process.env.CORS_ENABLED !== 'false',
  corsOrigins: (process.env.CORS_ORIGINS || 'http://localhost:5173').split(','),

  // File Upload
  maxUploadSize: parseInt(process.env.MAX_UPLOAD_SIZE, 10) || 10485760, // 10MB
  allowedFileTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,gif').split(','),
  uploadDir: process.env.UPLOAD_DIR || './uploads',

  // Feature Flags
  features: {
    adminDashboard: process.env.ENABLE_ADMIN_DASHBOARD !== 'false',
    sellerDashboard: process.env.ENABLE_SELLER_DASHBOARD !== 'false',
    reviews: process.env.ENABLE_USER_REVIEWS !== 'false',
    wishlist: process.env.ENABLE_WISHLIST !== 'false',
    couponSystem: process.env.ENABLE_COUPON_SYSTEM !== 'false',
    returnsSystem: process.env.ENABLE_RETURNS_SYSTEM !== 'false',
    disputesSystem: process.env.ENABLE_DISPUTES_SYSTEM !== 'false',
    emailNotifications: process.env.ENABLE_EMAIL_NOTIFICATIONS === 'true',
    smsNotifications: process.env.ENABLE_SMS_NOTIFICATIONS === 'true',
  },

  // OAuth
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  },
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },

  // Analytics
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID,

  // Background Jobs
  backgroundJobs: {
    enabled: process.env.ENABLE_BACKGROUND_JOBS !== 'false',
    queueEnabled: process.env.JOB_QUEUE_ENABLED !== 'false',
  },

  // Security Headers
  securityHeaders: {
    hstsMaxAge: parseInt(process.env.HSTS_MAX_AGE, 10) || 31536000,
    cspEnabled: process.env.CSP_ENABLED !== 'false',
    xFrameOptions: process.env.X_FRAME_OPTIONS || 'DENY',
    xContentTypeOptions: process.env.X_CONTENT_TYPE_OPTIONS || 'nosniff',
  },

  // Performance
  compression: process.env.COMPRESSION_ENABLED !== 'false',
  cacheStrategy: process.env.CACHE_STRATEGY || 'redis', // memory, redis, none
  apiCacheTtl: parseInt(process.env.API_CACHE_TTL, 10) || 300,
};

// Log configuration (development only)
if (config.debug) {
  console.log('📋 Environment Configuration Loaded:');
  console.log(`   Environment: ${config.env}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   MongoDB: Connected`);
  console.log(`   JWT: Configured`);
  console.log(`   CORS: ${config.corsEnabled ? 'Enabled' : 'Disabled'}`);
  console.log(`   Cache: ${config.cacheStrategy}`);
}

module.exports = config;
