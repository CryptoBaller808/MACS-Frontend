# MACS Multichain Wallet Deployment Guide

## 🚀 Production Deployment

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Git for version control
- Access to hosting platform (Vercel, Netlify, AWS, etc.)

### 1. Environment Configuration

#### Create Production Environment File
```bash
cp .env.example .env.production
```

#### Configure Production Variables
```bash
# Production RPC endpoints (use paid services for reliability)
VITE_POLYGON_RPC_URL=https://polygon-mainnet.infura.io/v3/YOUR_PROJECT_ID
VITE_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com

# Production contract addresses
VITE_MACS_TOKEN_POLYGON=0x... # Your deployed Polygon contract
VITE_MACS_TOKEN_SOLANA=...    # Your deployed Solana program

# Analytics and monitoring
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://...@sentry.io/...

# Feature flags for production
VITE_DEV_MODE=false
VITE_DEBUG_LOGGING=false
VITE_MOCK_WALLETS=false
```

### 2. Build for Production

#### Install Dependencies
```bash
npm install
```

#### Create Production Build
```bash
npm run build
```

#### Test Production Build Locally
```bash
npm run preview
```

### 3. Deployment Options

#### Option A: Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel --prod

# Configure environment variables in Vercel dashboard
```

#### Option B: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=dist

# Configure environment variables in Netlify dashboard
```

#### Option C: AWS S3 + CloudFront
```bash
# Build the project
npm run build

# Upload dist/ contents to S3 bucket
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

#### Option D: Traditional Web Hosting
```bash
# Build the project
npm run build

# Upload contents of dist/ folder to your web server
# Ensure your server is configured to serve index.html for all routes
```

### 4. Domain Configuration

#### Custom Domain Setup
1. Configure DNS records to point to your hosting platform
2. Set up SSL certificate (usually automatic with modern platforms)
3. Configure redirects (www to non-www or vice versa)

#### Example DNS Configuration
```
Type: A
Name: @
Value: [Your hosting platform IP]

Type: CNAME  
Name: www
Value: [Your hosting platform domain]
```

### 5. Performance Optimization

#### Pre-deployment Checklist
- [ ] Bundle size optimized (check with `npm run build`)
- [ ] Images compressed and optimized
- [ ] Unused dependencies removed
- [ ] Code splitting implemented
- [ ] Service worker configured (if needed)

#### Performance Monitoring
```bash
# Analyze bundle size
npm run build -- --analyze

# Run Lighthouse audit
npx lighthouse https://your-domain.com --view
```

### 6. Security Configuration

#### Content Security Policy (CSP)
Add to your hosting platform or server configuration:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://polygon-rpc.com https://api.mainnet-beta.solana.com;
```

#### HTTPS Configuration
Ensure all traffic is served over HTTPS:
```
# Redirect HTTP to HTTPS (server configuration)
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}
```

### 7. Monitoring and Analytics

#### Error Tracking with Sentry
```javascript
// Already configured in the app
// Just set VITE_SENTRY_DSN in environment variables
```

#### Google Analytics
```javascript
// Already configured in the app  
// Just set VITE_GA_TRACKING_ID in environment variables
```

#### Uptime Monitoring
Set up monitoring with services like:
- Pingdom
- UptimeRobot  
- StatusCake

### 8. CI/CD Pipeline

#### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### 9. Backup and Recovery

#### Database Backup (if applicable)
- Set up automated backups of any user data
- Test recovery procedures regularly

#### Code Backup
- Ensure code is backed up in version control
- Tag releases for easy rollback

### 10. Post-Deployment Testing

#### Functional Testing Checklist
- [ ] Wallet connections work on all supported browsers
- [ ] Bridge functionality operates correctly
- [ ] Charts and analytics display properly
- [ ] Mobile responsiveness verified
- [ ] Performance meets requirements

#### Browser Testing
Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 11. Maintenance

#### Regular Updates
- Monitor for security updates in dependencies
- Update RPC endpoints if needed
- Review and update environment variables
- Monitor performance metrics

#### Scaling Considerations
- Monitor traffic and resource usage
- Consider CDN for global performance
- Implement caching strategies
- Plan for increased load

---

## 🆘 Troubleshooting

### Common Deployment Issues

#### Build Failures
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variable Issues
- Ensure all required variables are set
- Check variable names (must start with VITE_)
- Verify values are properly escaped

#### Wallet Connection Issues
- Verify RPC endpoints are accessible
- Check contract addresses are correct
- Ensure CORS is properly configured

### Support Resources
- GitHub Issues: Report bugs and get help
- Discord Community: Real-time support
- Documentation: Comprehensive guides
- Email Support: Direct technical assistance

---

**Ready to empower global creativity! 🎭🌍✨**

