#!/bin/bash
cd frontend
vercel env rm NEXT_PUBLIC_SANITY_PROJECT_ID production --yes || true
echo "rtpa6pgc" | vercel env add NEXT_PUBLIC_SANITY_PROJECT_ID production

vercel env rm NEXT_PUBLIC_STUDIO_URL production --yes || true
echo "https://devk-studio-kotacom.sanity.studio" | vercel env add NEXT_PUBLIC_STUDIO_URL production

vercel env rm SANITY_API_READ_TOKEN production --yes || true
echo "skGaOqMLGp2kY4vdTtKxoZ4Me9vPVsbwMNMVkaMl4UHJJEy4EylKOvR7wE1afq7UXNR33e6KfyyK4Rz0Je9vuij4056pda1ipwiXLQ7g8MDtkFm1b7baK63ii6UOnsYE98Rbyt3dnQsZ3bLlpdQsASrlnjPHlZOfQ6YU967ixfPAPxK98vdq" | vercel env add SANITY_API_READ_TOKEN production

vercel env rm SANITY_AUTH_TOKEN production --yes || true
echo "skyyYanoz6asKFeHsqX4pAtzsqmdSKlW39qXBHZq0wQpJVAVIpFIlPkiGgDENXM4evYEdXR1hsr0WFsJZUuSKD4sQidFghK41eTuqs0qX7OO4XMOl0V3eit5gwWe4pYCht78pi0Nx8hYGNPNMcMap0fVTaafQq1LEmKTXdM89cb5gS9Wauhz" | vercel env add SANITY_AUTH_TOKEN production

vercel env rm SANITY_DEV production --yes || true
echo "skyyYanoz6asKFeHsqX4pAtzsqmdSKlW39qXBHZq0wQpJVAVIpFIlPkiGgDENXM4evYEdXR1hsr0WFsJZUuSKD4sQidFghK41eTuqs0qX7OO4XMOl0V3eit5gwWe4pYCht78pi0Nx8hYGNPNMcMap0fVTaafQq1LEmKTXdM89cb5gS9Wauhz" | vercel env add SANITY_DEV production
