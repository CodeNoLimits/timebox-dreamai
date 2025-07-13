# TimeBox by DreamAI - Deployment Guide

## Web Deployment (Netlify)

### Prerequisites
1. Netlify account
2. GitHub repository connected to Netlify
3. Node.js 18+ installed locally

### Automatic Deployment
1. **Connect Repository**: Link your GitHub repository to Netlify
2. **Build Settings**: Netlify will auto-detect the `netlify.toml` configuration
   - Build command: `npm run build:web`
   - Publish directory: `dist`
   - Node version: 18

### Manual Deployment
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Build the web version
npm run build:web

# Deploy to Netlify
npm run deploy
```

### Environment Variables (Netlify Dashboard)
Set these in Netlify dashboard under Site Settings > Environment Variables:
```
NODE_VERSION=18
NPM_VERSION=9
EXPO_PUBLIC_API_URL=https://api.timebox-dreamai.com
EXPO_PUBLIC_ENVIRONMENT=production
```

## Mobile App Deployment

### iOS App Store
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure iOS build
eas build:configure

# Build for iOS
npm run build:ios

# Submit to App Store
eas submit --platform ios
```

### Google Play Store
```bash
# Build for Android
npm run build:android

# Submit to Play Store
eas submit --platform android
```

## Build Optimization

### Web Bundle Size
- Tree shaking enabled via Metro bundler
- Static assets optimized
- Code splitting for premium features

### Performance Monitoring
- Web Vitals tracking
- Error boundary implementation
- Analytics integration ready

## Security Configuration

### Content Security Policy
Implemented in `netlify.toml`:
- X-Frame-Options: DENY
- X-XSS-Protection enabled
- Content-Type-Options: nosniff
- Strict referrer policy

### API Security
- HTTPS only in production
- API rate limiting configured
- Authentication tokens secured

## Custom Domain Setup

1. **Add Domain**: In Netlify dashboard, add your custom domain
2. **DNS Configuration**: Point your domain to Netlify's load balancer
3. **SSL Certificate**: Automatically provisioned by Netlify

### Recommended Domain Structure
- `app.timebox-dreamai.com` - Main web application
- `api.timebox-dreamai.com` - Backend API
- `docs.timebox-dreamai.com` - Documentation

## Monitoring & Analytics

### Error Tracking
Ready for integration with:
- Sentry for error monitoring
- LogRocket for session replay
- Mixpanel for analytics

### Performance Monitoring
- Lighthouse CI integration
- Core Web Vitals tracking
- Real User Monitoring (RUM)

## CI/CD Pipeline

### GitHub Actions (Recommended)
```yaml
name: Deploy to Netlify
on:
  push:
    branches: [ main ]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build:web
      - uses: netlify/actions/deploy@master
        with:
          publish-dir: './dist'
          production-branch: main
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Backup & Recovery

### Data Backup
- User data exported daily
- Configuration backups
- Version rollback capability

### Disaster Recovery
- Multi-region deployment ready
- Database replication configured
- Automated failover procedures

## Support & Maintenance

### Health Checks
- Automated uptime monitoring
- API endpoint health checks
- Performance regression testing

### Update Procedures
- Staged deployment process
- A/B testing capability
- Rollback procedures documented

---

## Quick Start Checklist

- [ ] Repository connected to Netlify
- [ ] Environment variables configured
- [ ] Custom domain added (optional)
- [ ] SSL certificate active
- [ ] Error monitoring setup
- [ ] Analytics configured
- [ ] Mobile app builds configured
- [ ] CI/CD pipeline active

## Support
For deployment issues, contact: dev@dreamai.com