# Environment Configuration Guide

## 📋 Overview

ShopEase requires environment variables for proper configuration. Three template files are provided:

- **`.env`** - Development configuration (update with your local values)
- **`.env.example`** - Reference template (safe to commit)
- **`.env.production`** - Production configuration (NEVER commit)

---

## 🚀 Quick Start

### 1. Copy the Example File
```bash
cp .env.example .env
```

### 2. Update .env for Development
```bash
# At minimum, update:
MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce
JWT_SECRET=dev_secret_key_change_in_production
NODE_ENV=development
```

### 3. For Production
```bash
cp .env.example .env.production
# Update ALL values in .env.production with production credentials
# NEVER commit this file
```

---

## 📝 Variable Categories

### Application Environment
```env
NODE_ENV=development          # development, staging, production
PORT=3000                     # Backend port
FRONTEND_URL=http://localhost:5173
FRONTEND_PROD_URL=https://yourdomain.com
```

### Database
```env
# Local Development
MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce

# Or MongoDB Atlas
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/e-commerce
```

### Authentication
```env
JWT_SECRET=your_secret_key    # Generate: openssl rand -hex 32
JWT_EXPIRY=7d
COOKIE_SECURE=false           # true for production (HTTPS only)
BCRYPT_ROUNDS=10              # Use 12 for production
```

### Email Service
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

### Payment Gateway (Stripe)
```env
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
```

### Cloud Storage (AWS S3)
```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=shopease-uploads
```

### Caching (Redis - Optional)
```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
REDIS_CACHE_TTL=300  # 5 minutes
```

### API Configuration
```env
RATE_LIMIT_WINDOW=15          # minutes
RATE_LIMIT_MAX_REQUESTS=100   # per window
REQUEST_TIMEOUT=30000         # milliseconds
API_VERSION=v1
```

### Feature Flags
```env
ENABLE_ADMIN_DASHBOARD=true
ENABLE_SELLER_DASHBOARD=true
ENABLE_USER_REVIEWS=true
ENABLE_WISHLIST=true
ENABLE_COUPON_SYSTEM=true
ENABLE_RETURNS_SYSTEM=true
ENABLE_DISPUTES_SYSTEM=true
ENABLE_EMAIL_NOTIFICATIONS=false
```

### Security Headers
```env
HSTS_MAX_AGE=31536000         # 1 year
CSP_ENABLED=true
X_FRAME_OPTIONS=DENY
X_CONTENT_TYPE_OPTIONS=nosniff
```

---

## 🔐 Security Best Practices

### 1. Generate Strong JWT Secret
**Node.js:**
```javascript
require('crypto').randomBytes(32).toString('hex')
```

**OpenSSL:**
```bash
openssl rand -hex 32
```

### 2. Development vs Production

**Development (.env):**
- Can use simple values
- DEBUG=true is OK
- localhost URLs are fine
- Self-signed certs acceptable

**Production (.env.production):**
- ✅ Strong, unique JWT_SECRET
- ✅ COOKIE_SECURE=true (HTTPS only)
- ✅ NODE_ENV=production
- ✅ DEBUG=false
- ✅ HTTPS URLs only
- ✅ Real payment gateway keys
- ✅ Production database (MongoDB Atlas)
- ✅ Secure password hashing (BCRYPT_ROUNDS=12)

### 3. Never Commit .env Files
Ensure `.gitignore` includes:
```
.env
.env.*.local
.env.production
```

### 4. Environment-Specific Secrets
Use different keys for each environment:
- Development: Test API keys
- Staging: Staging API keys
- Production: Live API keys

### 5. Secret Rotation
Periodically rotate secrets:
- JWT_SECRET
- Database passwords
- API keys
- Stripe keys

---

## 🔧 Configuration by Environment

### Development Setup
```bash
# 1. Copy template
cp .env.example .env

# 2. Update for local MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/e-commerce

# 3. Set development values
NODE_ENV=development
JWT_SECRET=dev-secret-key-12345
DEBUG=true

# 4. Start backend
npm start
```

### Production Deployment

**Step 1: Create production .env file**
```bash
cp .env.example .env.production
```

**Step 2: Update all production values**
```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/db
JWT_SECRET=[STRONG_RANDOM_SECRET]
COOKIE_SECURE=true
COOKIE_SAME_SITE=strict
DEBUG=false
```

**Step 3: Store securely**
- Use deployment platform's secret management (Vercel, Heroku, AWS Secrets Manager)
- OR use environment variable files with restricted access
- NEVER commit to git

**Step 4: Deploy**
```bash
# Example with Vercel
vercel env add JWT_SECRET
vercel env add MONGODB_URI
# ... add all other variables
vercel deploy --prod
```

---

## 📊 Variable Reference Table

| Variable | Type | Required | Default | Notes |
|----------|------|----------|---------|-------|
| NODE_ENV | string | Yes | development | production, staging, development |
| PORT | number | No | 3000 | Backend server port |
| MONGODB_URI | string | Yes | - | Local or Atlas |
| JWT_SECRET | string | Yes | - | Generate with openssl |
| JWT_EXPIRY | string | No | 7d | Token expiration |
| STRIPE_PUBLIC_KEY | string | No | - | Test or Live key |
| STRIPE_SECRET_KEY | string | No | - | Test or Live key |
| REDIS_HOST | string | No | 127.0.0.1 | Optional caching |
| SMTP_HOST | string | No | - | Email service |
| AWS_S3_BUCKET | string | No | - | File uploads |
| DEBUG | boolean | No | false | Verbose logging |
| CORS_ENABLED | boolean | No | true | Enable CORS |
| ENABLE_ADMIN_DASHBOARD | boolean | No | true | Feature flag |

---

## ✅ Deployment Checklist

Before deploying to production:

- [ ] Copy `.env.example` to `.env.production`
- [ ] Generate strong JWT_SECRET
- [ ] Update MONGODB_URI to production database
- [ ] Set NODE_ENV=production
- [ ] Set DEBUG=false
- [ ] Update all API keys to production
- [ ] Set COOKIE_SECURE=true
- [ ] Configure SSL/TLS certificate
- [ ] Set up email service
- [ ] Configure payment gateway
- [ ] Set up Redis for caching
- [ ] Enable error tracking (Sentry)
- [ ] Configure rate limiting
- [ ] Set up backups
- [ ] Enable monitoring
- [ ] Test all features
- [ ] Verify security headers

---

## 🆘 Troubleshooting

### Issue: "MONGODB_URI is undefined"
**Solution:** Check `.env` file exists and MONGODB_URI is set
```bash
cat .env | grep MONGODB_URI
```

### Issue: "JWT_SECRET is required"
**Solution:** Generate and set JWT_SECRET
```bash
echo "JWT_SECRET=$(openssl rand -hex 32)" >> .env
```

### Issue: "CORS errors"
**Solution:** Verify CORS_ORIGINS includes frontend URL
```env
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Issue: "Email not sending"
**Solution:** Verify SMTP credentials in `.env`
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

---

## 📚 Additional Resources

- [MongoDB Connection String](https://docs.mongodb.com/manual/reference/connection-string/)
- [Express Documentation](https://expressjs.com/)
- [JWT.io](https://jwt.io/)
- [Stripe Documentation](https://stripe.com/docs)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [Redis Documentation](https://redis.io/documentation)

---

## 🎯 Summary

1. **Development**: Copy `.env.example` → `.env`, update local values
2. **Production**: Create `.env.production` with production secrets
3. **Security**: Generate strong JWT_SECRET, use HTTPS, rotate secrets
4. **Never**: Commit `.env` or `.env.production` files
5. **Always**: Use environment variables for sensitive data

Your environment is now properly configured! 🚀
