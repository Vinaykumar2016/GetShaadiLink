import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const DEPLOY_DIR = path.join(process.cwd(), 'deploy');

console.log('Starting deployment packaging...');

// 1. Build the production files
console.log('Running npm run build...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Clean or create deploy folder
if (fs.existsSync(DEPLOY_DIR)) {
  console.log('Cleaning old deploy folder...');
  fs.rmSync(DEPLOY_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DEPLOY_DIR);

// 3. Copy dist folder
console.log('Copying dist folder...');
fs.cpSync(path.join(process.cwd(), 'dist'), path.join(DEPLOY_DIR, 'dist'), { recursive: true });

// 4. Create empty data structure
console.log('Creating data/invitations directory...');
fs.mkdirSync(path.join(DEPLOY_DIR, 'data'), { recursive: true });
fs.mkdirSync(path.join(DEPLOY_DIR, 'data', 'invitations'), { recursive: true });

// 5. Create production package.json
console.log('Creating production package.json...');
const prodPackage = {
  name: "get-shaadi-link",
  version: "1.0.0",
  type: "module",
  main: "server.js",
  scripts: {
    "start": "node dist/server.cjs"
  },
  dependencies: {
    "express": "^4.21.2",
    "@google/genai": "^2.4.0",
    "dotenv": "^17.2.3"
  }
};
fs.writeFileSync(
  path.join(DEPLOY_DIR, 'package.json'),
  JSON.stringify(prodPackage, null, 2),
  'utf-8'
);

// 6. Create root entry server.js
console.log('Creating root entry server.js...');
fs.writeFileSync(
  path.join(DEPLOY_DIR, 'server.js'),
  "import './dist/server.cjs';\n",
  'utf-8'
);

// 7. Create .env.example
console.log('Creating .env.example...');
const envExample = `# GetShaadiLink Production Environment Configuration
# Add these variables in the Hostinger hPanel Node.js dashboard, or rename this file to .env:

GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
`;
fs.writeFileSync(
  path.join(DEPLOY_DIR, '.env.example'),
  envExample,
  'utf-8'
);

console.log('Deployment packaging complete! Folder: ./deploy');
