# Doppler Quick Setup

## 1. Sign up at doppler.com (free)

## 2. Install CLI
```bash
# macOS
brew install dopplerhq/cli/doppler

# Ubuntu/Debian  
sudo apt-get install doppler

# Or use their install script
curl -Ls https://cli.doppler.com/install.sh | sh
```

## 3. Login and Setup
```bash
doppler login
doppler setup
```

## 4. Create your project
```bash
doppler projects create aquietplace
doppler secrets set OPENAI_API_KEY "sk-..."
```

## 5. In your React app
```javascript
// Install: npm install @doppler/sdk

// Option A: Use in backend/edge function
import { Doppler } from '@doppler/sdk';
const doppler = new Doppler({ token: process.env.DOPPLER_TOKEN });

export async function getApiKey(keyName) {
  const secrets = await doppler.secrets.list();
  return secrets[keyName];
}

// Option B: Use Doppler CLI locally
// Run your app with: doppler run -- npm start
// All secrets are injected as env vars automatically
const apiKey = process.env.OPENAI_API_KEY; // It's just there!
```

## 6. Deploy with Vercel
```bash
# Connect Doppler to Vercel
doppler integrations create vercel

# Now all your secrets sync automatically
```

## Benefits:
- Never commit secrets to code
- Change keys without redeploying  
- Different keys for dev/staging/prod
- Team access controls
- Audit logs
- Works with any language/framework