const fs = require('fs');
const { execSync } = require('child_process');

const secret = "b8e6e5a1-b262-45ae-8276-bc7920df8bc2";

// 1. Append to .env.local
fs.appendFileSync('/home/kotacom/Sanity-clean/frontend/.env.local', `\nREVALIDATE_SECRET="${secret}"\n`);
console.log("Appended to .env.local");

// 2. Add to Vercel
try {
  execSync(`echo "${secret}" | vercel env add REVALIDATE_SECRET production --cwd /home/kotacom/Sanity-clean/frontend`, { stdio: 'inherit' });
  execSync(`echo "${secret}" | vercel env add REVALIDATE_SECRET preview --cwd /home/kotacom/Sanity-clean/frontend`, { stdio: 'inherit' });
  execSync(`echo "${secret}" | vercel env add REVALIDATE_SECRET development --cwd /home/kotacom/Sanity-clean/frontend`, { stdio: 'inherit' });
} catch (e) {
  console.log("Vercel env add might have failed or already exists.");
}
